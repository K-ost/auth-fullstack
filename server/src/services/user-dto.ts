import { User } from "../types";

class UserDto {
  id: number;
  email: string;
  name: string;
  constructor(obj: User) {
    this.id = obj.id;
    this.email = obj.email;
    this.name = obj.name;
  }
}

export default UserDto;
