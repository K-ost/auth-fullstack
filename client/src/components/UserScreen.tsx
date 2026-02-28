import type { JSX } from "react";
import Button from "../ui/Button";
import useMutateData from "../hooks/useMutateData";
import { ApiUrl } from "../constants";
import { useAuthStore, useAuthUser, useToken } from "../store/useAuth";
import type { AuthResponse, ErrorResponse } from "../types";
import useGetData from "../hooks/useGetData";

const UserScreen = (): JSX.Element => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthUser();
  const accessToken = useToken();

  const { mutate, isPending } = useMutateData<AuthResponse, ErrorResponse, undefined>({
    keys: ["logout"],
    method: "POST",
    url: `${ApiUrl}/logout`,
  });

  const { data } = useGetData({
    keys: ["users"],
    url: `${ApiUrl}/users`,
    token: accessToken ?? undefined,
  });

  const logoutHandler = () => {
    mutate(undefined, {
      onSuccess() {
        logout();
      },
    });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-b-gray-300">
        <h1 className="mb-4 text-2xl">
          User: {user?.name} ({user?.email})
        </h1>
        <div>
          <Button onClick={logoutHandler}>{isPending ? "Loading..." : "Logout"}</Button>
        </div>
      </div>
      <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default UserScreen;
