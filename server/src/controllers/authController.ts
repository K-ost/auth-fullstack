import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../db/db";
import { User } from "../types";

class AuthController {
  async register(req: Request<{}, {}, User>, res: Response) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(403).send(result.array());
      }

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
        return res.status(403).send({ msg: `User with email ${email} already esists` });
      }

      res.status(201).send({ data: isUser, msg: "User has been registered" });
    } catch (error) {
      res.sendStatus(500);
    }
  }

  async login(req: Request<{}, {}, User>, res: Response) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(403).send(result.array());
      }

      const { email, password } = req.body;

      const isUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);

      if (isUser.rowCount === 0) {
        return res.status(403).send({ msg: `User with email ${email} doesn't exist` });
      }

      const user: User = isUser.rows[0];

      const isPassValid = bcrypt.compareSync(password, user.password);

      if (!isPassValid) {
        return res.status(403).send({ msg: "Invalid password" });
      }

      // Token generating
      const accessToken = jwt.sign(
        { id: user.id, email },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "1m",
        },
      );
      const refreshToken = jwt.sign(
        { id: user.id, email },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "1d",
        },
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      });

      res.status(200).send({
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          surname: user.surname,
        },
      });
    } catch (error) {
      res.sendStatus(500);
    }
  }
}

export default new AuthController();
