import express from 'express';
import multer from 'multer';
import sttService from '../services/sttService.js';
import ttsService from '../services/ttsService.js';

const router = express.Router();

// Store audio in memory (no disk writes)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max (Groq limit)
});

/**
 * POST /api/voice/stt
 * Body: multipart/form-data { audio: File }
 * Response: { text, language, detectedLanguage }
 */
router.post('/stt', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No audio file provided' });
        }

        const mimeType = req.file.mimetype || 'audio/webm';
        const result = await sttService.transcribe(req.file.buffer, mimeType);

        res.json(result);
    } catch (error) {
        console.error('STT error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/voice/tts
 * Body: { text: string, language: string, voiceType: 'female'|'male' }
 * Response: audio/mpeg or audio/wav binary stream
 */
router.post('/tts', async (req, res) => {
    try {
        const { text, language = 'en', voiceType = 'female' } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'No text provided' });
        }

        // Strip markdown before speaking (bold **, headings #, bullet -, emoji)
        const cleanText = text
            .replace(/\*\*(.*?)\*\*/g, '$1')   // bold
            .replace(/\*(.*?)\*/g, '$1')         // italic
            .replace(/^#+\s+/gm, '')             // headings
            .replace(/^[-*]\s+/gm, '')           // bullets
            .replace(/`[^`]+`/g, '')             // inline code
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
            .replace(/[^\S\r\n]+/g, ' ')         // collapse spaces
            .trim();

        const { audio, contentType, provider } = await ttsService.synthesize(cleanText, language, voiceType);

        res.set('Content-Type', contentType);
        res.set('X-TTS-Provider', provider);
        res.set('X-Detected-Language', language);
        res.send(audio);
    } catch (error) {
        console.error('TTS error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/voice/status
 * Returns which services are configured
 */
router.get('/status', (req, res) => {
    res.json({
        stt: {
            groq: sttService.isAvailable(),
        },
        tts: {
            sarvam: ttsService.isSarvamAvailable(),
            elevenlabs: ttsService.isElevenLabsAvailable(),
        },
    });
});

export default router;
