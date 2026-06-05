import { Worker } from 'bullmq';
import { redisConfig } from '../config/queue.js';

const bookingWorker = new Worker(
  'booking-confirmation',
  async (job) => {
    const { bookingId, userId, eventId, seatId } = job.data;
    
    console.log(`[Worker] Processing booking confirmation for ID: ${bookingId}`);
    
    // Simulate email/notification generation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    console.log(`[Worker] Successfully sent confirmation to User ${userId} for Event ${eventId}, Seat ${seatId}`);
  },
  { connection: redisConfig }
);

bookingWorker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} completed successfully`);
});

bookingWorker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job.id} failed: ${err.message}`);
});

export default bookingWorker;
