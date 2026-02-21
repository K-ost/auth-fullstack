import { Request, Response } from "express";
import db from "../db/db";

class UsersController {
  async getUsers(req: Request, res: Response) {
    try {
      const users = await db.query("SELECT id, email, name, surname FROM users");
      res.status(200).send({ data: users.rows, count: users.rowCount });
    } catch (error) {
      res.sendStatus(500);
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await db.query(
        "SELECT id, email, name, surname FROM users WHERE id = $1",
        [id],
      );
      if (user.rowCount === 0) {
        return res.status(404).send({ msg: "User doesn't exist" });
      }
      res.status(200).send(user.rows[0]);
    } catch (error) {
      res.sendStatus(500);
    }
  }

  async editUserById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const body = req.body;

      const keys = Object.keys(body)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(", ");
      const values = Object.values(body);

      const editedUser = await db.query(
        `
          UPDATE users
          SET ${keys}
          WHERE id = $1
          RETURNING id, email, name, surname
      `,
        [id, ...values],
      );

      if (editedUser.rowCount === 0) {
        return res.status(404).send({ msg: "User doesn't exist" });
      }

      res.status(200).send(editedUser.rows[0]);
    } catch (error) {
      res.sendStatus(500);
    }
  }

  async deleteUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await db.query("DELETE FROM users WHERE id = $1", [id]);
      if (user.rowCount === 0) {
        return res.status(404).send({ msg: "User doesn't exist" });
      }
      res.status(200).send({ msg: "User has been deleted" });
    } catch (error) {
      res.sendStatus(500);
    }
  }
}

export default new UsersController();
