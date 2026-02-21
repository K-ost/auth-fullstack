import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import db from "../db/db";
import { User } from "../types";

class AuthController {
  async register(req: Request<{}, {}, User>, res: Response) {
    try {
      const { email, password, name, surname } = req.body;
      const result = validationResult(req);

      if (!result.isEmpty()) {
        return res.status(403).send(result.array());
      }

      const hashedPass = bcrypt.hashSync(password, 7);

      const isUser = await db.query(
        `
        INSERT INTO users (email, password, name, surname)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO NOTHING
        RETURNING id, email, name, surname
      `,
        [email, hashedPass, name, surname],
      );

      if (isUser.rowCount === 0) {
        return res.status(403).send({ msg: `User with email ${email} already esists` });
      }

      res.status(200).send({ data: isUser, msg: "User has been registered" });
    } catch (error) {
      res.sendStatus(500);
    }
  }
}

export default new AuthController();
