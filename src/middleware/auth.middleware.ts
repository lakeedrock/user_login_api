import { Request, Response } from "express";
import { verify } from "jsonwebtoken";

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: Function
) => {
  if (req.cookies["jwt"] === undefined) {
    return res.status(401).send({ message: "Unauthenticated request." });
  }
  const jwt = req.cookies["jwt"];
  const payload: any = verify(jwt, process.env.SECRET_KEY);
  if (payload) {
    req["userId"] = payload.id;
    next();
  } else {
    return res.status(401).send({ message: "Unauthenticated request." });
  }
};
