import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js';
import venueRoutes from './routes/venue.routes.js';
import seatRoutes from './routes/seat.routes.js';
import eventRoutes from './routes/event.routes.js';
import availabilityRoutes from './routes/availability.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import reservationRoutes from './routes/reservation.routes.js';
import queueRoutes from './routes/queue.routes.js';
import bookingController from './controllers/booking.controller.js';
import bookingValidation from './validations/booking.validation.js';
import { validate } from './middlewares/validate.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { ApiError } from './utils/ApiError.js';

// Import workers to ensure they are initialized
import './workers/bookingConfirmation.worker.js';
import './workers/reservationCleanup.worker.js';

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/venues/:venueId/seats', seatRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/events/:eventId/availability', availabilityRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/queues', queueRoutes);
app.use('/api/users/:userId/bookings', validate(bookingValidation.getUserBookings), bookingController.getUserBookings);

// 404 handler
app.use((req, res, next) => {
  next(new ApiError(404, 'Resource not found'));
});

// Global Error Handler
app.use(errorHandler);

export default app;
