import React, { useState } from "react";
import EntryFeed from "./EntryFeed";
import ChallengeList from "./ChallengeList";
import { MdList } from "react-icons/md";
import { GiTrophy } from "react-icons/gi";

type Props = {
  currentUserId: number;
};
const Dashboard: React.FC<Props> = ({ currentUserId }) => {
  enum DisplayOptions {
    EntryFeed,
    Challenges,
    PersonalProfile,
  }
  const [displayOption, setDisplayOption] = useState(DisplayOptions.Challenges);
  const changeDisplayOption = (option: DisplayOptions) => {
    setDisplayOption(option);
  };
  return (
    <div className={"max-w-md mx-auto p-6"}>
      {displayOption === DisplayOptions.EntryFeed ? (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-4 ml-2 rounded focus:outline-none focus:shadow-outline"
          type="button"
        >
          <MdList />
        </button>
      ) : (
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mb-4 ml-2 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={() => changeDisplayOption(DisplayOptions.EntryFeed)}
        >
          <MdList />
        </button>
      )}
      {displayOption === DisplayOptions.Challenges ? (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-4 ml-2 rounded focus:outline-none focus:shadow-outline"
          type="button"
        >
          <GiTrophy />
        </button>
      ) : (
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mb-4 ml-2 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={() => changeDisplayOption(DisplayOptions.Challenges)}
        >
          <GiTrophy />
        </button>
      )}
      {displayOption === DisplayOptions.EntryFeed ? (
        <EntryFeed currentUserId={currentUserId} />
      ) : null}
      {displayOption === DisplayOptions.Challenges ? (
        <ChallengeList currentUserId={currentUserId} />
      ) : null}
    </div>
  );
};

export default Dashboard;
