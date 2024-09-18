import express from 'express';
import { PrismaClient } from '@prisma/client';
import './mqttSubscriber';  // Assuming this is for your MQTT subscription
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';

const app = express();
const prisma = new PrismaClient();

// Use CORS middleware
app.use(cors());

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

// Run Python scripts
const runPythonFile = (fileName: string) => {
  const pythonProcess = spawn('python', [path.join(__dirname, fileName)]);

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

// Run subscriber.py and publisher.py
runPythonFile('subscriber.py');
runPythonFile('publisher.py');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
