import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore, useToken } from "../store/useAuth";
import useGetData from "./useGetData";
import { ApiUrl } from "../constants";
import type { LoginResponse } from "../types";

type UseUpdateRefreshProps = {
  keys: string[];
  url: string;
};

const useUpdateRefresh = <T,>(props: UseUpdateRefreshProps) => {
  const { keys, url } = props;
  const login = useAuthStore((state) => state.login);
  const accessToken = useToken();
  const queryClient = useQueryClient();

  const { data, isSuccess, isError } = useGetData<T>({
    keys: keys,
    url: url,
    token: accessToken ?? undefined,
  });

  const { data: refreshData, isSuccess: isSuccessRefresh } = useGetData<LoginResponse>({
    keys: ["refresh"],
    url: `${ApiUrl}/refresh`,
    enabled: isError,
  });

  useEffect(() => {
    if (!isSuccessRefresh) return;
    login(refreshData.accessToken, refreshData.user);
    queryClient.invalidateQueries({
      queryKey: ["users"],
    });
  }, [isError, isSuccessRefresh, login, refreshData, queryClient]);

  return { data, isSuccess };
};

export default useUpdateRefresh;
