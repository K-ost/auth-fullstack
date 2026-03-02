import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../api/api";
import type { RestApiMethod } from "../types";

type MutateProps = {
  keys: string[];
  method: RestApiMethod;
  url: string;
};
const useMutateData = <Data, Error, Vars>(props: MutateProps) => {
  const { keys, method, url } = props;
  return useMutation<Data, Error, Vars>({
    mutationFn: (data) => apiRequest<Data, Vars>(url, method, data),
    mutationKey: keys,
    retry: false,
  });
};

export default useMutateData;
