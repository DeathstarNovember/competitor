import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { LIST_CHALLENGES } from "../util";
import { Challenge, User } from "../types";
import ChallengeTile from "./ChallengeTile";

type ChallengeListProps = {
  currentUser: User;
};
const ChallengeList: React.FC<ChallengeListProps> = ({ currentUser }) => {
  const {
    data: challengesData,
    loading: challengesLoading,
    error: challengesError,
  } = useQuery(LIST_CHALLENGES);
  if (challengesLoading) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="p-6 rounded-lg shadow-xl">Challenges Loading....</div>
      </div>
    );
  }
  if (challengesError) {
    return (
      <div className="p-6 bg-red-200  rounded-lg shadow-xl text-red-900">
        Error: {JSON.stringify(challengesError)}
      </div>
    );
  }
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
