import prisma from '../config/prisma.js';
import bookingRepository from '../repositories/booking.repository.js';
import userRepository from '../repositories/user.repository.js';
import eventRepository from '../repositories/event.repository.js';
import seatRepository from '../repositories/seat.repository.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Creates a booking within a database transaction.
 * Ensures atomicity and consistency.
 */
const createBooking = async (bookingBody) => {
  const { userId, eventId, seatId } = bookingBody;

  // 1. Initial Validations (Reads can happen outside transaction for efficiency, 
  // but status check should ideally be inside if we want strict consistency)
  const user = await userRepository.getUserById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  const event = await eventRepository.getEventById(eventId);
  if (!event) throw new ApiError(404, 'Event not found');

  const seat = await seatRepository.getSeatById(seatId);
  if (!seat) throw new ApiError(404, 'Seat not found');

  if (seat.venueId !== event.venue.id) {
    throw new ApiError(400, 'Seat does not belong to the venue of this event');
  }

  // Orchestrate Transaction
  return prisma.$transaction(async (tx) => {
    // 2. Re-verify availability inside transaction to prevent race conditions
    // (Prisma unique constraint also protects this, but explicit check is good for business logic)
    const existingBooking = await tx.booking.findUnique({
      where: {
        eventId_seatId: { eventId, seatId },
      },
    });

    if (existingBooking && existingBooking.status === 'CONFIRMED') {
      throw new ApiError(400, 'Seat already booked for this event');
    }

    // 3. Create or Update Booking
    let booking;
    if (existingBooking && existingBooking.status === 'CANCELLED') {
      // Re-activate a previously cancelled booking record
      booking = await bookingRepository.updateBookingStatus(existingBooking.id, 'CONFIRMED', tx);
    } else {
      booking = await bookingRepository.createBooking({ userId, eventId, seatId }, tx);
    }

    // [Future extension point: Update related records, e.g., loyalty points, payment logs]
    
    return booking;
  });
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

/**
 * Cancels a booking within a transaction.
 */
const cancelBooking = async (id) => {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({ where: { id } });
    
    if (!booking) throw new ApiError(404, 'Booking not found');
    
    if (booking.status === 'CANCELLED') {
      throw new ApiError(400, 'Booking is already cancelled');
    }

    const updatedBooking = await bookingRepository.updateBookingStatus(id, 'CANCELLED', tx);
    
    // [Future extension point: Trigger refund process, update seat availability cache]
    
    return updatedBooking;
  });
};

export default {
  createBooking,
  getBookingById,
  getBookingsByUser,
  cancelBooking,
};
