import React from "react";
import { useQuery } from "@apollo/react-hooks";

import { RouteComponentProps, navigate } from "@reach/router";
import { User } from "../types";
import { LIST_USERS } from "../util";

type ChooseProps = {
  onSelect: (user: User) => void;
};

const ChooseMyself: React.FC<ChooseProps> = ({ onSelect }) => {
  const { loading, error, data } = useQuery(LIST_USERS);

  if (loading) {
    return <div className="p-6 rounded-lg shadow-xl">Loading....</div>;
  }

  if (error) {
    return (
      <div className="p-6 bg-red-200  rounded-lg shadow-xl text-red-900">
        Error: {JSON.stringify(error)}
      </div>
    );
  }
  // console.warn({ data });
  return (
    <div className="p-6 bg-white rounded-lg shadow-xl">
      {data.list_users.map((user: User, userId: number) => (
        <div
          key={userId}
          onClick={() => onSelect(user)}
          className="p-2 border-b last:border-b-0 border-color-gray-700
          hover:bg-gray-200 cursor-pointer"
        >
          {user.firstName}
        </div>
      ))}
    </div>
  );
};

type Props = {
  selectUser: (user: User) => void;
};

const Login: React.FC<RouteComponentProps<Props>> = ({ selectUser }) => {
  // const [currentUser, setCurrentUser] = useLocalStorage('CURRENT_USER', '')

  // console.warn('Login', { props, currentUser })

  const handleSelect = (user: User) => {
    if (selectUser) {
      selectUser(user);
      navigate("/");
    }
  };

  return (
    <div className={"max-w-sm mx-auto p-6"}>
      <ChooseMyself onSelect={handleSelect} />
    </div>
  );
};

export default Login;
