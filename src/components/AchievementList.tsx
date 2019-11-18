import React from "react";
import { User, Achievement } from "../types";
import AchievementTile from "./AchievementTile";

type AchievementListProps = {
  achievementsData: { listAchievements: Achievement[] };
  currentUser: User;
  changeDashboardDisplayOption: (arg0: number) => void;
};
const AchievementList: React.FC<AchievementListProps> = ({
  currentUser,
  achievementsData,
  changeDashboardDisplayOption,
}) => {
  const achievements: Achievement[] = [
    ...achievementsData.listAchievements,
  ].reverse();
  const myAchievements: Achievement[] = achievements.filter(
    achievement => achievement.user.id === currentUser.id
  );
  return (
    <div>
      <div>My Achievements</div>
      {myAchievements.length
        ? myAchievements.map(achievement => (
            <AchievementTile
              key={`achievementTile${achievement.id}`}
              achievement={achievement}
              currentUser={currentUser}
              changeDashboardDisplayOption={changeDashboardDisplayOption}
            />
          ))
        : "No Achievements Yet..."}
    </div>
  );
};

export default AchievementList;
