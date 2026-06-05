import { Queue } from 'bullmq';
import { redisConfig, defaultJobOptions } from '../config/queue.js';

const bookingQueue = new Queue('booking-confirmation', {
  connection: redisConfig,
  defaultJobOptions,
});

const addBookingConfirmationJob = async (data) => {
  await bookingQueue.add('send-confirmation', data);
  console.log(`[Queue] Booking confirmation job added for booking ${data.bookingId}`);
};

export { bookingQueue, addBookingConfirmationJob };
