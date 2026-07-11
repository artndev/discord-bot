import express from 'express';
import { aiChatHistoryController } from '../controllers';
import { apiKeyMiddleware } from '../middlewares';

const router = express.Router();

router.use(apiKeyMiddleware);

router.get('/:channel_id', aiChatHistoryController.getHistory);

router.post('/', aiChatHistoryController.updateHistory);

export default router;
