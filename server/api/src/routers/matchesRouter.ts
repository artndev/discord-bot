import express from 'express';
import { matchesController } from '../controllers';
import { apiKeyMiddleware } from '../middlewares';

const router = express.Router({ mergeParams: true });

router.use(apiKeyMiddleware);

router.get('/', matchesController.getAllMatches);

router.post('/', matchesController.registerMatch);

router.put('/:id', matchesController.updateMatch);

router.delete('/:id', matchesController.deleteMatch);

export default router;
