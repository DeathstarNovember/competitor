import React, { useState } from "react";
import EntryFeed from "./EntryFeed";
import ChallengeList from "./ChallengeList";
import { MdList } from "react-icons/md";
import { GiTrophy } from "react-icons/gi";
import { User } from "../types";
import { DashboardDisplayOptions } from "../enums";

type Props = {
  currentUser: User;
};
const Dashboard: React.FC<Props> = ({ currentUser }) => {
  const [dashboardDisplayOption, setDashboardDisplayOption] = useState(
    DashboardDisplayOptions.EntryFeed
  );
  const changeDashboardDisplayOption = (option: DashboardDisplayOptions) => {
    setDashboardDisplayOption(option);
  };
  return (
    <div className={"max-w-md mx-auto p-6"}>
      {dashboardDisplayOption === DashboardDisplayOptions.EntryFeed ? (
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
          onClick={() =>
            changeDashboardDisplayOption(DashboardDisplayOptions.EntryFeed)
          }
        >
          <MdList />
        </button>
      )}
      {dashboardDisplayOption === DashboardDisplayOptions.Challenges ? (
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
          onClick={() =>
            changeDashboardDisplayOption(DashboardDisplayOptions.Challenges)
          }
        >
          <GiTrophy />
        </button>
      )}
      {dashboardDisplayOption === DashboardDisplayOptions.EntryFeed ? (
        <EntryFeed
          currentUserId={currentUser.id}
          changeDashboardDisplayOption={changeDashboardDisplayOption}
        />
      ) : null}
      {dashboardDisplayOption === DashboardDisplayOptions.Challenges ? (
        <ChallengeList currentUser={currentUser} />
      ) : null}
    </div>
  );
};

export default Dashboard;
