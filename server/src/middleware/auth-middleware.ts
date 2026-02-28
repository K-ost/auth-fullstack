import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: JwtPayload | string;
}

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) return res.status(400).send({ msg: "No authorization" });

    const token = authorization.split(" ")[1];
    if (!token) return res.status(400).send({ msg: "No access token" });

    jwt.verify(token, process.env.ACCESS_TOKEN as string, (err, data) => {
      if (err) return res.status(401).send({ msg: "Invalid access token" });
      req.user = data;
      next();
    });
  } catch (error) {
    res.sendStatus(500);
  }
}

export default authMiddleware;
