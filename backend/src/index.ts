
// index.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';
import './mqttSubscriber';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';
import os from 'os';


const app = express();
const prisma = new PrismaClient();

// Use CORS middleware
app.use(cors());

// Define the Python path based on the OS
const pythonPath = os.platform() === 'win32'
  ? path.resolve(__dirname, '..', 'venv', 'Scripts', 'python.exe')
  : path.resolve(__dirname, '..', 'venv', 'bin', 'python');

// Function to start Python scripts
const startPythonScript = (scriptName: string) => {
  const scriptPath = path.resolve(__dirname, '..', scriptName);
  const process = spawn(pythonPath, [scriptPath], { stdio: 'inherit' });

  process.on('error', (err) => {
    console.error(`Failed to start ${scriptName}: ${err.message}`);
  });

  process.on('exit', (code) => {
    console.log(`${scriptName} exited with code ${code}`);
  });
};

// Start the Python scripts
startPythonScript('publisher.py');
startPythonScript('subscriber.py');

app.get('/temperatures', async (req, res) => {
  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
  const temperatures = await prisma.temperature.findMany({
    where: {
      timestamp: {
        gte: oneMinuteAgo,
      },
    },
    orderBy: {
      timestamp: 'asc',
    },
  });
  res.json(temperatures);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});