import { Queue } from 'bullmq';
import { redisConfig, defaultJobOptions } from '../config/queue.js';

const reservationQueue = new Queue('reservation-cleanup', {
  connection: redisConfig,
  defaultJobOptions,
});

const addReservationCleanupJob = async (data) => {
  // Delay matches our reservation TTL (300 seconds)
  await reservationQueue.add('cleanup-stale-reservation', data, {
    delay: 300000, 
  });
  console.log(`[Queue] Reservation cleanup job scheduled for seat ${data.seatId} in 5 minutes`);
};

export { reservationQueue, addReservationCleanupJob };
