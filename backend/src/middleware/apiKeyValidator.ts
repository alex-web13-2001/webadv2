import { Request, Response, NextFunction } from 'express';

export const apiKeyValidator = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API ключ не предоставлен',
      code: 401,
    });
  }

  next();
};