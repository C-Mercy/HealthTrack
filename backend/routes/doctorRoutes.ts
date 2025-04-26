// src/routes/doctorRoutes.ts
import express from 'express';
import { createDoctor,loginDoctor } from '../controllers/doctorControllers';

const router = express.Router();

router.post('/register', createDoctor); 
router.post('/login',  loginDoctor);

export default router;
