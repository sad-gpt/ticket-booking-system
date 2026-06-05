import express from 'express';
import { bookingQueue } from '../jobs/bookingConfirmation.job.js';
import { reservationQueue } from '../jobs/reservationCleanup.job.js';

const router = express.Router();

router.get('/status', async (req, res, next) => {
  try {
    const [bookingCounts, reservationCounts] = await Promise.all([
      bookingQueue.getJobCounts(),
      reservationQueue.getJobCounts(),
    ]);

    res.send({
      bookingQueue: bookingCounts,
      reservationQueue: reservationCounts,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
