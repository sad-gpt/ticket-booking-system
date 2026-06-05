import 'dotenv/config';
import './workers/bookingConfirmation.worker.js';
import './workers/reservationCleanup.worker.js';

console.log('BullMQ Workers are running...');
