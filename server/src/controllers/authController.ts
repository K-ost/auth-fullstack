import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../db/db";
import tokenService from "../services/token-service";
import { User } from "../types";
import OPTIONS from "../options";

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

      const userPayload: Partial<User> = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      const { accessToken, refreshToken } = tokenService.generateTokens(userPayload);

      await tokenService.saveToken(refreshToken, user.id);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: OPTIONS.refreshTokenCookie,
      });

      res.status(200).send({ accessToken, user: userPayload });
    } catch (error) {
      res.sendStatus(500);
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies["refreshToken"];
      if (!refreshToken) return res.sendStatus(401);

      await tokenService.deleteTokenFromDb(refreshToken);

      res.clearCookie("refreshToken", { httpOnly: true });
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies["refreshToken"];
      if (!refreshToken) return res.sendStatus(401);

      const sessionTokens = await db.query("SELECT * FROM tokens WHERE token = $1", [
        refreshToken,
      ]);

      if (sessionTokens.rowCount === 0) return res.sendStatus(401);

      try {
        const isTokenValid = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN as string,
        ) as object;

        const { id, email, name } = isTokenValid as Partial<User>;
        const newPayload: Partial<User> = { id, email, name };
        const { accessToken, refreshToken: newRefreshToken } =
          tokenService.generateTokens(newPayload);

        await tokenService.deleteTokenFromDb(refreshToken);
        await tokenService.saveToken(newRefreshToken, newPayload.id!);

        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          maxAge: OPTIONS.refreshTokenCookie,
        });
        res.status(200).send({ accessToken, user: newPayload });
      } catch (error) {
        res.status(401).send("Session expired");
      }
    } catch (error) {
      res.sendStatus(500);
    }
  }
}

export default new AuthController();
