import { User } from "../types";

class UserDto {
  id: number;
  email: string;
  constructor(obj: User) {
    this.id = obj.id;
    this.email = obj.email;
  }
}

export default UserDto;
