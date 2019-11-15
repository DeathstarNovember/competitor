import React, { useState } from "react";
import { User, Entry } from "../types";
import GroupedEntryFeed from "./GroupedEntryFeed";
import { MdPlaylistAdd, MdPerson, MdStar, MdPublic } from "react-icons/md";
import StatSummary from "./StatSummary";
import CreateEntry from "./CreateEntry";
import { useQuery } from "@apollo/react-hooks";
import { LIST_USERS, LIST_ENTRIES } from "../util";

type EntryFeedProps = {
  changeDashboardDisplayOption: (arg0: number) => void;
  currentUserId?: number;
};

const EntryFeed: React.FC<EntryFeedProps> = ({
  currentUserId,
  changeDashboardDisplayOption,
}) => {
  enum DisplayOptions {
    Public,
    Following,
    Personal,
  }
  const [displayOption, setDisplayOption] = useState(DisplayOptions.Public);
  const [displayCreateEntryForm, setDisplayCreateEntryForm] = useState(false);
  const {
    loading: entriesLoading,
    error: entriesError,
    data: entriesData,
  } = useQuery(LIST_ENTRIES, {
    pollInterval: 30 * 1000,
  });
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery(LIST_USERS);
  const toggleCreateEntryForm = () => {
    setDisplayCreateEntryForm(!displayCreateEntryForm);
  };
  if (entriesLoading) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="p-6 rounded-lg shadow-xl">Entries Loading....</div>
      </div>
    );
  }
  if (entriesError) {
    return (
      <div className="p-6 bg-red-200  rounded-lg shadow-xl text-red-900">
        Error: {JSON.stringify(entriesError)}
      </div>
    );
  }
  if (usersLoading) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="p-6 rounded-lg shadow-xl">Users Loading....</div>
      </div>
    );
  }
  if (usersError) {
    return (
      <div className="p-6 bg-red-200  rounded-lg shadow-xl text-red-900">
        Error: {JSON.stringify(usersError)}
      </div>
    );
  }
  const entries: Entry[] = [...entriesData.listEntries];
  //sort by lastName, then firstName, then completedAt
  const allEntries: Entry[] = entries.sort((a: Entry, b: Entry) =>
    a.completedAt < b.completedAt ? 1 : -1
  );
  const currentUser: User = usersData.listUsers.find(
    (user: User) => user.id === currentUserId
  );
  //sort by lastName, then firstName, then completedAt
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
            currentUserId={currentUser.id}
            toggleDisplayCreateEntryForm={toggleCreateEntryForm}
          />
        ) : null}
        {displayOption === DisplayOptions.Personal ? (
          <div className="p-6 bg-white rounded-lg shadow-xl">
            {myEntries.length ? (
              <GroupedEntryFeed
                entries={myEntries}
                currentUser={currentUser}
                changeDashboardDisplayOption={changeDashboardDisplayOption}
              />
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
                changeDashboardDisplayOption={changeDashboardDisplayOption}
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
                changeDashboardDisplayOption={changeDashboardDisplayOption}
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
