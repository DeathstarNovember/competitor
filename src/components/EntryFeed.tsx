import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { User, Entry } from "../types";
import UserEntryFeed from "./UserEntryFeed";
import PublicEntryFeed from "./PublicEntryFeed";
import { LIST_ENTRIES } from "../util";

type EntryFeedProps = {
  currentUser?: User;
};

const EntryFeed: React.FC<EntryFeedProps> = ({ currentUser }) => {
  const { loading, error, data } = useQuery(LIST_ENTRIES);
  enum DisplayOptions {
    Public,
    Personal,
  }
  const [displayOption, setDisplayOption] = useState(DisplayOptions.Public);
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
  const entryList =
    displayOption === DisplayOptions.Personal ? myEntries : allEntries;
  const groupEntries = () => {
    const groupedEntries: Entry[][] = [];
    entryList
      .map(e => e.user.id)
      .filter((v, i, a) => a.indexOf(v) === i)
      .forEach(userId =>
        groupedEntries.push(entryList.filter(e => e.user.id === userId))
      );
    return groupedEntries;
  };
  const groupedEntries = groupEntries();
  const changeDisplayOption = (option: DisplayOptions) => {
    setDisplayOption(option);
  };
  return (
    <div className={"max-w-md mx-auto p-6"}>
      <div className="w-full max-w-md">
        <div className="flex justify-between">
          <div className="text-xl font-bold">{`${DisplayOptions[displayOption]} Feed`}</div>
          <div>
            {displayOption !== DisplayOptions.Personal ? (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => changeDisplayOption(DisplayOptions.Personal)}
              >
                See Personal Feed
              </button>
            ) : null}
            {displayOption !== DisplayOptions.Public && currentUser ? (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => changeDisplayOption(DisplayOptions.Public)}
              >
                See Public Feed
              </button>
            ) : null}
          </div>
        </div>
        {displayOption === DisplayOptions.Personal ? (
          <div className="p-6 bg-white rounded-lg shadow-xl">
            {groupedEntries.map((entryGroup, entryGroupId) => (
              <UserEntryFeed
                key={`${entryGroupId}${displayOption}`}
                entries={entryGroup}
              />
            ))}
          </div>
        ) : null}
        {displayOption === DisplayOptions.Public ? (
          <div className="p-6 bg-white rounded-lg shadow-xl">
            <PublicEntryFeed entries={allEntries} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EntryFeed;
