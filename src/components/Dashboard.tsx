import React, { useState } from "react";
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
  const [displayCreateEntryForm, setDisplayCreateEntryForm] = useState(false);
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

  return (
    <div className={"max-w-md mx-auto p-6"}>
      <div>
        <button
          className={`bg-${
            displayCreateEntryForm ? "gray" : "blue"
          }-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
          onClick={() => setDisplayCreateEntryForm(!displayCreateEntryForm)}
        >
          Log Entry
        </button>
      </div>
      {currentUser && displayCreateEntryForm ? (
        <CreateEntry
          currentUser={currentUser}
          setDisplayCreateEntryForm={setDisplayCreateEntryForm}
        />
      ) : null}
      {allEntries.length ? (
        <EntryFeed currentUser={currentUser} entryList={allEntries} />
      ) : null}
    </div>
  );
};

export default Dashboard;
