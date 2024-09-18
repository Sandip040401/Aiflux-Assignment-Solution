
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

// Function to run shell commands like `pip install`
const runShellCommand = (command: string, args: string[]) => {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args);

    process.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    process.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve(`Command executed successfully with code ${code}`);
      } else {
        reject(`Command failed with code ${code}`);
      }
    });
  });
};

// Install paho-mqtt in the Python environment
runShellCommand('pip', ['install', 'paho-mqtt'])
  .then((result) => {
    console.log(result);
    // Start the Python scripts after installation
    startPythonScripts();
  })
  .catch((error) => {
    console.error('Failed to install paho-mqtt:', error);
  });

// Function to start Python scripts
const startPythonScripts = () => {
  const publisherPath = path.join(__dirname, 'publisher.py');
  const subscriberPath = path.join(__dirname, 'subscriber.py');

  // Function to start a Python script
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

  startPythonScript(publisherPath, 'Publisher');
  startPythonScript(subscriberPath, 'Subscriber');
};

// Temperature endpoint
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

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});