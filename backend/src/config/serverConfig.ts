import express from 'express';
import cors from 'cors';
import temperatureRoutes from '../routes/temperatureRoutes';

const app = express();

// Middleware
app.use(cors());

// Routes
app.use(temperatureRoutes);

export default app;
