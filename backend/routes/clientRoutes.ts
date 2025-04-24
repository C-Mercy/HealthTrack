// src/routes/clientRoutes.ts
import express from 'express';
import { registerClient ,editClient,deleteClient,getClientById,getClients} from '../controllers/clientController';

const router = express.Router();

// POST /api/clients
router.post('/register', registerClient);
router.put('/edit/:id', editClient);
router.delete('/delete/:id',deleteClient);
router.get('/getClients', getClients);
router.get('/get-by-Id/:id', getClientById);


export default router;
