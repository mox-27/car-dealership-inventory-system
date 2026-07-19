import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';
import { create, list, update, remove, search, purchase, restock, bulkCreate } from '../controllers/vehicleController.js';

const router = Router();

// All vehicle routes require authentication
router.use(authenticate);

router.post('/', create);
router.post('/bulk', bulkCreate);
router.get('/search', search); // Must be before /:id if we add it
router.get('/', list);
router.put('/:id', update);
router.delete('/:id', authorizeAdmin, remove);
router.post('/:id/purchase', purchase);
router.post('/:id/restock', authorizeAdmin, restock);

export default router;
