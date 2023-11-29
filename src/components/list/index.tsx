import { useState } from "react";
import { useUserRequests } from "../../hooks/useUserData";

export interface IUser {
  id: string | null;
  nome: string;
  telefone: string;
}

export interface IUserResponse {
  content: IUser[];
}

function List() {
  const [getProdutos, setGetProdutos] = useState(false);

  const {
    fetch: { data: users },
    fetchProdutos: { data: produtos },
    create: { createUser },
    delete: { deleteUser },
    update: { updateUser },
  } = useUserRequests({
    fetchProdutos: {
      enabled: getProdutos,
      onSuccess: () => {
        console.log("onSuccess:");
        setGetProdutos(false);
      },
      onError: (e) => {
        console.log("error => ", e);
      },
    },
  });

  function handleCreateUser() {
    const newEmail = new Uint8Array(3 / 2);
    window.crypto.getRandomValues(newEmail);

    const newUser = {
      id: null,
      nome: `Gtec ${new Date().toISOString()}`,
      telefone: "",
      setores: [{ id: "5641aa20-53ba-42d6-84f2-7f65294d19b2" }],
      setorFavorito: { id: "5641aa20-53ba-42d6-84f2-7f65294d19b2" },
      papeis: [{ id: "63073df9-8562-4a68-8c94-c2eb922bdb6f" }],
      credencial: {
        email: `${newEmail
          .toString()
          .replace(",", "")}@aslhjdbckyuwierbcoweb.com`,
        autoridade: "USER",
      },
    } as IUser;

    createUser(newUser);
  }

  function handleClickEdit(user: IUser) {
    const newUser: IUser = {
      ...user,
      nome: `${user.nome} - Edited`,
    };

    updateUser({
      id: newUser.id ?? "",
      data: newUser,
    });
  }

  return (
    <>
      <span className="text-xl font-bold hidden">Users</span>
      <div className="flex gap-6 my-4">
        <ul className="space-y-2 border-r pr-4">
          {users?.content.map((user) => (
            <div key={user.id} className="flex justify-between">
              <li
                className="before:content-['*'] before:mx-1 text-zinc-50 cursor-pointer hover:text-red-400 duration-100"
                onClick={() => deleteUser(user.id ?? "")}
              >
                {user.nome}
              </li>
              <span
                className="ml-5 rounded px-3 bg-blue-800 cursor-pointer hover:bg-blue-900 duration-100 text-white text-sm text-center pt-px"
                onClick={() => handleClickEdit(user)}
              >
                Edit
              </span>
            </div>
          ))}
        </ul>
        <ul className="space-y-2">
          {produtos?.content.map((produto) => (
            <li
              key={produto.id}
              className="before:content-['*'] before:mx-1 text-zinc-50 cursor-pointer hover:text-red-400 duration-100"
            >
              {`${produto.nome}`}
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleCreateUser}
        className="px-6 py-2 bg-orange-600 shadow-md mt-3 rounded-md text-zinc-50"
      >
        Create user
      </button>
      <button
        onClick={() => setGetProdutos(() => true)}
        className="px-6 py-2 bg-purple-800 text-zinc-50 shadow-md mt-3 rounded-md ml-5"
      >
        Fetch products
      </button>
    </>
  );
}

export { List };
