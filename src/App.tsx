import React, { useState } from "react";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { ApolloProvider } from "@apollo/react-hooks";
import { ThemeProvider } from "styled-components";
import { theme } from "./ui";
import Login from "./components/Login";
import UpdateUser from "./components/UpdateUser";
import Dashboard from "./components/Dashboard";
import { User } from "./types";
// const uri = "http://localhost:4000/api";
const uri = "https://competition-prod.herokuapp.com/api";
const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    new HttpLink({
      uri,
    }),
  ]),
  cache: new InMemoryCache(),
});

type AppBarProps = {
  currentUser: any;
  onSignOut: VoidFunction;
  toggleDisplayUpdateUser: VoidFunction;
};

const AppBar: React.FC<AppBarProps> = ({
  currentUser,
  onSignOut,
  toggleDisplayUpdateUser,
}) => {
  return (
    <div className="py-2 px-3 bg-gray-500 flex justify-between shadow-md text-gray-700">
      <div className="flex">
        {currentUser ? (
          <>
            <div className="text-gray-200 pr-2">Signed in as:</div>
            <div className="cursor-pointer" onClick={toggleDisplayUpdateUser}>
              {currentUser.firstName} {currentUser.lastName}
            </div>
          </>
        ) : (
          "Not signed in"
        )}
      </div>
      {currentUser ? (
        <div
          className="cursor-pointer uppercase font-semibold tracking-wide hover:text-gray-800"
          onClick={onSignOut}
        >
          Sign Out
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | "">("");
  const localUser = window.localStorage.getItem("currentUser");

  const handleSignIn = (user: User) => {
    setCurrentUser(user);
  };
  if (localUser && !currentUser) {
    setCurrentUser(JSON.parse(localUser));
  }
  const handleSignOut = () => {
    window.localStorage.removeItem("currentUser");
    setCurrentUser("");
  };
  const [displayUpdateUser, setDisplayUpdateUser] = useState(false);
  const toggleDisplayUpdateUser = () => {
    setDisplayUpdateUser(!displayUpdateUser);
  };

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <div className="min-h-screen bg-gray-200">
          <AppBar
            currentUser={currentUser}
            onSignOut={handleSignOut}
            toggleDisplayUpdateUser={toggleDisplayUpdateUser}
          />
          {currentUser ? (
            displayUpdateUser ? (
              <UpdateUser
                userId={currentUser.id}
                currentUser={currentUser}
                updateCurrentUser={handleSignIn}
                setDisplay={setDisplayUpdateUser}
              />
            ) : (
              <Dashboard currentUser={currentUser} />
            )
          ) : (
            <Login selectUser={handleSignIn} />
          )}
        </div>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
