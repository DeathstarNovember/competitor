import React, { useState } from "react";
import { User, Entry } from "../types";
import GroupedEntryFeed from "./GroupedEntryFeed";
import { MdSwapHoriz, MdPlaylistAdd } from "react-icons/md";
import StatSummary from "./StatSummary";
import CreateEntry from "./CreateEntry";

type EntryFeedProps = {
  currentUser?: User;
  entryList: Entry[];
  toggleCreateEntryForm: () => void;
  displayCreateEntryForm: boolean;
};

const EntryFeed: React.FC<EntryFeedProps> = ({
  currentUser,
  entryList,
  toggleCreateEntryForm,
  displayCreateEntryForm,
}) => {
  enum DisplayOptions {
    Public,
    Personal,
  }
  const [displayOption, setDisplayOption] = useState(DisplayOptions.Personal);

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
    <div className="max-w-md mx-auto">
      {myEntries.length ? <StatSummary entries={myEntries} /> : null}
      <button
        className={`bg-${
          displayCreateEntryForm ? "gray" : "blue"
        }-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
        onClick={toggleCreateEntryForm}
      >
        <MdPlaylistAdd />
      </button>
      <div className="w-full max-w-md">
        {currentUser && displayCreateEntryForm ? (
          <CreateEntry
            currentUser={currentUser}
            toggleDisplayCreateEntryForm={toggleCreateEntryForm}
          />
        ) : null}
        <div className="flex justify-between">
          <div className="text-xl font-bold">{`${DisplayOptions[displayOption]} Feed`}</div>
          <div>
            {displayOption !== DisplayOptions.Personal ? (
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mb-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => changeDisplayOption(DisplayOptions.Personal)}
              >
                <MdSwapHoriz />
              </button>
            ) : null}
            {displayOption !== DisplayOptions.Public && currentUser ? (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => changeDisplayOption(DisplayOptions.Public)}
              >
                <MdSwapHoriz />
              </button>
            ) : null}
          </div>
        </div>
        {displayOption === DisplayOptions.Personal ? (
          <div className="p-6 bg-white rounded-lg shadow-xl">
            {myEntries.length ? (
              <GroupedEntryFeed entries={myEntries} currentUser={currentUser} />
            ) : (
              <div className="text-lg">No entries yet...</div>
            )}
          </div>
        ) : null}
        {displayOption === DisplayOptions.Public ? (
          <div className="p-6 bg-white rounded-lg shadow-xl">
            {allEntries.length ? (
              <GroupedEntryFeed
                entries={allEntries}
                currentUser={currentUser}
              />
            ) : (
              <div className="text-lg">No entries yet...</div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EntryFeed;
