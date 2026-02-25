import { useMutation } from "@tanstack/react-query";
import { mutateData } from "../api/api";
import type { RestApiMethod } from "../types";

type MutateProps = {
  keys: string[];
  method: RestApiMethod;
  url: string;
};
const useMutateData = <T,>(props: MutateProps) => {
  const { keys, method, url } = props;
  return useMutation({
    mutationFn: (data: T) => mutateData(url, method, JSON.stringify(data)),
    mutationKey: keys,
  });
};

export default useMutateData;
