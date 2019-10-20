import React from "react";
import { Entry, User } from "../types";
import { RouteComponentProps } from "@reach/router";
import EntryFeed from "./EntryFeed";

import CreateEntry from "./CreateEntry";

type Props = {
  currentUser: User;
  entries: Entry[];
};

const Dashboard: React.FC<RouteComponentProps<Props>> = ({ currentUser }) => {
  return (
    <div className={"p-6"}>
      <CreateEntry currentUser={currentUser} />
      <EntryFeed currentUser={currentUser} />
    </div>
  );
};

export default Dashboard;
