import type { JSX } from "react";
import Button from "../ui/Button";
import useMutateData from "../hooks/useMutateData";
import { ApiUrl } from "../constants";
import { useAuthStore } from "../store/useAuth";

const UserScreen = (): JSX.Element => {
  const logout = useAuthStore((state) => state.logout);

  const { mutate } = useMutateData({
    keys: ["logout"],
    method: "POST",
    url: `${ApiUrl}/logout`,
  });

  const logoutHandler = () => {
    logout();
    mutate(undefined, {
      onError(error) {
        console.log(error);
      },
      onSuccess(data) {
        console.log(data);
      },
    });
  };

  return (
    <div>
      User list <Button onClick={logoutHandler}>Logout</Button>
    </div>
  );
};

export default UserScreen;
