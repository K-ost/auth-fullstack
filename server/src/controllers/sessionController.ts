import { Request, Response } from "express";
import db from "../db/db";

class SessionController {
  async getTokens(__: Request, res: Response) {
    try {
      const tokens = await db.query("SELECT * FROM tokens");
      res.send(tokens.rows);
    } catch (error) {
      res.sendStatus(500);
    }
  }

  async clearAllSessions(req: Request, res: Response) {
    try {
      await db.query("DELETE FROM tokens");
      res.status(200).send("All sessions have been deleted");
    } catch (error) {
      res.sendStatus(500);
    }
  }
}

export default new SessionController();
