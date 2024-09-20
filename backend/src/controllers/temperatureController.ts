import { Request, Response } from 'express';
import prisma from '../services/prismaService';

export const getTemperatures = async (req: Request, res: Response) => {
  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
  try {
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
  } catch (error) {
    res.status(500).json({ error: 'Error fetching temperature data' });
  }
};
