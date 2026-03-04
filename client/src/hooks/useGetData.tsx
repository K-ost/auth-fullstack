import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../api/api";
import type { ErrorResponse } from "../types";

type UseGetDataProps = {
  keys: string[];
  url: string;
  enabled?: boolean;
  token?: string;
};

const useGetData = <T,>(props: UseGetDataProps) => {
  const { enabled, keys, url } = props;
  return useQuery<T, ErrorResponse>({
    queryKey: keys,
    queryFn: () => apiRequest<T, undefined>(url, "GET"),
    retry: false,
    enabled,
  });
};

export default useGetData;
