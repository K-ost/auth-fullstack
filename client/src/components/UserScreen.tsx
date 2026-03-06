import { type JSX } from "react";
import Button from "../ui/Button";
import { ApiUrl } from "../constants";
import { useAuthStore, useAuthUser } from "../store/useAuth";
import type { AuthResponse, ErrorResponse, UsersReponse } from "../types";
import useUpdateRefresh from "../hooks/useUpdateRefresh";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../api/api";

const requestKeys: string[] = ["users"];

const UserScreen = (): JSX.Element => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthUser();

  const { mutate, isPending } = useMutation<AuthResponse, ErrorResponse, undefined>({
    mutationKey: ["logout"],
    mutationFn: () => apiRequest(`${ApiUrl}/logout`, "POST"),
  });

  const { data, isSuccess } = useUpdateRefresh<UsersReponse>({
    keys: requestKeys,
    url: `${ApiUrl}/users`,
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

      {isSuccess && <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default UserScreen;
