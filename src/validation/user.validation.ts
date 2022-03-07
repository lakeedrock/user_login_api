import { Joi } from "express-validation";
import { PasswordComparable } from "../interfaces/Authenticatable";
import { UserDB } from "../db/UserDB";
import bcryptjs from "bcryptjs";

/**
 *
 */
export const RegisterUserRequestSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  passwordConfirmation: Joi.string().required(),
});

/**
 *
 */
export const LoginUserRequestSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

/**
 *
 */
export const UpdateUserRequestSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
});

/**
 *
 */
export const ChangePasswordRequestSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
  passwordConfirmation: Joi.string().required(),
});

/**
 *
 * @param registerData
 * @constructor
 */
export const IsPasswordConfirmed = (
  registerData: PasswordComparable
): boolean => {
  if (registerData.password !== registerData.passwordConfirmation) {
    return false;
  } else {
    return true;
  }
};

/**
 *
 * @param email
 * @constructor
 */
export const IsEmailRegistered = async (email: string): Promise<boolean> => {
  const user = new UserDB();
  const registeredUser = await user.getUserByEmail(email);
  if (registeredUser === undefined) {
    return false;
  } else {
    return true;
  }
};

/**
 *
 * @param givenPassword
 * @param registeredPassword
 * @constructor
 */
export const IsPasswordsMatched = async (
  givenPassword: string,
  registeredPassword: string
): Promise<boolean> => {
  if (await bcryptjs.compare(givenPassword, registeredPassword)) {
    return true;
  } else {
    return false;
  }
};
