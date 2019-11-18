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
import { IntrospectionFragmentMatcher } from "apollo-cache-inmemory";
import introspectionQueryResultData from "./fragmentTypes.json";

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});
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
  cache: new InMemoryCache({ fragmentMatcher }),
});

type AppBarProps = {
  currentUser?: User;
  onSignOut: VoidFunction;
  toggleDisplayUpdateUserForm: VoidFunction;
};

const AppBar: React.FC<AppBarProps> = ({
  currentUser,
  onSignOut,
  toggleDisplayUpdateUserForm,
}) => {
  return (
    <div className="py-2 px-3 bg-gray-500 flex justify-between shadow-md text-gray-700">
      <div className="flex">
        {currentUser ? (
          <>
            <div className="text-gray-200 pr-2">Signed in as:</div>
            <div
              className="cursor-pointer"
              onClick={toggleDisplayUpdateUserForm}
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

export const setLocalUser = (user: User) => {
  window.localStorage.setItem("currentUser", JSON.stringify(user));
};
export const removeLocalUser = () => {
  window.localStorage.removeItem("currentUser");
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const localUser = window.localStorage.getItem("currentUser");
  if (localUser && !currentUser) {
    setCurrentUser(JSON.parse(localUser));
  }
  const handleSignIn = (user: User) => {
    setLocalUser(user);
    setCurrentUser(user);
  };
  const handleSignOut = () => {
    removeLocalUser();
    setCurrentUser(undefined);
  };
  const [displayUpdateUserForm, setDisplayUpdateUserForm] = useState(false);
  const toggleDisplayUpdateUserForm = () => {
    setDisplayUpdateUserForm(!displayUpdateUserForm);
  };

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <div className="min-h-screen bg-gray-200">
          <AppBar
            currentUser={currentUser}
            onSignOut={handleSignOut}
            toggleDisplayUpdateUserForm={toggleDisplayUpdateUserForm}
          />
          {currentUser ? (
            displayUpdateUserForm ? (
              <UpdateUser
                userId={currentUser.id}
                currentUserId={currentUser.id}
                updateCurrentUser={handleSignIn}
                setDisplay={setDisplayUpdateUserForm}
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
