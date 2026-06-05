import prisma from '../config/prisma.js';

const createEvent = async (eventData) => {
  return prisma.event.create({
    data: eventData,
    include: {
      venue: {
        select: {
          name: true,
        },
      },
    },
  });
};

const getEvents = async () => {
  return prisma.event.findMany({
    orderBy: {
      date: 'asc',
    },
    include: {
      venue: {
        select: {
          name: true,
        },
      },
    },
  });
};

const getEventById = async (id) => {
  return prisma.event.findUnique({
    where: { id },
    include: {
      venue: {
        include: {
          _count: {
            select: { seats: true },
          },
        },
      },
    },
  });
};

export default {
  createEvent,
  getEvents,
  getEventById,
};
