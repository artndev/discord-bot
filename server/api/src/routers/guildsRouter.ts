import express from 'express';
import { guildController } from '../controllers';
import { apiKeyMiddleware } from '../middlewares';

const router = express.Router();

router.use(apiKeyMiddleware);

router.post('/', guildController.registerGuild);

router.get('/:id', guildController.getGuildById);

router.get('/owner/:id', guildController.getGuildByOwnerId);

router.put('/settings/:id', guildController.updateGuildSettings);

router.delete('/:id', guildController.deleteGuild);

export default router;
