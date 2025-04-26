// src/routes/programRoutes.ts
import express from 'express';
import { createProgram,getPrograms,editProgram,deleteProgram, getProgramById } from '../controllers/programController';
import { authenticateDoctor } from '../middleware/authMiddleware';

const router = express.Router();

///api/programs
router.post('/createProgram', authenticateDoctor, createProgram);
//get program by id
router.get('/get-program-by-Id/:id', getProgramById);
router.get('/getall', getPrograms);
router.put('/editProgram/:id', editProgram);
router.delete('/delete/:id',deleteProgram)

export default router;
