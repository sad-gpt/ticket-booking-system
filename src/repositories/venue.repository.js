import prisma from '../config/prisma.js';

const createVenue = async (venueData) => {
  return prisma.venue.create({
    data: venueData,
  });
};

const getVenues = async () => {
  return prisma.venue.findMany();
};

const getVenueById = async (id) => {
  return prisma.venue.findUnique({
    where: { id },
  });
};

const getVenueByName = async (name) => {
  return prisma.venue.findFirst({
    where: { name },
  });
};

export default {
  createVenue,
  getVenues,
  getVenueById,
  getVenueByName,
};
