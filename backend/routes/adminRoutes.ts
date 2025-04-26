import express from 'express';
import asyncHandler from '../middleware/asyncHandler';
import {
  createDoctorRequest,
  getPendingDoctorRequests,
  approveDoctorRequest,
  rejectDoctorRequest,
  loginAdmin,
  registerAdmin,
} from '../controllers/adminController';

const router = express.Router();
// Admin registration and login routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Public route for doctors to submit registration requests
router.post('/doctor-requests', asyncHandler(createDoctorRequest));

// Admin routes to manage doctor registration requests
router.get('/doctor-requests', asyncHandler(getPendingDoctorRequests));
router.put('/doctor-requests/:id/approve', asyncHandler(approveDoctorRequest));
router.put('/doctor-requests/:id/reject', asyncHandler(rejectDoctorRequest));

export default router;
