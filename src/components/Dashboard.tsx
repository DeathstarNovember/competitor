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
  const entries: Entry[] = [...data.listEntries];
  //sort by lastName, then firstName, then completedAt
  const allEntries: Entry[] = entries.sort((a: Entry, b: Entry) =>
    a.completedAt < b.completedAt ? 1 : -1
  );
  const myEntries: Entry[] = currentUser
    ? data.listEntries.filter((e: Entry) => e.user.id === currentUser.id)
    : undefined;

  return (
    <div className={"p-6"}>
      {myEntries.length ? <StatSummary entries={myEntries} /> : null}
      {currentUser ? <CreateEntry currentUser={currentUser} /> : null}
      {allEntries.length ? (
        <EntryFeed currentUser={currentUser} entryList={allEntries} />
      ) : null}
    </div>
  );
};

export default Dashboard;
