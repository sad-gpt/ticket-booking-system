import prisma from '../config/prisma.js';

const createSeat = async (seatData) => {
  return prisma.seat.create({
    data: seatData,
  });
};

const createManySeats = async (seatsData) => {
  return prisma.seat.createMany({
    data: seatsData,
    skipDuplicates: true,
  });
};

const getSeatsByVenueId = async (venueId) => {
  return prisma.seat.findMany({
    where: { venueId },
    orderBy: [
      { row: 'asc' },
      { number: 'asc' },
    ],
  });
};

const getSeatByLocation = async (venueId, row, number) => {
  return prisma.seat.findUnique({
    where: {
      venueId_row_number: {
        venueId,
        row,
        number,
      },
    },
  });
};

export default {
  createSeat,
  createManySeats,
  getSeatsByVenueId,
  getSeatByLocation,
};
