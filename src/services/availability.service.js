import availabilityRepository from '../repositories/availability.repository.js';
import reservationService from './reservation.service.js';
import redis from '../config/redis.js';
import { ApiError } from '../utils/ApiError.js';

const getEventAvailability = async (eventId) => {
  const event = await availabilityRepository.getEventWithSeatsAndBookings(eventId);

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  // Fetch active reservations from Redis
  const pattern = `reservation:event:${eventId}:seat:*`;
  const reservationKeys = await redis.keys(pattern);
  const reservedSeatIds = new Set();
  
  if (reservationKeys.length > 0) {
    const reservations = await redis.mget(reservationKeys);
    reservations.forEach(res => {
      const data = JSON.parse(res);
      reservedSeatIds.add(data.seatId);
    });
  }

  const allSeats = event.venue.seats;
  const bookedSeatIds = new Set(event.bookings.map((b) => b.seatId));

  const bookedSeats = [];
  const reservedSeats = [];
  const availableSeats = [];

  allSeats.forEach((seat) => {
    const seatInfo = {
      id: seat.id,
      row: seat.row,
      number: seat.number,
      type: seat.type,
    };

    if (bookedSeatIds.has(seat.id)) {
      bookedSeats.push(seatInfo);
    } else if (reservedSeatIds.has(seat.id)) {
      reservedSeats.push(seatInfo);
    } else {
      availableSeats.push(seatInfo);
    }
  });

  return {
    eventId: event.id,
    eventTitle: event.title,
    totalSeats: allSeats.length,
    bookedSeats,
    reservedSeats,
    availableSeats,
  };
};

export default {
  getEventAvailability,
};
