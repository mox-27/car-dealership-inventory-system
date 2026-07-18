import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';
import { create, list, update, remove } from '../controllers/vehicleController.js';

const router = Router();

// All vehicle routes require authentication
router.use(authenticate);

router.post('/', create);
router.get('/', list);
router.put('/:id', update);
router.delete('/:id', authorizeAdmin, remove);

export default router;
