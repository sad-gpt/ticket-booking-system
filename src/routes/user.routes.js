import express from 'express';
import { validate } from '../middlewares/validate.js';
import userValidation from '../validations/user.validation.js';
import userController from '../controllers/user.controller.js';

const router = express.Router();

router
  .route('/')
  .post(validate(userValidation.createUser), userController.createUser)
  .get(userController.getUsers);

router
  .route('/:userId')
  .get(validate(userValidation.getUser), userController.getUser);

export default router;
