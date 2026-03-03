import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuth";
import useGetData from "./useGetData";
import { ApiUrl } from "../constants";
import type { LoginResponse } from "../types";

type UseUpdateRefreshProps = {
  isError: boolean;
  keys: string[];
};

const useUpdateRefresh = (props: UseUpdateRefreshProps) => {
  const { isError, keys } = props;
  const login = useAuthStore((state) => state.login);
  const queryClient = useQueryClient();

  const { data, isSuccess } = useGetData<LoginResponse>({
    keys: ["refresh"],
    url: `${ApiUrl}/refresh`,
    enabled: isError,
  });

  useEffect(() => {
    if (!isSuccess) return;
    login(data.accessToken, data.user);
    queryClient.invalidateQueries({
      queryKey: keys,
    });
  }, [data, isSuccess, login, queryClient, keys]);
};

export default useUpdateRefresh;
