import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Text-to-Speech Service
 *
 * Routes by language:
 *   Indian languages (hi, ta, te, kn, ml, bn, mr, gu, or, pa) â†’ Sarvam AI "Bulbul"
 *   English / others â†’ ElevenLabs (eleven_multilingual_v2)
 *
 * Both return a Buffer of audio data.
 */

// Language code â†’ Sarvam language code
const SARVAM_LANGUAGE_MAP = {
    hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN', kn: 'kn-IN',
    ml: 'ml-IN', bn: 'bn-IN', mr: 'mr-IN', gu: 'gu-IN',
    or: 'or-IN', pa: 'pa-IN',
};

// Sarvam speaker per [lang][gender]
const SARVAM_VOICE_MAP = {
    'hi-IN': { female: 'meera',    male: 'mithil'   },
    'ta-IN': { female: 'pavithra', male: 'arvind'   },
    'te-IN': { female: 'shruti',   male: 'arvind'   },
    'kn-IN': { female: 'meera',    male: 'amol'     },
    'ml-IN': { female: 'maya',     male: 'arvind'   },
    'bn-IN': { female: 'anushka', male: 'mithil'   },
    'mr-IN': { female: 'meera',    male: 'mithil'   },
    'gu-IN': { female: 'meera',    male: 'mithil'   },
    'or-IN': { female: 'meera',    male: 'mithil'   },
    'pa-IN': { female: 'meera',    male: 'mithil'   },
};

// ElevenLabs voice IDs by gender
const ELEVENLABS_VOICES = {
    female: '21m00Tcm4TlvDq8ikWAM', // Rachel
    male:   'pNInz6obpgDQGcFmaJgB', // Adam
};

class TtsService {
    constructor() {
        this.sarvamApiKey     = process.env.SARVAM_API_KEY;
        this.elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
    }

    isSarvamAvailable() {
        return this.sarvamApiKey && this.sarvamApiKey !== 'your_sarvam_api_key_here';
    }

    isElevenLabsAvailable() {
        return this.elevenLabsApiKey && this.elevenLabsApiKey !== 'your_elevenlabs_api_key_here';
    }

    /**
     * Synthesize speech from text
     * @param {string} text
     * @param {string} language - ISO 639-1 detected language code
     * @param {'female'|'male'} voiceType
     * @returns {{ audio: Buffer, contentType: string, provider: string }}
     */
    async synthesize(text, language = 'en', voiceType = 'female') {
        const gender = voiceType === 'male' ? 'male' : 'female';
        const isIndianLanguage = Object.keys(SARVAM_LANGUAGE_MAP).includes(language);

        if (isIndianLanguage && this.isSarvamAvailable()) {
            return await this._synthesizeSarvam(text, language, gender);
        }

        if (this.isElevenLabsAvailable()) {
            return await this._synthesizeElevenLabs(text, gender);
        }

        throw new Error('No TTS provider configured. Set SARVAM_API_KEY or ELEVENLABS_API_KEY in .env');
    }

    /** Sarvam AI TTS â€” Bulbul model */
    async _synthesizeSarvam(text, language, gender) {
        const lang   = SARVAM_LANGUAGE_MAP[language] || 'hi-IN';
        const voices = SARVAM_VOICE_MAP[lang] || { female: 'meera', male: 'mithil' };
        const voice  = voices[gender];

        const chunks = this._chunkText(text, 450);
        const audioBuffers = [];

        for (const chunk of chunks) {
            const response = await axios.post(
                'https://api.sarvam.ai/text-to-speech',
                {
                    inputs: [chunk],
                    target_language_code: lang,
                    speaker: voice,
                    pitch: 0,
                    pace: 1.0,
                    loudness: 1.5,
                    speech_sample_rate: 22050,
                    enable_preprocessing: true,
                    model: 'bulbul:v1',
                },
                {
                    headers: {
                        'api-subscription-key': this.sarvamApiKey,
                        'Content-Type': 'application/json',
                    },
                    timeout: 30000,
                }
            );

            const base64Audio = response.data?.audios?.[0];
            if (base64Audio) audioBuffers.push(Buffer.from(base64Audio, 'base64'));
        }

        const audio = Buffer.concat(audioBuffers);
        console.log(`ðŸ”Š TTS: Sarvam (${lang}, ${gender}) â†’ ${audio.length} bytes`);
        return { audio, contentType: 'audio/wav', provider: 'sarvam' };
    }

    /** ElevenLabs TTS â€” English and fallback */
    async _synthesizeElevenLabs(text, gender) {
        const voiceId = ELEVENLABS_VOICES[gender] || ELEVENLABS_VOICES.female;
        const chunks  = this._chunkText(text, 2500);
        const audioBuffers = [];

        for (const chunk of chunks) {
            const response = await axios.post(
                `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
                {
                    text: chunk,
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: { stability: 0.5, similarity_boost: 0.75 },
                },
                {
                    headers: {
                        'xi-api-key': this.elevenLabsApiKey,
                        'Content-Type': 'application/json',
                    },
                    responseType: 'arraybuffer',
                    timeout: 30000,
                }
            );
            audioBuffers.push(Buffer.from(response.data));
        }

        const audio = Buffer.concat(audioBuffers);
        console.log(`ðŸ”Š TTS: ElevenLabs (en, ${gender}) â†’ ${audio.length} bytes`);
        return { audio, contentType: 'audio/mpeg', provider: 'elevenlabs' };
    }

    /** Split text into chunks without cutting words */
    _chunkText(text, maxLen) {
        if (text.length <= maxLen) return [text];
        const chunks = [];
        let start = 0;
        while (start < text.length) {
            let end = start + maxLen;
            if (end < text.length) {
                const lb = text.lastIndexOf(' ', end);
                if (lb > start) end = lb;
            }
            chunks.push(text.slice(start, end).trim());
            start = end;
        }
        return chunks;
    }
}

export default new TtsService();
