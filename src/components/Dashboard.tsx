import React from "react";
import { Entry, User } from "../types";
import { RouteComponentProps } from "@reach/router";
import EntryFeed from "./EntryFeed";
import CreateEntry from "./CreateEntry";
import StatSummary from "./StatSummary";
import { useQuery } from "@apollo/react-hooks";
import { LIST_ENTRIES } from "../util";
type Props = {
  currentUser: User;
  entries: Entry[];
};
const Dashboard: React.FC<RouteComponentProps<Props>> = ({ currentUser }) => {
  const { loading, error, data } = useQuery(LIST_ENTRIES);
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
  if (!data.listEntries.length) {
    return (
      <div className={"max-w-md mx-auto p-6"}>
        <div className="w-full max-w-md">
          <div className="p-6 bg-white rounded-lg shadow-xl ">
            No entries yet...
          </div>
        </div>
      </div>
    );
  }
  //sort by lastName, then firstName, then completedAt
  const allEntries: Entry[] = data.listEntries.sort((a: Entry, b: Entry) =>
    a.completedAt < b.completedAt ? 1 : -1
  );
  const myEntries: Entry[] = currentUser
    ? data.listEntries.filter((e: Entry) => e.user.id === currentUser.id)
    : undefined;

  return (
    <div className={"p-6"}>
      <StatSummary entries={myEntries} />
      <CreateEntry currentUser={currentUser} />
      <EntryFeed currentUser={currentUser} entryList={allEntries} />
    </div>
  );
};

export default Dashboard;
