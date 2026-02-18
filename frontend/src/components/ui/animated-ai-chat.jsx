"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "../../lib/utils";
import {
    SendIcon,
    LoaderIcon,
    Sparkles,
    MapPin,
    Menu,
    Mic,
    Volume2,
    VolumeX,
    Square,
    PhoneOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sendChatMessage } from "../../services/api";
import { getAuth } from "firebase/auth";

const API_BASE = "http://localhost:5000/api";

const LANGUAGE_NAMES = {
    en: "English", hi: "Hindi", ta: "Tamil", te: "Telugu",
    kn: "Kannada", ml: "Malayalam", bn: "Bengali", mr: "Marathi",
    gu: "Gujarati", or: "Odia", pa: "Punjabi",
};

function stripMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/^#+\s+/gm, "")
        .replace(/^[-*]\s+/gm, "")
        .replace(/`[^`]+`/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/\(ACCESSING.*?\)/gi, "")
        .replace(/[^\S\r\n]+/g, " ")
        .trim();
}

function detectVoiceCommand(text) {
    const lower = text.toLowerCase();
    if (/shift\s+to\s+male|use\s+male|male\s+voice|switch\s+to\s+male/.test(lower)) return "male";
    if (/shift\s+to\s+female|use\s+female|female\s+voice|switch\s+to\s+female/.test(lower)) return "female";
    return null;
}

const MarkdownText = ({ content }) => {
    const parseLine = (text) => {
        const parts = [];
        let lastIndex = 0;
        const boldRegex = /\*\*(.*?)\*\*/g;
        let match;
        while ((match = boldRegex.exec(text)) !== null) {
            if (match.index > lastIndex) parts.push(text.substring(lastIndex, match.index));
            parts.push(<strong key={match.index} className="font-semibold text-white">{match[1]}</strong>);
            lastIndex = match.index + match[0].length;
        }
        if (lastIndex < text.length) parts.push(text.substring(lastIndex));
        return parts.length > 0 ? parts : text;
    };
    const lines = content.split("\n");
    const elements = [];
    let currentList = [];
    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("* ") || trimmedLine.startsWith("- ")) {
            currentList.push(
                <li key={`li-${index}`} className="flex items-start gap-2 ml-1">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                    <span>{parseLine(trimmedLine.substring(2))}</span>
                </li>
            );
        } else {
            if (currentList.length > 0) {
                elements.push(<ul key={`ul-${index}`} className="space-y-1 my-2 pl-2">{currentList}</ul>);
                currentList = [];
            }
            if (trimmedLine) elements.push(<p key={`p-${index}`} className="leading-relaxed text-white/90 my-1">{parseLine(line)}</p>);
            else elements.push(<div key={`br-${index}`} className="h-2" />);
        }
    });
    if (currentList.length > 0) elements.push(<ul key="ul-end" className="space-y-1 my-2 pl-2">{currentList}</ul>);
    return <div className="space-y-1 text-[15px]">{elements}</div>;
};

export function AnimatedAIChat({ isSidebarOpen, onToggleSidebar, currentConversation }) {
    const [value, setValue] = useState("");
    const [messages, setMessages] = useState([{
        role: "assistant",
        content: "Hello! I'm your AalayaX AI assistant. Tap 'Start Voice Conversation' for a hands-free chat, or type below!",
        timestamp: new Date(),
    }]);
    const [isLoading, setIsLoading] = useState(false);
    const [userLocation, setUserLocation] = useState(null);

    // Voice states
    const [isRecording, setIsRecording]           = useState(false);
    const [isTranscribing, setIsTranscribing]     = useState(false);
    const [isSpeaking, setIsSpeaking]             = useState(false);
    const [ttsEnabled, setTtsEnabled]             = useState(true);
    const [detectedLanguage, setDetectedLanguage] = useState("en");
    const [voiceGender, setVoiceGender]           = useState("female");
    const [voiceLevel, setVoiceLevel]             = useState(0);

    // Continuous conversation
    const [isConversationMode, setIsConversationMode] = useState(false);
    const [convPhase, setConvPhase] = useState("idle");

    // Refs (avoid stale closures in callbacks)
    const messagesEndRef   = useRef(null);
    const textareaRef      = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef   = useRef([]);
    const currentAudioRef  = useRef(null);
    const backendSttRef    = useRef(false);
    const convRef          = useRef(false);
    const isRecordingRef   = useRef(false);
    const voiceGenderRef   = useRef("female");
    const detectedLangRef  = useRef("en");
    const audioCtxRef      = useRef(null);
    const userLocationRef  = useRef(null);
    const ttsEnabledRef    = useRef(true);

    useEffect(() => { convRef.current      = isConversationMode; }, [isConversationMode]);
    useEffect(() => { isRecordingRef.current = isRecording;      }, [isRecording]);
    useEffect(() => { voiceGenderRef.current = voiceGender;      }, [voiceGender]);
    useEffect(() => { detectedLangRef.current = detectedLanguage;}, [detectedLanguage]);
    useEffect(() => { userLocationRef.current = userLocation;    }, [userLocation]);
    useEffect(() => { ttsEnabledRef.current   = ttsEnabled;      }, [ttsEnabled]);

    useEffect(() => {
        fetch(`${API_BASE}/voice/status`)
            .then(r => r.json())
            .then(d => { backendSttRef.current = d.stt?.groq || false; })
            .catch(() => {});
    }, []);

    useEffect(() => {
        navigator.geolocation?.getCurrentPosition(
            pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => {}
        );
    }, []);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    useEffect(() => {
        if (!currentConversation) return;
        const msgs = [];
        const u = currentConversation.userMessage || currentConversation.message;
        const a = currentConversation.aiResponse  || currentConversation.response;
        if (u) msgs.push({ role: "user",      content: u, timestamp: new Date(currentConversation.createdAt || Date.now()) });
        if (a) msgs.push({ role: "assistant", content: a, timestamp: new Date(currentConversation.createdAt || Date.now()) });
        if (msgs.length) setMessages(msgs);
    }, [currentConversation]);

    //  Stop speaking 
    const stopSpeaking = useCallback(() => {
        if (currentAudioRef.current) {
            currentAudioRef.current.onended = null;
            currentAudioRef.current.pause();
            currentAudioRef.current = null;
        }
        window.speechSynthesis?.cancel();
        setIsSpeaking(false);
    }, []);

    //  TTS — returns Promise that resolves when audio finishes 
    const speakText = useCallback((text, language, gender) => new Promise(async resolve => {
        if (!ttsEnabledRef.current) { resolve(); return; }
        stopSpeaking();
        const clean = stripMarkdown(text);
        if (!clean) { resolve(); return; }
        setIsSpeaking(true);
        try {
            const res = await fetch(`${API_BASE}/voice/tts`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: clean, language, voiceType: gender }),
            });
            if (!res.ok) throw new Error("TTS failed");
            const blob  = await res.blob();
            const url   = URL.createObjectURL(blob);
            const audio = new Audio(url);
            currentAudioRef.current = audio;
            audio.onended = () => { setIsSpeaking(false); URL.revokeObjectURL(url); currentAudioRef.current = null; resolve(); };
            audio.onerror = () => { setIsSpeaking(false); resolve(); };
            audio.play();
        } catch {
            try {
                const u = new SpeechSynthesisUtterance(clean.substring(0, 500));
                u.lang  = language === "hi" ? "hi-IN" : "en-US";
                u.pitch = gender === "male" ? 0.8 : 1.1;
                u.onend = () => { setIsSpeaking(false); resolve(); };
                window.speechSynthesis.speak(u);
            } catch { setIsSpeaking(false); resolve(); }
        }
    }), [stopSpeaking]);

    //  Silence detection via Web Audio 
    const startSilenceDetection = useCallback((stream) => {
        try {
            const ctx = new AudioContext();
            audioCtxRef.current = ctx;
            const src = ctx.createMediaStreamSource(stream);
            const ana = ctx.createAnalyser();
            ana.fftSize = 256;
            src.connect(ana);
            const data = new Uint8Array(ana.frequencyBinCount);
            const THRESHOLD  = 12;
            const SILENCE_MS = 1800;
            const MIN_MS     = 800;
            const start = Date.now();
            let silenceAt = null;
            const tick = () => {
                if (!isRecordingRef.current) { ctx.close(); return; }
                ana.getByteFrequencyData(data);
                const rms = Math.sqrt(data.reduce((s, v) => s + v * v, 0) / data.length);
                setVoiceLevel(Math.min(100, Math.round(rms * 3)));
                if (Date.now() - start < MIN_MS) { requestAnimationFrame(tick); return; }
                if (rms < THRESHOLD) {
                    if (!silenceAt) silenceAt = Date.now();
                    else if (Date.now() - silenceAt > SILENCE_MS) {
                        if (mediaRecorderRef.current && isRecordingRef.current) {
                            mediaRecorderRef.current.stop();
                            setIsRecording(false);
                            isRecordingRef.current = false;
                        }
                        ctx.close();
                        return;
                    }
                } else { silenceAt = null; }
                requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        } catch {}
    }, []);

    //  Core: send message, speak response, return 
    const processVoiceMessage = useCallback(async (text, lang) => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user || !text.trim()) return;
        const voiceCmd = detectVoiceCommand(text);
        let gender = voiceGenderRef.current;
        if (voiceCmd) { setVoiceGender(voiceCmd); voiceGenderRef.current = voiceCmd; gender = voiceCmd; }
        setMessages(prev => [...prev, { role: "user", content: text, timestamp: new Date() }]);
        setIsLoading(true);
        setConvPhase("thinking");
        try {
            const res = await sendChatMessage(user.uid, text, userLocationRef.current, lang);
            const clean = (res.response || "").replace(/^\s*\(.*?\)\s*$/gm, "").trim();
            setMessages(prev => [...prev, { role: "assistant", content: clean, timestamp: new Date(), language: lang }]);
            setIsLoading(false);
            if (ttsEnabledRef.current) {
                setConvPhase("speaking");
                await speakText(clean, lang, gender);
            }
        } catch {
            setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again.", timestamp: new Date(), error: true }]);
            setIsLoading(false);
        }
        setConvPhase(convRef.current ? "listening" : "idle");
    }, [speakText]);

    //  STT: blob  Groq  {text, language} 
    const transcribeBlob = useCallback(async (blob, mimeType) => {
        if (!backendSttRef.current || blob.size < 1000) return null;
        const ext = mimeType.split("/")[1].split(";")[0];
        const fd = new FormData();
        fd.append("audio", blob, `rec.${ext}`);
        const r = await fetch(`${API_BASE}/voice/stt`, { method: "POST", body: fd });
        if (!r.ok) throw new Error("STT failed");
        return r.json();
    }, []);

    //  One record  transcribe  respond cycle 
    const runOneCycle = useCallback(async () => {
        return new Promise(async (resolve) => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioChunksRef.current = [];
                const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
                    ? "audio/webm;codecs=opus"
                    : MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
                const recorder = new MediaRecorder(stream, { mimeType });
                mediaRecorderRef.current = recorder;
                recorder.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
                recorder.onstop = async () => {
                    stream.getTracks().forEach(t => t.stop());
                    setVoiceLevel(0);
                    const blob = new Blob(audioChunksRef.current, { type: mimeType });
                    setIsTranscribing(true);
                    setConvPhase("thinking");
                    try {
                        const result = await transcribeBlob(blob, mimeType);
                        setIsTranscribing(false);
                        if (result?.text) {
                            const lang = result.language || "en";
                            setDetectedLanguage(lang);
                            detectedLangRef.current = lang;
                            await processVoiceMessage(result.text, lang);
                        }
                    } catch { setIsTranscribing(false); }
                    resolve();
                };
                recorder.start(250);
                setIsRecording(true);
                isRecordingRef.current = true;
                startSilenceDetection(stream);
            } catch (err) {
                alert("Microphone access denied.");
                resolve();
            }
        });
    }, [transcribeBlob, processVoiceMessage, startSilenceDetection]);

    //  Continuous conversation loop 
    const startConversationMode = useCallback(async () => {
        const auth = getAuth();
        if (!auth.currentUser) { alert("Please log in"); return; }
        setIsConversationMode(true);
        convRef.current = true;
        setConvPhase("listening");
        while (convRef.current) {
            await runOneCycle();
            if (!convRef.current) break;
            // Brief pause between turns
            await new Promise(r => setTimeout(r, 400));
            if (convRef.current) setConvPhase("listening");
        }
    }, [runOneCycle]);

    const stopConversationMode = useCallback(() => {
        convRef.current = false;
        setIsConversationMode(false);
        if (mediaRecorderRef.current && isRecordingRef.current) {
            try { mediaRecorderRef.current.stop(); } catch {}
        }
        setIsRecording(false);
        isRecordingRef.current = false;
        stopSpeaking();
        setIsTranscribing(false);
        setIsLoading(false);
        setConvPhase("idle");
        setVoiceLevel(0);
        if (audioCtxRef.current) { try { audioCtxRef.current.close(); } catch {} audioCtxRef.current = null; }
    }, [stopSpeaking]);

    useEffect(() => () => stopConversationMode(), []);

    //  Manual push-to-talk 
    const startManualRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioChunksRef.current = [];
            const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
                ? "audio/webm;codecs=opus"
                : MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
            const recorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = recorder;
            recorder.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
            recorder.onstop = async () => {
                stream.getTracks().forEach(t => t.stop());
                const blob = new Blob(audioChunksRef.current, { type: mimeType });
                setIsTranscribing(true);
                try {
                    const result = await transcribeBlob(blob, mimeType);
                    setIsTranscribing(false);
                    if (result?.text) {
                        const lang = result.language || "en";
                        setDetectedLanguage(lang);
                        detectedLangRef.current = lang;
                        await processVoiceMessage(result.text, lang);
                    }
                } catch { setIsTranscribing(false); }
            };
            recorder.start(250);
            setIsRecording(true);
            isRecordingRef.current = true;
        } catch { alert("Microphone access denied."); }
    };

    const stopManualRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            isRecordingRef.current = false;
        }
    };

    //  Text send 
    const handleSendMessage = async () => {
        if (!value.trim() || isLoading) return;
        const auth = getAuth();
        if (!auth.currentUser) { alert("Please log in"); return; }
        const text = value.trim();
        const voiceCmd = detectVoiceCommand(text);
        if (voiceCmd) { setVoiceGender(voiceCmd); voiceGenderRef.current = voiceCmd; }
        setValue("");
        await processVoiceMessage(text, detectedLanguage);
    };

    const handleKeyDown = e => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (value.trim()) handleSendMessage(); }
    };

    const phaseLabel = { listening: "Listening...", thinking: "Thinking...", speaking: "Speaking..." }[convPhase] || "";

    return (
        <div className="h-full flex flex-col w-full bg-black text-white relative overflow-hidden">

            {/* Header */}
            <div className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-xl flex-shrink-0">
                <div className="max-w-4xl mx-auto px-4 py-2 md:px-6 md:py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button onClick={onToggleSidebar} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <Menu className="w-5 h-5 text-white" />
                            </button>
                            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h1 className="text-base font-semibold text-white">AalayaX AI Assistant</h1>
                                <div className="flex items-center gap-2 text-xs text-white/40">
                                    <span>Gemini 2.0 Flash</span>
                                    {detectedLanguage !== "en" && (
                                        <span className="bg-indigo-700/60 text-indigo-200 px-2 py-0.5 rounded-full">
                                            {LANGUAGE_NAMES[detectedLanguage] || detectedLanguage}
                                        </span>
                                    )}
                                    <span className={`px-2 py-0.5 rounded-full ${voiceGender === "male" ? "bg-blue-700/50 text-blue-200" : "bg-pink-700/50 text-pink-200"}`}>
                                        {voiceGender === "male" ? "Male" : "Female"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {userLocation && (
                                <div className="hidden md:flex items-center gap-1.5 text-xs text-white/40">
                                    <MapPin className="w-3.5 h-3.5" /><span>Location on</span>
                                </div>
                            )}
                            <button
                                onClick={() => { setTtsEnabled(v => !v); stopSpeaking(); }}
                                className={`p-2 rounded-lg transition-colors ${ttsEnabled ? "bg-indigo-700/40 text-indigo-300 hover:bg-indigo-700/60" : "text-white/30 hover:bg-white/10"}`}
                                title={ttsEnabled ? "Mute" : "Unmute"}
                            >
                                {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/*  Continuous conversation overlay  */}
            <AnimatePresence>
                {isConversationMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/96 backdrop-blur-2xl"
                    >
                        {/* Ripple rings */}
                        <div className="relative flex items-center justify-center mb-10">
                            {convPhase === "listening" && <>
                                <div className="absolute w-64 h-64 rounded-full border border-indigo-500/20 animate-ping" style={{ animationDuration: "2s" }} />
                                <div className="absolute w-48 h-48 rounded-full border border-indigo-500/30 animate-ping" style={{ animationDuration: "1.5s" }} />
                            </>}
                            {convPhase === "speaking" && <>
                                <div className="absolute w-64 h-64 rounded-full border border-emerald-500/20 animate-ping" style={{ animationDuration: "2s" }} />
                                <div className="absolute w-48 h-48 rounded-full border border-emerald-500/30 animate-ping" style={{ animationDuration: "1.5s" }} />
                            </>}

                            {/* Central circle */}
                            <div className={cn(
                                "w-36 h-36 rounded-full flex flex-col items-center justify-center gap-2 transition-all duration-500",
                                convPhase === "listening" ? "bg-indigo-600 shadow-[0_0_80px_rgba(99,102,241,0.6)]"
                                : convPhase === "speaking"  ? "bg-emerald-600 shadow-[0_0_80px_rgba(16,185,129,0.6)]"
                                : "bg-slate-800 shadow-[0_0_40px_rgba(0,0,0,0.8)]"
                            )}>
                                {convPhase === "listening" && (
                                    <div className="flex items-end gap-[3px]">
                                        {[0.5,1,0.7,1.3,0.8,1,0.6].map((h, i) => (
                                            <div key={i} className="w-[3px] bg-white rounded-full transition-all duration-75"
                                                style={{ height: `${Math.max(4, voiceLevel * h * 0.35)}px` }} />
                                        ))}
                                    </div>
                                )}
                                {convPhase === "listening" && <Mic className="w-7 h-7 text-white/60" />}
                                {convPhase === "speaking" && <Sparkles className="w-14 h-14 text-white animate-pulse" />}
                                {convPhase === "thinking" && <LoaderIcon className="w-12 h-12 text-white animate-spin" />}
                                {convPhase === "idle"     && <Mic className="w-12 h-12 text-white/40" />}
                            </div>
                        </div>

                        <motion.p key={phaseLabel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            className="text-3xl font-light text-white mb-3 tracking-wide">{phaseLabel}</motion.p>

                        <p className="text-sm text-white/30 mb-2">
                            {convPhase === "listening" ? "Speak — I'll send when you pause"
                            : convPhase === "speaking"  ? `${voiceGender === "male" ? "Adam" : "Rachel"}  ${LANGUAGE_NAMES[detectedLanguage] || "English"}`
                            : "Please wait..."}
                        </p>

                        {messages.length > 1 && (
                            <p className="text-xs text-white/20 max-w-xs text-center px-6 mb-10 line-clamp-2">
                                {messages[messages.length - 1]?.content?.substring(0, 100)}
                                {(messages[messages.length - 1]?.content?.length || 0) > 100 ? "..." : ""}
                            </p>
                        )}

                        <button onClick={stopConversationMode}
                            className="flex items-center gap-2 px-7 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full text-sm font-semibold transition-all shadow-xl active:scale-95">
                            <PhoneOff className="w-4 h-4" />
                            End Conversation
                        </button>

                        <button onClick={() => { setTtsEnabled(v => !v); stopSpeaking(); }}
                            className="mt-5 text-xs text-white/25 hover:text-white/50 transition flex items-center gap-1.5">
                            {ttsEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                            {ttsEnabled ? "Mute AI voice" : "Unmute AI voice"}
                        </button>

                        <p className="mt-8 text-[10px] text-white/15">Say "shift to male voice" or "shift to female voice" anytime</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Status bar (non-conversation mode only) */}
            <AnimatePresence>
                {!isConversationMode && (isRecording || isTranscribing || isSpeaking) && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="bg-indigo-950/50 border-b border-indigo-800/30 text-xs text-indigo-300 px-6 py-1.5 flex items-center gap-3 z-10"
                    >
                        {isRecording && <>
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0" />
                            <span>Recording — tap stop to send</span>
                        </>}
                        {isTranscribing && <>
                            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse flex-shrink-0" />
                            <span>Transcribing...</span>
                        </>}
                        {isSpeaking && <>
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
                            <span>Speaking ({voiceGender === "male" ? "Adam" : "Rachel"}  {LANGUAGE_NAMES[detectedLanguage] || "English"})</span>
                            <button onClick={stopSpeaking} className="ml-auto text-indigo-400 hover:text-white underline underline-offset-2">Stop</button>
                        </>}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto relative z-10" style={{ scrollbarWidth: "auto", scrollbarColor: "#4b5563 #000000" }}>
                <div className="max-w-4xl mx-auto px-4 py-4 md:px-6 md:py-8 space-y-4 md:space-y-6">
                    {messages.map((msg, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={cn(
                                "max-w-[85%] md:max-w-[80%] p-3 md:p-4 rounded-2xl",
                                msg.role === "user" ? "bg-white text-black rounded-br-none"
                                : msg.error ? "bg-red-500/20 border border-red-500/30 text-red-200 rounded-bl-none"
                                : "bg-white/5 border border-white/10 text-white rounded-bl-none backdrop-blur-xl"
                            )}>
                                {msg.role === "user"
                                    ? <p className="text-sm leading-relaxed text-black">{msg.content}</p>
                                    : <MarkdownText content={msg.content} />}
                                <div className="flex items-center justify-between mt-2">
                                    <p className={cn("text-xs opacity-40", msg.role === "user" ? "text-black" : "text-white")}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                    {msg.role === "assistant" && !msg.error && ttsEnabled && (
                                        <button onClick={() => speakText(msg.content, msg.language || "en", voiceGender)}
                                            className="text-white/20 hover:text-white/70 transition ml-3" title="Read aloud">
                                            <Volume2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-bl-none backdrop-blur-xl">
                                <div className="flex gap-2">
                                    {[0, 150, 300].map(d => <div key={d} className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input bar */}
            <div className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-xl flex-shrink-0 pb-2 md:pb-0">
                <div className="max-w-4xl mx-auto px-4 py-2 md:px-6 md:py-3">
                    <div className="relative backdrop-blur-2xl bg-white/[0.02] rounded-2xl border border-white/[0.08] shadow-2xl">
                        <textarea
                            ref={textareaRef}
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={isTranscribing ? "Transcribing..." : isRecording ? "Recording — tap stop" : "Ask anything... or tap the mic to speak"}
                            rows={1}
                            disabled={isRecording || isTranscribing || isConversationMode}
                            className={cn(
                                "w-full px-4 py-3 pr-36 md:px-6 md:py-4 md:pr-44",
                                "resize-none bg-transparent border-none text-white/90 text-sm caret-white",
                                "focus:outline-none placeholder:text-white/30 min-h-[44px] max-h-[120px] md:min-h-[56px]"
                            )}
                        />
                        <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
                            {/* Push-to-talk mic */}
                            <button
                                onClick={isRecording ? stopManualRecording : startManualRecording}
                                disabled={isTranscribing || isLoading || isConversationMode}
                                className={cn(
                                    "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200",
                                    isRecording ? "bg-red-600 text-white animate-pulse shadow-lg shadow-red-900/40" : "bg-white/8 text-white/40 hover:bg-white/15 hover:text-white"
                                )}
                                title={isRecording ? "Stop recording" : "Push-to-talk"}
                            >
                                {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            </button>

                            {/* Start Voice Conversation — beside send */}
                            <button
                                onClick={startConversationMode}
                                disabled={isLoading || isRecording || isTranscribing || isConversationMode}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 h-9 rounded-xl text-xs font-semibold transition-all duration-200",
                                    "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white",
                                    "shadow-lg shadow-indigo-900/40 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                                )}
                                title="Start continuous voice conversation"
                            >
                                <Mic className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="hidden md:inline whitespace-nowrap">Voice Chat</span>
                            </button>

                            {/* Send */}
                            <button
                                onClick={handleSendMessage}
                                disabled={!value.trim() || isLoading || isRecording || isConversationMode}
                                className={cn(
                                    "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200",
                                    value.trim() && !isLoading && !isRecording && !isConversationMode
                                        ? "bg-slate-100 text-black hover:bg-white shadow-lg"
                                        : "bg-white/5 text-white/30 cursor-not-allowed"
                                )}
                            >
                                {isLoading ? <LoaderIcon className="w-4 h-4 animate-spin" /> : <SendIcon className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <p className="text-[10px] text-white/20 text-center mt-1.5 hidden md:block">
                        Voice Chat loops automatically · Say "shift to male voice" to switch · AI can make mistakes
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AnimatedAIChat;