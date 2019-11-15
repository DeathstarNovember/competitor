import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { LIST_CHALLENGES } from "../util";
import { Challenge } from "../types";
import ChallengeTile from "./ChallengeTile";

type ChallengeListProps = {
  currentUserId: number;
};
const ChallengeList: React.FC<ChallengeListProps> = ({ currentUserId }) => {
  const {
    data: challengesData,
    loading: challengesLoading,
    error: challengesError,
  } = useQuery(LIST_CHALLENGES);
  const [displayCreateChallengeForm, setDisplayCreateChallengeForm] = useState(
    false
  );
  const toggleCreateChallengeForm = () => {
    setDisplayCreateChallengeForm(!displayCreateChallengeForm);
  };
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
  const challenges: Challenge[] = [...challengesData.listChallenges];
  const myChallenges: Challenge[] = challenges.filter(challenge =>
    challenge.invitations.some(
      invitation => invitation.invitee.id === currentUserId
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
              currentUserId={currentUserId}
            />
          ))
        : "No Challenge Invites Yet..."}
    </div>
  );
};

export default ChallengeList;
