import { ApiError } from '../utils/ApiError.js';
import userService from '../services/user.service.js';

const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).send(user);
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await userService.queryUsers();
    res.send(users);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(parseInt(req.params.userId));
    res.send(user);
  } catch (error) {
    next(error);
  }
};

export default {
  createUser,
  getUsers,
  getUser,
};
