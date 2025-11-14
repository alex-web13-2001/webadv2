import { Router } from 'express';
import apiKeyRouter from './apiKey';
import campaignsRouter from './campaigns';

const router = Router();

router.use('/api', apiKeyRouter);
router.use('/api', campaignsRouter);

export default router;