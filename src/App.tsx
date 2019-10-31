import React, { useEffect } from "react";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { ApolloProvider } from "@apollo/react-hooks";
import { ThemeProvider } from "styled-components";
import { theme } from "./ui";
import Login from "./components/Login";
import { default as UpdateUserProfile } from "./components/UpdateUser";
import { Router, navigate } from "@reach/router";

import { useLocalStorage } from "./hooks";
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
};

const AppBar: React.FC<AppBarProps> = ({ currentUser, onSignOut }) => {
  return (
    <div className="py-2 px-3 bg-gray-500 flex justify-between shadow-md text-gray-700">
      <div className="flex">
        {currentUser ? (
          <>
            <div className="text-gray-200 pr-2">Signed in as:</div>
            <div
              className="cursor-pointer"
              onClick={() => navigate("update_profile")}
            >
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
  const [user, setCurrentUser] = useLocalStorage("CURRENT_USER", "");
  const currentUser: User | "" = user;
  const handleSignOut = () => {
    setCurrentUser("");
  };

  // console.warn("App", { currentUser });

  useEffect(() => {
    if (currentUser === "") {
      navigate("login");
    }
  }, [currentUser]);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <div className="min-h-screen bg-gray-200">
          <AppBar currentUser={currentUser} onSignOut={handleSignOut} />
          <Router>
            <Login path="login" selectUser={setCurrentUser} />
            {currentUser ? (
              <Dashboard path="/" currentUser={currentUser} />
            ) : null}
            {currentUser ? (
              <UpdateUserProfile path="update_profile" user={currentUser} />
            ) : null}
          </Router>
        </div>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
