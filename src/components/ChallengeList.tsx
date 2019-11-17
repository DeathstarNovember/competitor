import React from "react";
import { Challenge, User } from "../types";
import ChallengeTile from "./ChallengeTile";

type ChallengeListProps = {
  challengesData: { listChallenges: Challenge[] };
  currentUser: User;
};
const ChallengeList: React.FC<ChallengeListProps> = ({
  currentUser,
  challengesData,
}) => {
  // console.warn({ challengesData });
  const challenges: Challenge[] = [...challengesData.listChallenges].reverse();
  const myChallenges: Challenge[] = challenges.filter(challenge =>
    challenge.invitations.some(
      invitation => invitation.invitee.id === currentUser.id
    )
  );
  return (
    <div>
      <div>My Challenges</div>
      {myChallenges.length
        ? myChallenges.map(challenge => (
            <ChallengeTile
              key={`challengeTile${challenge.id}`}
              challenge={challenge}
              currentUser={currentUser}
            />
          ))
        : "No Challenge Invites Yet..."}
    </div>
  );
};

export default ChallengeList;
