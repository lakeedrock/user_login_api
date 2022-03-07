import { Router } from "express";
import {
  AuthenticatedUser,
  ChangePassword,
  Login,
  Logout,
  Register,
  UpdateUser,
} from "../controllers/auth.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

/**
 *
 * @param router
 */
export const routes = (router: Router) => {
  router.post("/api/register", Register);
  router.post("/api/login", Login);
  router.get("/api/user", AuthMiddleware, AuthenticatedUser);
  router.post("/api/logout", AuthMiddleware, Logout);
  router.put("/api/user", AuthMiddleware, UpdateUser);
  router.put("/api/password", AuthMiddleware, ChangePassword);
};
