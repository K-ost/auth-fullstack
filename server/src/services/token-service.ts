import jwt from "jsonwebtoken";

type TokensReturn = {
  accessToken: string;
  refreshToken: string;
};

interface ITokenService {
  generateTokens<T extends object>(payload: T): TokensReturn;
}

class TokenService implements ITokenService {
  generateTokens<T extends object>(payload: T): TokensReturn {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN as string, {
      expiresIn: "1m",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN as string, {
      expiresIn: "1d",
    });

    return { accessToken, refreshToken };
  }
}

export default new TokenService();
