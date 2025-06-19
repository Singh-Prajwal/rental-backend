// backend/src/routes/supportRoutes.ts
import { Router } from 'express';
import { createSupportRequest, getAllSupportRequests, updateSupportRequestStatus, scheduleTechnicianVisit } from '../controllers/supportController';
import { protect, admin } from '../middleware/authMiddleware';

const router = Router();

// We can assume creating a request is for logged-in users
router.post('/', protect, createSupportRequest);

// Admin-only routes for managing requests
router.get('/', protect, admin, getAllSupportRequests);
router.patch('/:id', protect, admin, updateSupportRequestStatus);
router.post('/:id/schedule-visit', protect, admin, scheduleTechnicianVisit); // NEW ROUTE

export default router;