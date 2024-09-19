import express from 'express';
import { PrismaClient } from '@prisma/client';
import { spawn } from 'child_process';
import cors from 'cors';
import path from 'path';
import './mqttSubscriber';  // Assuming mqttSubscriber is set up correctly

const app = express();
const prisma = new PrismaClient();

// CORS middleware
app.use(cors());

// API to fetch temperature data from the past minute
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

// Function to run Python scripts
const runPythonFile = (fileName: string) => {
  const pythonProcess = spawn('python', [path.join(__dirname, fileName)]);  // Ensure proper path

  pythonProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python script ${fileName} exited with code ${code}`);
  });
};

// Run subscriber.py and publisher.py located in src folder
runPythonFile('subscriber.py');
runPythonFile('publisher.py');

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
