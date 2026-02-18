import { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaMicrophone, FaTimes, FaRobot, FaStop, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const API_BASE = 'http://localhost:5000/api';

// Language display names for the detected-language badge
const LANGUAGE_NAMES = {
  en: 'English', hi: 'हिंदी', ta: 'தமிழ்', te: 'తెలుగు',
  kn: 'ಕನ್ನಡ', ml: 'മലയാളം', bn: 'বাংলা', mr: 'मराठी',
  gu: 'ગુજરાતી', or: 'ଓଡ଼ିଆ', pa: 'ਪੰਜਾਬੀ',
};

/** Remove markdown so TTS doesn't read asterisks aloud */
function stripMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^#+\s+/gm, '')
    .replace(/^[-*]\s+/gm, '')
    .replace(/`[^`]+`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[^\S\r\n]+/g, ' ')
    .trim();
}

/**
 * Simple Markdown Renderer for Chat Messages
 */
const MarkdownText = ({ content }) => {
  const lines = content.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, lineIndex) => {
        if (!line.trim()) return <div key={`empty-${lineIndex}`} className="h-1" />;
        const parts = [];
        let lastIndex = 0;
        const boldRegex = /\*\*(.*?)\*\*/g;
        let match;
        while ((match = boldRegex.exec(line)) !== null) {
          if (match.index > lastIndex) parts.push(line.substring(lastIndex, match.index));
          parts.push(
            <strong key={`bold-${lineIndex}-${match.index}`} className="font-bold text-slate-900 dark:text-white">
              {match[1]}
            </strong>
          );
          lastIndex = match.index + match[0].length;
        }
        if (lastIndex < line.length) parts.push(line.substring(lastIndex));
        return (
          <div key={`line-${lineIndex}`} className="leading-relaxed">
            {parts.length > 0 ? parts : line}
          </div>
        );
      })}
    </div>
  );
};

/**
 * ChatBot Component - AI-powered virtual assistant
 * Features: Text & voice input (Groq Whisper STT), multilingual TTS (Sarvam AI / ElevenLabs),
 * auto language detection, conversation history
 */
function ChatBot({ user, isOpen, onClose, sendMessage }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hey! I'm your AalayaX AI assistant. I can help you find products, answer questions, and give recommendations. What are you looking for today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Voice states
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [detectedLanguage, setDetectedLanguage] = useState('en');

  const [userLocation, setUserLocation] = useState(null);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const currentAudioRef = useRef(null);
  const backendSttAvailable = useRef(false);

  // Check which voice services are configured on the backend
  useEffect(() => {
    fetch(`${API_BASE}/voice/status`)
      .then(r => r.json())
      .then(data => {
        backendSttAvailable.current = data.stt?.groq || false;
        console.log('🎙️ Voice services:', data);
      })
      .catch(() => { /* backend may not be running yet */ });
  }, []);

  // Get geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ─── RECORDING ──────────────────────────────────────────────

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        await handleTranscribe(blob, mimeType);
      };

      recorder.start(250);
      setIsRecording(true);
    } catch (err) {
      alert('Microphone access denied. Please allow microphone permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => (isRecording ? stopRecording() : startRecording());

  // ─── STT ────────────────────────────────────────────────────

  const handleTranscribe = async (blob, mimeType) => {
    setIsTranscribing(true);
    try {
      if (backendSttAvailable.current) {
        // Groq Whisper via backend — auto-detects Hindi/Tamil/Telugu/etc.
        const formData = new FormData();
        const ext = mimeType.split('/')[1].split(';')[0];
        formData.append('audio', blob, `recording.${ext}`);

        const res = await fetch(`${API_BASE}/voice/stt`, { method: 'POST', body: formData });
        if (!res.ok) throw new Error('STT failed');
        const { text, language } = await res.json();
        if (text) {
          setDetectedLanguage(language || 'en');
          setInput(text);
        }
      } else {
        // Web Speech API fallback (browser built-in, multi-accent Hindi works well)
        useFallbackSpeech();
      }
    } catch (err) {
      console.warn('Backend STT failed, using browser fallback:', err.message);
      useFallbackSpeech();
    } finally {
      setIsTranscribing(false);
    }
  };

  const useFallbackSpeech = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice not supported in this browser.'); return; }
    const r = new SR();
    r.continuous = false;
    r.interimResults = false;
    r.lang = 'hi-IN'; // broad coverage for Indian accents
    r.onresult = e => setInput(e.results[0][0].transcript);
    r.onerror = () => {};
    r.start();
  };

  // ─── TTS ────────────────────────────────────────────────────

  const speakText = async (text, language = 'en') => {
    if (!ttsEnabled) return;
    stopSpeaking();
    const clean = stripMarkdown(text);
    if (!clean) return;
    setIsSpeaking(true);
    try {
      const res = await fetch(`${API_BASE}/voice/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: clean, language }),
      });
      if (!res.ok) throw new Error('TTS failed');
      const audioBlob = await res.blob();
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);
      currentAudioRef.current = audio;
      audio.onended = () => { setIsSpeaking(false); URL.revokeObjectURL(url); };
      audio.onerror = () => setIsSpeaking(false);
      audio.play();
    } catch {
      // Browser fallback
      try {
        const u = new SpeechSynthesisUtterance(clean);
        u.lang = language === 'hi' ? 'hi-IN' : 'en-US';
        u.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(u);
      } catch { setIsSpeaking(false); }
    }
  };

  const stopSpeaking = () => {
    if (currentAudioRef.current) { currentAudioRef.current.pause(); currentAudioRef.current = null; }
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  // ─── CHAT ────────────────────────────────────────────────────

  const handleSend = async (textOverride) => {
    const messageText = textOverride || input;
    if (!messageText.trim() || isLoading) return;
    setMessages(prev => [...prev, { role: 'user', content: messageText, timestamp: new Date() }]);
    setInput('');
    setIsLoading(true);
    try {
      const response = await sendMessage(messageText, userLocation, detectedLanguage);
      const content = response.response || response;
      setMessages(prev => [...prev, {
        role: 'assistant', content, timestamp: new Date(),
        recommendations: response.recommendations || null,
        language: detectedLanguage,
      }]);
      if (typeof content === 'string') speakText(content, detectedLanguage);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(), error: true,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[630px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-slate-700">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <FaRobot className="text-slate-800 text-xl" />
          </div>
          <div>
            <h3 className="font-bold">AalayaX AI Assistant</h3>
            <div className="flex items-center gap-2">
              <p className="text-xs text-slate-300">Always here to help</p>
              {detectedLanguage !== 'en' && (
                <span className="text-xs bg-indigo-600 px-2 py-0.5 rounded-full">
                  {LANGUAGE_NAMES[detectedLanguage] || detectedLanguage}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setTtsEnabled(v => !v); stopSpeaking(); }}
            className={`p-2 rounded-full transition ${
              ttsEnabled ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'text-slate-400 hover:bg-slate-700'
            }`}
            title={ttsEnabled ? 'Mute voice responses' : 'Enable voice responses'}
          >
            {ttsEnabled ? <FaVolumeUp size={13} /> : <FaVolumeMute size={13} />}
          </button>
          <button onClick={onClose} className="text-white hover:bg-slate-700 p-2 rounded-full transition">
            <FaTimes />
          </button>
        </div>
      </div>

      {/* Status bar */}
      {(isRecording || isTranscribing || isSpeaking) && (
        <div className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
          {isRecording && <><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block" /> Recording — tap ■ to stop</>}
          {isTranscribing && <><span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse inline-block" /> Transcribing…</>}
          {isSpeaking && (
            <><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" /> Speaking…
              <button onClick={stopSpeaking} className="ml-auto underline">Stop</button>
            </>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-800">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              message.role === 'user'
                ? 'bg-slate-800 text-white rounded-br-none'
                : message.error
                ? 'bg-red-100 text-red-800 rounded-bl-none'
                : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm rounded-bl-none border border-gray-200 dark:border-slate-600'
            }`}>
              {message.role === 'user'
                ? <p className="text-sm leading-relaxed">{message.content}</p>
                : <MarkdownText content={message.content} />}
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-xs opacity-60">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                {message.role === 'assistant' && !message.error && ttsEnabled && (
                  <button
                    onClick={() => speakText(message.content, message.language || 'en')}
                    className="text-xs opacity-40 hover:opacity-100 ml-2 transition"
                    title="Read aloud"
                  >
                    <FaVolumeUp size={11} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-700 p-3 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-600">
              <div className="flex gap-2">
                {[0, 150, 300].map(d => (
                  <div key={d} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 rounded-b-2xl">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isTranscribing ? 'Transcribing your voice…' : 'Ask me anything…'}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            disabled={isLoading || isTranscribing}
          />
          <button
            onClick={toggleRecording}
            disabled={isTranscribing}
            className={`p-3 rounded-full transition ${
              isRecording ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-300'
              : isTranscribing ? 'bg-yellow-400 text-white'
              : 'bg-gray-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-gray-300'
            }`}
            title={isRecording ? 'Stop recording' : 'Start voice input'}
          >
            {isRecording ? <FaStop /> : <FaMicrophone />}
          </button>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-slate-800 text-white rounded-full hover:bg-slate-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            <FaPaperPlane />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          {isRecording ? '🔴 Recording — tap ■ to stop & send' : 'Enter to send • 🎙 for voice (Hindi/Tamil/Telugu…)'}
        </p>
      </div>
    </div>
  );
}

export default ChatBot;


