import { IUser, IUserResponse } from "../components/list";
import { IGetProps, useDelete, useGet, usePost, usePut } from "../requests";

interface IUserRequestsParams {
  fetchProdutos?: IGetProps;
}

export function useUserRequests({ fetchProdutos }: IUserRequestsParams = {}) {
  function useFetchUsers() {
    return useGet<IUserResponse>({
      url: "/v1/usuarios",
      queryKey: ["users-data"],
    });
  }

  function useGetProdutos() {
    return useGet<IUserResponse>({
      ...fetchProdutos,
      url: "/v1/produtos",
      queryKey: ["prod-data"],
    });
  }

  function useCreateUser() {
    const response = usePost<IUser, IUserResponse>({
      url: "/v1/usuarios",
      mutationKey: ["users-data"],
    });

    return {
      ...response,
      createUser: response.mutate,
    };
  }

  function useDeleteUser() {
    const response = useDelete({
      url: "/v1/usuarios",
      mutationKey: ["users-data"],
    });

    return {
      ...response,
      deleteUser: response.mutate,
    };
  }

  function useUpdateUser() {
    const response = usePut({
      url: "/v1/usuarios",
      mutationKey: ["users-data"],
    });

    return {
      ...response,
      updateUser: response.mutate,
    };
  }

  return {
    fetch: useFetchUsers(),
    fetchProdutos: useGetProdutos(),
    create: useCreateUser(),
    delete: useDeleteUser(),
    update: useUpdateUser(),
  };
}
