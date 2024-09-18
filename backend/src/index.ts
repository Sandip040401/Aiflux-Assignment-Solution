import express from 'express';
import { PrismaClient } from '@prisma/client';
import './mqttSubscriber';
import cors from 'cors';
import axios from 'axios';

const app = express();
const prisma = new PrismaClient();

// Use CORS middleware
app.use(cors());

// Function to call the Python HTTP service
const callPythonService = async (endpoint: string) => {
  try {
    const response = await axios.get(`https://aiflux-assignment-solution-1.onrender.com/${endpoint}`);
    console.log(response.data);
  } catch (error) {
  // @ts-ignore
    console.error(`Error calling Python service: ${error.message}`);
  }
};

// Call the Python service to run the publisher and subscriber
callPythonService('run-publisher');
callPythonService('run-subscriber');

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
