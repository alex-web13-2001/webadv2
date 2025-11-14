import { Router } from 'express';
import { wbApiService } from '../services/wbApiService';

const router = Router();

// POST /api/test-key
router.post('/test-key', async (req, res) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: 'API ключ не предоставлен',
        code: 400,
      });
    }

    const result = await wbApiService.testApiKey(apiKey);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при проверке ключа',
      code: 500,
    });
  }
});

export default router;