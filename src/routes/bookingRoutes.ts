// src/routes/bookingRoutes.ts
import { Router } from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import { createBooking, getAllBookings, getMyBookings, updateBookingStatus } from '../controllers/bookingController';
import { getBookingById } from '../controllers/bookingController';
const router = Router();

router.post('/', protect, createBooking);
router.get('/mybookings', protect, getMyBookings);
router.get('/:id', protect, getBookingById); // Protect this as well
// Admin-only routes
router.get('/', protect, admin, getAllBookings);
router.patch('/:id', protect, admin, updateBookingStatus);

export default router;