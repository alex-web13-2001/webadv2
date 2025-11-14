import { Router } from 'express';
import { wbApiService } from '../services/wbApiService';
import { apiKeyValidator } from '../middleware/apiKeyValidator';

const router = Router();

// GET /api/campaigns
router.get('/campaigns', apiKeyValidator, async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    const result = await wbApiService.getCampaigns(apiKey);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при загрузке кампаний',
      code: 500,
    });
  }
});

// GET /api/campaign/:id/stats
router.get('/campaign/:id/stats', apiKeyValidator, async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    const { id } = req.params;
    const { beginDate, endDate } = req.query;

    if (!beginDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Не указаны даты beginDate и endDate',
        code: 400,
      });
    }

    const result = await wbApiService.getCampaignStats(
      apiKey,
      parseInt(id),
      beginDate as string,
      endDate as string
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при загрузке статистики',
      code: 500,
    });
  }
});

// POST /api/campaign/:id/clusters
router.post('/campaign/:id/clusters', apiKeyValidator, async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    const { id } = req.params;
    const { nm_id, from, to } = req.body;

    if (!nm_id || !from || !to) {
      return res.status(400).json({
        success: false,
        message: 'Не указаны параметры nm_id, from, to',
        code: 400,
      });
    }

    const result = await wbApiService.getClusterStats(
      apiKey,
      parseInt(id),
      nm_id,
      from,
      to
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка при загрузке кластеров',
      code: 500,
    });
  }
});

export default router;