import { Request, Response } from "express";

class AuthController {
  async register(req: Request, res: Response) {
    try {
    } catch (error) {
      res.sendStatus(500);
    }
  }
}

export default new AuthController();
