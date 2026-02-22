import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: JwtPayload | string;
}

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) return res.sendStatus(401);

    const token = authorization.split(" ")[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN as string, (err, data) => {
      if (err) return res.sendStatus(403);
      req.user = data;
      next();
    });
  } catch (error) {
    res.sendStatus(500);
  }
}

export default authMiddleware;
