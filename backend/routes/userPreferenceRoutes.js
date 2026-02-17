import express from 'express';
import { saveUserPreferences } from '../controllers/userPreferenceController.js';

const router = express.Router();

router.post('/', saveUserPreferences);

export default router;
