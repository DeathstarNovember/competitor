import React from "react";
import { Achievement, User } from "../types";
import { AchievementTypes } from "../enums";
import EntryPreview from "./EntryPreview";

type AchievementTileProps = {
  key?: string;
  achievement: Achievement;
  currentUser: User;
  changeDashboardDisplayOption: (arg0: number) => void;
};

const AchievementTile: React.FC<AchievementTileProps> = ({
  achievement,
  currentUser,
  changeDashboardDisplayOption,
}) => {
  return (
    <EntryPreview
      entry={achievement.entry}
      mine={true}
      currentUser={currentUser}
      changeDashboardDisplayOption={changeDashboardDisplayOption}
    />
  );
};

export default AchievementTile;
