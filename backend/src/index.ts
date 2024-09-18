
// index.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';
import './mqttSubscriber';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';

const app = express();
const prisma = new PrismaClient();

// Use CORS middleware
app.use(cors());

// Start Python Publisher and Subscriber scripts
const publisherPath = path.join(__dirname, 'publisher.py');
const subscriberPath = path.join(__dirname, 'subscriber.py');

// Function to start Python scripts
const startPythonScript = (scriptPath: string, name: string) => {
  const process = spawn('python', [scriptPath]);

  process.stdout.on('data', (data) => {
    console.log(`${name} Output: ${data}`);
  });

  process.stderr.on('data', (data) => {
    console.error(`${name} Error: ${data}`);
  });

  process.on('close', (code) => {
    console.log(`${name} exited with code ${code}`);
  });
};

// Start both scripts
startPythonScript(publisherPath, 'Publisher');
startPythonScript(subscriberPath, 'Subscriber');

// Endpoint to get temperatures
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

// Start the Express server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
