import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { RequestHandler } from 'express';

export const apiKeyMiddleware: RequestHandler = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({
            message: 'Unauthorized',
            status: 401,
        });
    }

    if (apiKey !== process.env.X_API_KEY) {
        return res.status(403).json({
            message: 'Forbidden',
            status: 403,
        });
    }

    next();
};
