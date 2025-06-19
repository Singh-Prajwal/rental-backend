import { Router } from 'express';
import { getAllProperties, 
  getPropertyById, 
  createProperty, 
  updateProperty, 
  deleteProperty  } from '../controllers/propertyController';
import { protect, admin } from '../middleware/authMiddleware';
const router = Router();

router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

router.post('/', protect, admin, createProperty);
router.put('/:id', protect, admin, updateProperty);
router.delete('/:id', protect, admin, deleteProperty);
export default router;