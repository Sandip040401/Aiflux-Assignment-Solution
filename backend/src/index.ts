
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

// Function to run shell commands like `source venv/bin/activate && python`
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

// Start the Python scripts after activating virtual environment
const startPythonScripts = () => {
  const publisherPath = path.join(__dirname, 'publisher.py');
  const subscriberPath = path.join(__dirname, 'subscriber.py');

  // Use virtual environment and then run Python scripts
  const startPythonScript = (scriptPath: string, name: string) => {
    const venvPath = path.join(__dirname, 'venv', 'bin', 'python');
    const process = spawn(venvPath, [scriptPath]);

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

// Call to start the scripts
startPythonScripts();

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
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
