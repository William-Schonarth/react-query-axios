import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { API } from "./axios";
import { AxiosRequestConfig, AxiosResponse } from "axios";

interface IGetPrivateProps extends UseQueryOptions {
  url: string;
  options?: AxiosRequestConfig;
  refetchInterval?: number | false;
  refetchOnMount?: boolean | "always";
  refetchOnReconnect?: boolean | "always";
  onSuccess?: () => void;
  onError?: (e: Error) => void;
}

export interface IGetProps
  extends Omit<IGetPrivateProps, "queryFn" | "queryKey" | "url"> {}

function useGet<T>({
  url,
  options,
  queryKey,
  enabled,
  gcTime,
  refetchInterval,
  refetchIntervalInBackground,
  refetchOnMount,
  refetchOnReconnect,
  retry,
  retryDelay,
  retryOnMount,
  onSuccess,
  onError,
}: IGetPrivateProps) {
  const query = useQuery({
    queryFn: () => API.get<T>(url, options),
    queryKey,
    enabled,
    gcTime,
    refetchInterval,
    refetchIntervalInBackground,
    refetchOnMount,
    refetchOnReconnect,
    retry,
    retryDelay,
    retryOnMount,
  });

  if (
    typeof onSuccess === "function" &&
    query.isSuccess &&
    query.isFetched &&
    !query.isError &&
    enabled
  ) {
    onSuccess();
  }

  if (
    typeof onError === "function" &&
    query.isError &&
    query.isFetched &&
    !query.isSuccess &&
    enabled
  ) {
    onError(query.error);
  }

  return {
    ...query,
    data: query.data?.data,
  };
}

interface IPostPrivateProps<T, R>
  extends Omit<UseMutationOptions, "onSuccess" | "onMutate" | "onError"> {
  url: string;
  options?: AxiosRequestConfig;
  onSuccess?: (e: AxiosResponse<R>) => void;
  onMutate?: (e: T) => void;
  onError?: (e: Error) => void;
}

export interface IPostProps<T, R>
  extends Omit<IPostPrivateProps<T, R>, "mutationFn" | "queryKey" | "url"> {}

function usePost<T, R>({
  url,
  options,
  mutationKey,
  gcTime,
  retry,
  retryDelay,
  onSuccess = () => {},
  onMutate = () => {},
  onError = () => {},
}: IPostPrivateProps<T, R>) {
  const queryClient = useQueryClient();

  function handleSuccess(e: AxiosResponse<R>) {
    onSuccess(e);
    queryClient.invalidateQueries({ queryKey: mutationKey });
  }

  function handleError(e: Error) {
    onError(e);
    console.log("Error response:", e);
  }

  return useMutation({
    mutationFn: (data: T) => API.post<R>(url, data, options),
    mutationKey,
    gcTime,
    retry,
    retryDelay,
    onSuccess: handleSuccess,
    onMutate: onMutate,
    onError: handleError,
  });
}

interface IPutPrivateProps<T, R>
  extends Omit<UseMutationOptions, "onSuccess" | "onMutate" | "onError"> {
  url: string;
  options?: AxiosRequestConfig;
  onSuccess?: (e: AxiosResponse<R>) => void;
  onMutate?: (e: IPutInput<T>) => void;
  onError?: (e: Error) => void;
}

interface IPutInput<T> {
  id?: string;
  data: T;
}

export interface IPutProps<T, R>
  extends Omit<IPutPrivateProps<T, R>, "mutationFn" | "queryKey" | "url"> {}

function usePut<T, R>({
  url,
  options,
  mutationKey,
  gcTime,
  retry,
  retryDelay,
  onSuccess = () => {},
  onMutate = () => {},
  onError = () => {},
}: IPutPrivateProps<T, R>) {
  const queryClient = useQueryClient();

  function handleSuccess(e: AxiosResponse<R>) {
    onSuccess(e);
    queryClient.invalidateQueries({ queryKey: mutationKey });
  }

  function handleError(e: Error) {
    onError(e);
    console.log("Error response:", e);
  }

  return useMutation({
    mutationFn: (input: IPutInput<T>) =>
      API.put<R>(`${url}${input.id && `/${input.id}`}`, input.data, options),
    mutationKey,
    gcTime,
    retry,
    retryDelay,
    onSuccess: handleSuccess,
    onMutate: onMutate,
    onError: handleError,
  });
}

interface IDeletePrivateProps<T>
  extends Omit<UseMutationOptions, "onSuccess" | "onMutate" | "onError"> {
  url: string;
  options?: AxiosRequestConfig;
  onSuccess?: (e: AxiosResponse<T>) => void;
  onMutate?: (e: string) => void;
  onError?: (e: Error) => void;
}

export interface IDeleteProps<T>
  extends Omit<IDeletePrivateProps<T>, "mutationFn" | "queryKey" | "url"> {}

function useDelete<T>({
  url,
  options,
  mutationKey,
  gcTime,
  retry,
  retryDelay,
  onSuccess = () => {},
  onMutate = () => {},
  onError = () => {},
}: IDeletePrivateProps<T>) {
  const queryClient = useQueryClient();

  function handleSuccess(e: AxiosResponse<T>) {
    onSuccess(e);
    queryClient.invalidateQueries({ queryKey: mutationKey });
  }

  function handleError(e: Error) {
    onError(e);
    console.log("Error response:", e);
  }

  return useMutation({
    mutationFn: (id: string) => API.delete<T>(`${url}/${id}`, options),
    mutationKey,
    gcTime,
    retry,
    retryDelay,
    onSuccess: handleSuccess,
    onMutate: onMutate,
    onError: handleError,
  });
}

export { useGet, usePost, usePut, useDelete };
