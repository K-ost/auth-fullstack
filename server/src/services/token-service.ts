import jwt from "jsonwebtoken";
import db from "../db/db";

type TokensReturn = {
  accessToken: string;
  refreshToken: string;
};

interface ITokenService {
  generateTokens<T extends object>(payload: T): TokensReturn;
  saveToken(token: string, userId: number): Promise<void>;
}

class TokenService implements ITokenService {
  generateTokens<T extends object>(payload: T): TokensReturn {
    const accessToken = jwt.sign({ ...payload }, process.env.ACCESS_TOKEN as string, {
      expiresIn: "5m",
    });

    const refreshToken = jwt.sign({ ...payload }, process.env.REFRESH_TOKEN as string, {
      expiresIn: "1d",
    });

    return { accessToken, refreshToken };
  }

  async saveToken(refreshToken: string, userId: number): Promise<void> {
    await db.query(
      `
      INSERT INTO tokens (token, userId)
      VALUES ($1, $2)
      RETURNING token, userId
    `,
      [refreshToken, userId],
    );
  }

  async deleteTokenFromDb(refreshToken: string): Promise<void> {
    await db.query("DELETE FROM tokens WHERE token = $1", [refreshToken]);
  }
}

export default new TokenService();
