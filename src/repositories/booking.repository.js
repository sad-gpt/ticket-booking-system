import prisma from '../config/prisma.js';

/**
 * Creates a new booking. Supports passing a transaction client.
 */
const createBooking = async (bookingData, tx = prisma) => {
  return tx.booking.create({
    data: {
      userId: bookingData.userId,
      eventId: bookingData.eventId,
      seatId: bookingData.seatId,
      status: 'CONFIRMED',
    },
    include: {
      user: true,
      event: true,
      seat: true,
    },
  });
};

const getBookingById = async (id) => {
  return prisma.booking.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      event: {
        include: { venue: true },
      },
      seat: true,
    },
  });
};

const getBookingsByUserId = async (userId) => {
  return prisma.booking.findMany({
    where: { userId },
    include: {
      event: {
        include: { venue: true },
      },
      seat: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Updates booking status. Supports passing a transaction client.
 */
const updateBookingStatus = async (id, status, tx = prisma) => {
  return tx.booking.update({
    where: { id },
    data: { status },
  });
};

const findExistingBooking = async (eventId, seatId) => {
  return prisma.booking.findUnique({
    where: {
      eventId_seatId: {
        eventId,
        seatId,
      },
    },
  });
};

export default {
  createBooking,
  getBookingById,
  getBookingsByUserId,
  updateBookingStatus,
  findExistingBooking,
};
