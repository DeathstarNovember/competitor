import React, { useState } from "react";
import { User, Entry } from "../types";
import GroupedEntryFeed from "./GroupedEntryFeed";
import {
  MdPlaylistAdd,
  MdPeople,
  MdPerson,
  MdStar,
  MdPublic,
} from "react-icons/md";
import StatSummary from "./StatSummary";
import CreateEntry from "./CreateEntry";
import { useQuery } from "@apollo/react-hooks";
import { LIST_USERS } from "../util";

type EntryFeedProps = {
  currentUserId?: number;
  entryList: Entry[];
  toggleCreateEntryForm: () => void;
  displayCreateEntryForm: boolean;
};

const EntryFeed: React.FC<EntryFeedProps> = ({
  currentUserId,
  entryList,
  toggleCreateEntryForm,
  displayCreateEntryForm,
}) => {
  enum DisplayOptions {
    Public,
    Following,
    Personal,
  }
  const [displayOption, setDisplayOption] = useState(DisplayOptions.Public);
  const { data, loading, error } = useQuery(LIST_USERS);
  if (loading) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="p-6 rounded-lg shadow-xl">Loading....</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6 bg-red-200  rounded-lg shadow-xl text-red-900">
        Error: {JSON.stringify(error)}
      </div>
    );
  }
  const currentUser: User = data.listUsers.find(
    (user: User) => user.id === currentUserId
  );
  //sort by lastName, then firstName, then completedAt
  const allEntries: Entry[] = entryList.sort((a: Entry, b: Entry) =>
    a.completedAt < b.completedAt ? 1 : -1
  );
  const myEntries: Entry[] = allEntries.filter(
    (e: Entry) => e.user.id === currentUser.id
  );
  const changeDisplayOption = (option: DisplayOptions) => {
    setDisplayOption(option);
  };
  const myFollowedEntries: Entry[] = allEntries.filter(entry =>
    currentUser.follows.map(follow => follow.id).includes(entry.user.id)
  );
  return (
    <div className="max-w-md mx-auto">
      {myEntries.length ? <StatSummary entries={myEntries} /> : null}
      <div className="w-full max-w-md">
        <div className="flex justify-between">
          <div className="text-xl font-bold">{`${DisplayOptions[displayOption]}`}</div>
          <div>
            <button
              className={`bg-${
                displayCreateEntryForm ? "blue" : "gray"
              }-500 hover:bg-${
                displayCreateEntryForm ? "blue" : "gray"
              }-700 text-white font-bold py-2 px-4 mb-4 ml-2 rounded focus:outline-none focus:shadow-outline`}
              onClick={toggleCreateEntryForm}
            >
              <MdPlaylistAdd />
            </button>
            {displayOption === DisplayOptions.Personal ? (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-4 ml-2 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                <MdPerson />
              </button>
            ) : (
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mb-4 ml-2 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => changeDisplayOption(DisplayOptions.Personal)}
              >
                <MdPerson />
              </button>
            )}
            {displayOption === DisplayOptions.Following ? (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-4 ml-2 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                <MdStar />
              </button>
            ) : (
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mb-4 ml-2 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => changeDisplayOption(DisplayOptions.Following)}
              >
                <MdStar />
              </button>
            )}
            {displayOption === DisplayOptions.Public ? (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-4 ml-2 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                <MdPublic />
              </button>
            ) : (
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mb-4 ml-2 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => changeDisplayOption(DisplayOptions.Public)}
              >
                <MdPublic />
              </button>
            )}
          </div>
        </div>
        {currentUser && displayCreateEntryForm ? (
          <CreateEntry
            currentUser={currentUser}
            toggleDisplayCreateEntryForm={toggleCreateEntryForm}
          />
        ) : null}
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
        {displayOption === DisplayOptions.Following ? (
          <div className="p-6 bg-white rounded-lg shadow-xl">
            {myFollowedEntries.length ? (
              <GroupedEntryFeed
                entries={myFollowedEntries}
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
