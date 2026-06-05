import redis from '../config/redis.js';
import userRepository from '../repositories/user.repository.js';
import eventRepository from '../repositories/event.repository.js';
import seatRepository from '../repositories/seat.repository.js';
import bookingRepository from '../repositories/booking.repository.js';
import { ApiError } from '../utils/ApiError.js';

const RESERVATION_TTL = 300; // 5 minutes

const getReservationKey = (eventId, seatId) => `reservation:event:${eventId}:seat:${seatId}`;

const reserveSeat = async (reservationBody) => {
  const { userId, eventId, seatId } = reservationBody;

  // 1. Validate entities
  const user = await userRepository.getUserById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  const event = await eventRepository.getEventById(eventId);
  if (!event) throw new ApiError(404, 'Event not found');

  const seat = await seatRepository.getSeatById(seatId);
  if (!seat) throw new ApiError(404, 'Seat not found');

  if (seat.venueId !== event.venue.id) {
    throw new ApiError(400, 'Seat does not belong to the venue of this event');
  }

  // 2. Check if already booked in DB
  const existingBooking = await bookingRepository.findExistingBooking(eventId, seatId);
  if (existingBooking && existingBooking.status === 'CONFIRMED') {
    throw new ApiError(400, 'Seat already booked');
  }

  // 3. Check Redis reservation
  const key = getReservationKey(eventId, seatId);
  const existingReservation = await redis.get(key);
  
  if (existingReservation) {
    const data = JSON.parse(existingReservation);
    if (data.userId === userId) {
      // Already reserved by this user, just return success
      return data;
    }
    throw new ApiError(400, 'Seat currently reserved by another user');
  }

  // 4. Create reservation
  const reservationData = {
    userId,
    eventId,
    seatId,
    reservedAt: Date.now(),
  };

  // Set with TTL and NX (Not eXists) for atomic lock
  const result = await redis.set(
    key,
    JSON.stringify(reservationData),
    'EX',
    RESERVATION_TTL,
    'NX'
  );

  if (!result) {
    throw new ApiError(400, 'Seat currently reserved (race condition lost)');
  }

  return reservationData;
};

const releaseReservation = async (eventId, seatId, userId) => {
  const key = getReservationKey(eventId, seatId);
  const reservation = await redis.get(key);

  if (!reservation) {
    throw new ApiError(404, 'Reservation not found or expired');
  }

  const data = JSON.parse(reservation);
  if (data.userId !== userId) {
    throw new ApiError(403, 'You do not own this reservation');
  }

  await redis.del(key);
};

const getEventReservations = async (eventId) => {
  const pattern = `reservation:event:${eventId}:seat:*`;
  const keys = await redis.keys(pattern);
  
  if (keys.length === 0) return [];

  const reservations = await redis.mget(keys);
  return reservations.map(res => JSON.parse(res));
};

export default {
  reserveSeat,
  releaseReservation,
  getEventReservations,
  getReservationKey,
};
