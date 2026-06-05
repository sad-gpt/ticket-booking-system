import availabilityRepository from '../repositories/availability.repository.js';
import { ApiError } from '../utils/ApiError.js';

const getEventAvailability = async (eventId) => {
  const event = await availabilityRepository.getEventWithSeatsAndBookings(eventId);

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  const allSeats = event.venue.seats;
  const bookedSeatIds = new Set(event.bookings.map((b) => b.seatId));

  const bookedSeats = [];
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
    } else {
      availableSeats.push(seatInfo);
    }
  });

  return {
    eventId: event.id,
    eventTitle: event.title,
    totalSeats: allSeats.length,
    bookedSeats,
    availableSeats,
  };
};

export default {
  getEventAvailability,
};
