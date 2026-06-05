import prisma from '../config/prisma.js';

/**
 * Fetches event details including its venue and all seats in that venue,
 * plus all confirmed bookings for that specific event.
 * @param {number} eventId 
 */
const getEventWithSeatsAndBookings = async (eventId) => {
  return prisma.event.findUnique({
    where: { id: eventId },
    include: {
      venue: {
        include: {
          seats: true,
        },
      },
      bookings: {
        where: {
          status: 'CONFIRMED',
        },
        select: {
          seatId: true,
        },
      },
    },
  });
};

export default {
  getEventWithSeatsAndBookings,
};
