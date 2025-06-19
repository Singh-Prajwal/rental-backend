// src/routes/aiRoutes.ts
import { Router } from 'express';
import { getAiSupportAnswer } from '../controllers/aiController';

const router = Router();
router.post('/support', getAiSupportAnswer);

export default router;