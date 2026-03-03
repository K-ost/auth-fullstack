import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuth";
import useGetData from "./useGetData";
import { ApiUrl } from "../constants";
import type { LoginResponse } from "../types";

type UseUpdateRefreshProps = {
  keys: string[];
};

const useUpdateRefresh = <T,>(props: UseUpdateRefreshProps) => {
  const { keys } = props;
  const login = useAuthStore((state) => state.login);
  const queryClient = useQueryClient();

  const { data, isSuccess, isError } = useGetData<T>({
    keys,
    url: `${ApiUrl}/users`,
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
      queryKey: keys,
    });
  }, [refreshData, isSuccessRefresh, login, queryClient, keys]);

  return { data, isSuccess };
};

export default useUpdateRefresh;
