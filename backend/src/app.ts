import express from 'express';
import cors from 'cors';
import temperatureRoutes from './routes/temperatureRoutes';
import { runPythonFile } from './utils/runPython';
import './services/mqttSubscriber';  // Start MQTT subscriber service

const app = express();

// CORS Middleware
app.use(cors());

// API Routes
app.use(temperatureRoutes);

// Run Python scripts
runPythonFile('subscriber.py');
runPythonFile('publisher.py');

export default app;
