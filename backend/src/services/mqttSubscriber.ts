import mqtt from 'mqtt';
import prisma from './prismaService';

const broker = 'mqtt://broker.hivemq.com';
const topic = 'aiflux/test_topic';
const client = mqtt.connect(broker);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe(topic, (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log(`Subscribed to topic ${topic}`);
    }
  });
});

client.on('message', async (topic, message) => {
  const temperature = parseFloat(message.toString());
  console.log(`Received temperature: ${temperature}`);

  try {
    await prisma.temperature.create({
      data: {
        value: temperature,
        timestamp: new Date(),
      },
    });
    console.log('Temperature stored in the database.');
  } catch (error) {
    console.error('Error storing temperature:', error);
  }
});

process.on('SIGINT', async () => {
  console.log('Disconnecting...');
  await prisma.$disconnect();
  client.end();
  process.exit(0);
});
