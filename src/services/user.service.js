import userRepository from '../repositories/user.repository.js';
import { ApiError } from '../utils/ApiError.js';

const createUser = async (userBody) => {
  if (await userRepository.getUserByEmail(userBody.email)) {
    throw new ApiError(400, 'Email already taken');
  }
  return userRepository.createUser(userBody);
};

const queryUsers = async () => {
  return userRepository.getUsers();
};

const getUserById = async (id) => {
  const user = await userRepository.getUserById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

export default {
  createUser,
  queryUsers,
  getUserById,
};
