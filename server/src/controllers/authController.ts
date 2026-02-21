import { Request, Response } from "express";
import { User } from "../types";
import db from "../db/db";
import bcrypt from "bcryptjs";

class AuthController {
  async register(req: Request<{}, {}, User>, res: Response) {
    try {
      const { email, password, name, surname } = req.body;

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
        return res.status(403).send(`User with email ${email} already esists`);
      }

      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  }
}

export default new AuthController();
