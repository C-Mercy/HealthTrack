// src/app.ts
import express from 'express';
import dotenv from 'dotenv';
import programRoutes from './routes/programRoutes';
import clientRoutes from './routes/clientRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

app.use(express.json()); // Body parser
app.use('/api/programs', programRoutes);
app.use('/api/clients', clientRoutes);

app.use(errorHandler); // Custom error middleware

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
