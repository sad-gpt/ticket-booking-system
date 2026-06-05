import prisma from '../config/prisma.js';
import redis from '../config/redis.js';
import bookingRepository from '../repositories/booking.repository.js';
import userRepository from '../repositories/user.repository.js';
import eventRepository from '../repositories/event.repository.js';
import seatRepository from '../repositories/seat.repository.js';
import reservationService from './reservation.service.js';
import { addBookingConfirmationJob } from '../jobs/bookingConfirmation.job.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Creates a booking within a database transaction.
 * Ensures atomicity and consistency.
 */
const createBooking = async (bookingBody) => {
  const { userId, eventId, seatId } = bookingBody;

  // 1. Initial Validations
  const user = await userRepository.getUserById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  const event = await eventRepository.getEventById(eventId);
  if (!event) throw new ApiError(404, 'Event not found');

  const seat = await seatRepository.getSeatById(seatId);
  if (!seat) throw new ApiError(404, 'Seat not found');

  if (seat.venueId !== event.venue.id) {
    throw new ApiError(400, 'Seat does not belong to the venue of this event');
  }

  // 2. Verify Redis Reservation
  const reservationKey = reservationService.getReservationKey(eventId, seatId);
  const reservation = await redis.get(reservationKey);

  if (!reservation) {
    throw new ApiError(400, 'Seat must be reserved before booking');
  }

  const reservationData = JSON.parse(reservation);
  if (reservationData.userId !== userId) {
    throw new ApiError(403, 'This seat is reserved by another user');
  }

  // 3. Orchestrate DB Transaction
  const booking = await prisma.$transaction(async (tx) => {
    const existingBooking = await tx.booking.findUnique({
      where: {
        eventId_seatId: { eventId, seatId },
      },
    });

    if (existingBooking && existingBooking.status === 'CONFIRMED') {
      throw new ApiError(400, 'Seat already booked for this event');
    }

    let newBooking;
    if (existingBooking && existingBooking.status === 'CANCELLED') {
      newBooking = await bookingRepository.updateBookingStatus(existingBooking.id, 'CONFIRMED', tx);
    } else {
      newBooking = await bookingRepository.createBooking({ userId, eventId, seatId }, tx);
    }
    
    return newBooking;
  });

  // 4. Cleanup Redis Reservation
  await redis.del(reservationKey);

  // 5. Add Background Job: Booking Confirmation
  await addBookingConfirmationJob({
    bookingId: booking.id,
    userId: booking.userId,
    eventId: booking.eventId,
    seatId: booking.seatId,
  });

  return booking;
};

const getBookingById = async (id) => {
  const booking = await bookingRepository.getBookingById(id);
  if (!booking) throw new ApiError(404, 'Booking not found');
  return booking;
};

const getBookingsByUser = async (userId) => {
  const user = await userRepository.getUserById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  return bookingRepository.getBookingsByUserId(userId);
};

const cancelBooking = async (id) => {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({ where: { id } });
    if (!booking) throw new ApiError(404, 'Booking not found');
    if (booking.status === 'CANCELLED') {
      throw new ApiError(400, 'Booking is already cancelled');
    }

    const updatedBooking = await bookingRepository.updateBookingStatus(id, 'CANCELLED', tx);
    return updatedBooking;
  });
};

export default {
  createBooking,
  getBookingById,
  getBookingsByUser,
  cancelBooking,
};
