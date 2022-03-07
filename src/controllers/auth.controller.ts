import { Request, Response } from "express";
import {
  RegisterUserRequestSchema,
  LoginUserRequestSchema,
  IsPasswordConfirmed,
  IsEmailRegistered,
  IsPasswordsMatched,
  UpdateUserRequestSchema,
  ChangePasswordRequestSchema,
} from "../validation/user.validation";
import {
  Registrable,
  Loginable,
  Updatable,
  PasswordUpdatable,
  PasswordComparable,
} from "../interfaces/Authenticatable";
import { UserDB } from "../db/UserDB";
import { sign } from "jsonwebtoken";
import { DBUpdatable } from "../interfaces/DBAuthenticatable";
import bcryptjs from "bcryptjs";

/**
 *
 * @param req
 * @param res
 * @constructor
 */
export const Register = async (req: Request, res: Response) => {
  const registerData = req.body as Registrable;
  const { error } = RegisterUserRequestSchema.validate(registerData);
  if (error) {
    return res.status(400).send(error.details);
  }

  const passwords: PasswordComparable = {
    password: registerData.password,
    passwordConfirmation: registerData.passwordConfirmation,
  };
  if (IsPasswordConfirmed(passwords) !== true) {
    return res.status(400).send({
      message: "Password and Password confirmation did not match.",
    });
  }

  if (await IsEmailRegistered(registerData.email)) {
    return res.status(400).send({
      message: "This email address already being registered.",
    });
  }

  const user = new UserDB();
  registerData.password = await bcryptjs.hash(registerData.password, 10);
  const registeredUser = await user.registerUser(registerData);
  return res.status(201).send(registeredUser);
};

/**
 *
 * @param req
 * @param res
 * @constructor
 */
export const Login = async (req: Request, res: Response) => {
  const loginData = req.body as Loginable;
  const { error } = LoginUserRequestSchema.validate(loginData);
  if (error) {
    return res.status(400).send(error.details);
  }

  const user = new UserDB();
  const registeredUser = await user.getUserByEmail(loginData.email);

  if (!registeredUser) {
    return res.status(404).send({
      message: "Invalid credentials.",
    });
  }
  const passwordMatched = await IsPasswordsMatched(
    loginData.password,
    registeredUser.password
  );
  if (!passwordMatched) {
    return res.status(400).send({
      message: "Invalid credentials",
    });
  }

  const token = sign({ id: registeredUser.id }, process.env.SECRET_KEY);
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: parseInt(process.env.MAX_AGE),
  });
  return res.status(200).send({
    message: "success",
  });
};

/**
 *
 * @param req
 * @param res
 * @constructor
 */
export const AuthenticatedUser = async (req: Request, res: Response) => {
  const user = new UserDB();
  const { password, ...authenticatedUser } = await user.getUserById(
    req["userId"]
  );
  return res.status(200).send(authenticatedUser);
};

/**
 *
 * @param req
 * @param res
 * @constructor
 */
export const Logout = async (req: Request, res: Response) => {
  res.cookie("jwt", "", { maxAge: 0 });
  return res.status(200).send({ message: "success" });
};

/**
 *
 * @param req
 * @param res
 * @constructor
 */
export const UpdateUser = async (req: Request, res: Response) => {
  const userData = req.body as Updatable;
  const { error } = UpdateUserRequestSchema.validate(userData);
  if (error) {
    return res.status(400).send(error.details);
  }

  const user = new UserDB();
  if (await IsEmailRegistered(userData.email)) {
    return res.status(400).send({
      message: "Provided email address is already being registered.",
    });
  }
  // Map user data
  const updateData: DBUpdatable = {
    first_name: userData.firstName,
    last_name: userData.lastName,
    email: userData.email,
  };
  const { password, ...updatedUser } = await user.updateUserInfo(
    req["userId"],
    updateData
  );
  return res.status(200).send(updatedUser);
};

export const ChangePassword = async (req: Request, res: Response) => {
  const passwordData = req.body as PasswordUpdatable;
  const { error } = ChangePasswordRequestSchema.validate(passwordData);
  if (error) {
    return res.status(400).send(error.details);
  }

  const user = new UserDB();
  const userData = await user.getUserById(req["userId"]);

  const passwordMatched = await IsPasswordsMatched(
    passwordData.currentPassword,
    userData.password
  );
  if (!passwordMatched) {
    return res.status(400).send({
      message: "Your current password is incorrect. Please try again later.",
    });
  }

  const passwords: PasswordComparable = {
    password: passwordData.newPassword,
    passwordConfirmation: passwordData.passwordConfirmation,
  };
  const passwordConfirmed = await IsPasswordConfirmed(passwords);
  if (!passwordConfirmed) {
    return res.status(400).send({
      message: "Your new passwords did not match with password confirmation.",
    });
  }

  passwordData.newPassword = await bcryptjs.hash(passwordData.newPassword, 10);
  const result = await user.updatePassword(
    req["userId"],
    passwordData.newPassword
  );
  if (result.affected > 0) {
    return res.status(200).send({ message: "success" });
  } else {
    return res.status(500).send({ message: "Internal server error." });
  }
};
