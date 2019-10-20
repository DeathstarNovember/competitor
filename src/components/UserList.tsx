import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

const LIST_USERS = gql`
  {
    list_users {
      id
      firstName
      lastName
      email
      warCry
    }
  }
`;

const UserList = () => {
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
  return (
    <div>
      {data.list_users.map((user: any, userId: number) => (
        <div key={userId}>{user.firstName}</div>
      ))}
    </div>
  );
};

export default UserList;
