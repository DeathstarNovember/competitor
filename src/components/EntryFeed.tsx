import React, { useState } from "react";
import { User, Entry } from "../types";
import UserEntryFeed from "./UserEntryFeed";
import PublicEntryFeed from "./PublicEntryFeed";

type EntryFeedProps = {
  currentUser?: User;
  entryList: Entry[];
};

const EntryFeed: React.FC<EntryFeedProps> = ({ currentUser, entryList }) => {
  enum DisplayOptions {
    Public,
    Personal,
  }
  const [displayOption, setDisplayOption] = useState(DisplayOptions.Public);

  //sort by lastName, then firstName, then completedAt
  const allEntries: Entry[] = entryList.sort((a: Entry, b: Entry) =>
    a.completedAt < b.completedAt ? 1 : -1
  );
  const myEntries: Entry[] = currentUser
    ? entryList.filter((e: Entry) => e.user.id === currentUser.id)
    : [];
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
            <UserEntryFeed entries={myEntries} />
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
