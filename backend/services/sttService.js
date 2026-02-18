import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Speech-to-Text Service
 * Primary: Groq Whisper large-v3 (auto-detects 99 languages, Hinglish, Indian accents)
 * Fallback: Returns error so frontend can use Web Speech API
 */
class SttService {
    constructor() {
        this.groqApiKey = process.env.GROQ_API_KEY;
        this.groqEndpoint = 'https://api.groq.com/openai/v1/audio/transcriptions';
    }

    isAvailable() {
        return this.groqApiKey && this.groqApiKey !== 'your_groq_api_key_here';
    }

    /**
     * Transcribe audio buffer using Groq Whisper large-v3
     * @param {Buffer} audioBuffer - Audio data
     * @param {string} mimeType - e.g. 'audio/webm', 'audio/mp4', 'audio/wav'
     * @returns {{ text: string, language: string, detectedLanguage: string }}
     */
    async transcribe(audioBuffer, mimeType = 'audio/webm') {
        if (!this.isAvailable()) {
            throw new Error('GROQ_API_KEY not configured');
        }

        // Map MIME types to file extensions Groq accepts
        const extMap = {
            'audio/webm': 'webm',
            'audio/ogg': 'ogg',
            'audio/mp4': 'mp4',
            'audio/mpeg': 'mp3',
            'audio/mp3': 'mp3',
            'audio/wav': 'wav',
            'audio/x-wav': 'wav',
            'audio/flac': 'flac',
        };
        const ext = extMap[mimeType] || 'webm';
        const filename = `audio.${ext}`;

        const formData = new FormData();
        formData.append('file', audioBuffer, {
            filename,
            contentType: mimeType,
        });
        formData.append('model', 'whisper-large-v3');
        // No language hint → auto-detect (handles Hindi, Tamil, Telugu, Kannada, etc.)
        formData.append('response_format', 'verbose_json'); // gives us detected language

        const response = await axios.post(this.groqEndpoint, formData, {
            headers: {
                Authorization: `Bearer ${this.groqApiKey}`,
                ...formData.getHeaders(),
            },
            timeout: 30000,
        });

        const { text, language } = response.data;

        console.log(`🎙️ STT: Detected language="${language}", text="${text?.substring(0, 80)}..."`);

        return {
            text: text?.trim() || '',
            language: language || 'en',           // ISO 639-1 code e.g. 'hi', 'ta', 'en'
            detectedLanguage: language || 'en',
        };
    }
}

export default new SttService();
