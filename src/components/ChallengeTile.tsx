import React, { useState } from "react";
import { Challenge } from "../types";
import { InviteStatus, ResultTypes } from "../enums";
import { formatTimeMS, UPDATE_INVITATION } from "../util";
import CreateEntry from "./CreateEntry";
import { useMutation } from "@apollo/react-hooks";

type ChallengeTileProps = {
  key?: string;
  challenge: Challenge;
  currentUserId: number;
};
const ChallengeTile: React.FC<ChallengeTileProps> = ({
  challenge,
  currentUserId,
}) => {
  const [displaySubmitEntryForm, setDisplaySubmitEntryForm] = useState(false);
  const toggleDisplaySubmitEntryForm = () => {
    setDisplaySubmitEntryForm(!displaySubmitEntryForm);
  };
  const myInvitation = challenge.invitations.filter(
    invitation => invitation.invitee.id === currentUserId
  )[0];
  const otherInvitations = challenge.invitations.filter(
    inv => inv.invitee.id !== currentUserId
  );
  const getChallengeHeadline = () => {
    const resultType = ResultTypes[
      challenge.objective.resultType
    ].toLowerCase();
    const value = challenge.objective.value;
    switch (resultType) {
      case "distance":
        return `${formatTimeMS(value)} for distance`;
      case "time":
        return `${value}m for time`;
      default:
        return "";
    }
  };
  const iModerate = challenge.moderator.id === currentUserId;
  const statusColor = iModerate
    ? "yellow"
    : myInvitation.status === InviteStatus.ACCEPTED
    ? "green"
    : myInvitation.status === InviteStatus.DECLINED
    ? "red"
    : "gray";
  const [updateInvitationMutation] = useMutation(UPDATE_INVITATION);
  const updateInvitation = async (responseId: number) => {
    try {
      const result = await updateInvitationMutation({
        variables: {
          id: myInvitation.id,
          status: InviteStatus.ACCEPTED,
          inviteeId: currentUserId,
          challengeId: challenge.id,
          responseId,
        },
      });
      toggleDisplaySubmitEntryForm();
      console.warn({ result });
    } catch (err) {
      console.warn({ err });
    }
  };
  return (
    <div
      className={`flex flex-1 justify-between bg-${statusColor}-300 rounded p-2 my-1`}
    >
      <div>
        <div>
          <div className="font-bold text-lg">{getChallengeHeadline()}</div>
          {iModerate ? (
            <div className="font-semibold text-sm">
              <div>You challenged</div>
              {otherInvitations.map(inv => (
                <div key={`${challenge.id}${inv.id}`}>
                  {inv.invitee.firstName +
                    " (" +
                    InviteStatus[inv.status].toLowerCase() +
                    ")"}
                </div>
              ))}
            </div>
          ) : (
            <div className="font-semibold text-sm">
              {challenge.moderator.firstName + " challenged you"}
            </div>
          )}
          {!iModerate ? (
            <button className={`bg-${statusColor}-500 rounded py-1 px-2`}>
              {String(InviteStatus[myInvitation.status]).toLowerCase()}
            </button>
          ) : (
            <button
              onClick={toggleDisplaySubmitEntryForm}
              className={`bg-green-500 rounded py-1 px-2`}
            >
              submit
            </button>
          )}
        </div>
        {displaySubmitEntryForm ? (
          <div>
            <CreateEntry
              updateInvitation={updateInvitation}
              currentUser={myInvitation.invitee}
              toggleDisplayCreateEntryForm={toggleDisplaySubmitEntryForm}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ChallengeTile;
