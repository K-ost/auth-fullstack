import { useQuery } from "@tanstack/react-query";
import { getData } from "../api/api";

type UseGetDataProps = {
  keys: string[];
  url: string;
  token?: string;
};

const useGetData = <T,>(props: UseGetDataProps) => {
  const { keys, url, token } = props;
  return useQuery({
    queryKey: keys,
    queryFn: () => getData<T>(url, token),
    retry: false,
  });
};

export default useGetData;
