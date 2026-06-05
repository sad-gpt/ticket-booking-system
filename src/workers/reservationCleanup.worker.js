import { Worker } from 'bullmq';
import { redisConfig } from '../config/queue.js';
import redis from '../config/redis.js';

const reservationWorker = new Worker(
  'reservation-cleanup',
  async (job) => {
    const { eventId, seatId, userId } = job.data;
    const key = `reservation:event:${eventId}:seat:${seatId}`;
    
    console.log(`[Worker] Checking reservation expiration for seat ${seatId}`);
    
    const reservation = await redis.get(key);
    if (reservation) {
      const data = JSON.parse(reservation);
      if (data.userId === userId) {
        // Seat is still reserved and hasn't been booked/deleted
        console.log(`[Worker] Reservation for seat ${seatId} expired. Logging event.`);
        // In a real system, we might trigger a notification or audit log here.
        // Redis TTL already removes the key, but we log the business event.
      }
    }
  },
  { connection: redisConfig }
);

reservationWorker.on('completed', (job) => {
  console.log(`[Worker] Reservation cleanup job ${job.id} finished`);
});

export default reservationWorker;
