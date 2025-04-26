import express from 'express';
import asyncHandler from '../middleware/asyncHandler';
import { createDoctor, loginDoctor, getDoctorProfile } from '../controllers/doctorControllers';
import { authenticateDoctor } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', asyncHandler(createDoctor));
router.post('/login', asyncHandler(loginDoctor));
router.get('/profile', authenticateDoctor, asyncHandler(getDoctorProfile));

export default router;
