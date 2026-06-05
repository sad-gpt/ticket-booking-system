import prisma from '../config/prisma.js';

const createUser = async (userData) => {
  return prisma.user.create({
    data: userData,
  });
};

const getUsers = async () => {
  return prisma.user.findMany();
};

const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

const getUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export default {
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
};
