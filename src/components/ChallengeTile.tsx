import React, { useState } from "react";
import { Challenge, User } from "../types";
import { InviteStatus, ResultTypes } from "../enums";
import {
  formatTimeMS,
  CREATE_INVITATION,
  UPDATE_INVITATION,
  LIST_CHALLENGES,
} from "../util";
import CreateEntry from "./CreateEntry";
import { useMutation } from "@apollo/react-hooks";

type ChallengeTileProps = {
  key?: string;
  challenge: Challenge;
  currentUser: User;
};
const ChallengeTile: React.FC<ChallengeTileProps> = ({
  challenge,
  currentUser,
}) => {
  const currentUserId = currentUser.id;
  const iModerate = challenge.moderator.id === currentUserId;
  const myInvitation = challenge.invitations.filter(
    invitation => invitation.invitee.id === currentUserId
  )[0];
  const otherInvitations = challenge.invitations.filter(
    inv => inv.invitee.id !== currentUserId
  );
  const [displaySubmitEntryForm, setDisplaySubmitEntryForm] = useState(false);
  const toggleDisplaySubmitEntryForm = () => {
    setDisplaySubmitEntryForm(!displaySubmitEntryForm);
  };
  const [displayChallengeInviteForm, setDisplayChallengeInviteForm] = useState(
    !Boolean(otherInvitations.length) && iModerate
  );
  const toggleDisplayChallengeInviteForm = () => {
    setDisplayChallengeInviteForm(!displayChallengeInviteForm);
  };

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

  const statusColor = iModerate
    ? "yellow"
    : myInvitation.status === InviteStatus.ACCEPTED
    ? "green"
    : myInvitation.status === InviteStatus.DECLINED
    ? "red"
    : "gray";

  const [createInvitationMutation] = useMutation(CREATE_INVITATION, {
    update(cache, { data: createInvitation }) {
      const cachedData: {
        listChallenges: Challenge[];
      } | null = cache.readQuery({
        query: LIST_CHALLENGES,
      });
      // console.warn({ cachedData }, { createEntry });
      if (cachedData) {
        cache.writeQuery({
          query: LIST_CHALLENGES,
          data: {
            listChallenges: [
              ...cachedData.listChallenges.filter(ch => ch.id !== challenge.id),
              {
                ...challenge,
                invitations: [...challenge.invitations, createInvitation],
              },
            ],
          },
        });
      }
    },
  });
  const createInvitation = async (inviteeId: number) => {
    try {
      const result = await createInvitationMutation({
        variables: {
          status: InviteStatus.PENDING,
          inviteeId,
          challengeId: challenge.id,
        },
      });
      toggleDisplayChallengeInviteForm();
      console.warn({ challengeInviteResult: { result } });
    } catch (err) {
      console.warn({ challengeInviteError: { err } });
    }
  };
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
          {myInvitation.response ? (
            <div>
              {iModerate ? "You challenged with " : "You responded with "}
              {formatTimeMS(myInvitation.response.time)}
            </div>
          ) : (
            <button
              onClick={toggleDisplaySubmitEntryForm}
              className={`bg-green-500 rounded py-1 px-2`}
            >
              submit
            </button>
          )}
        </div>
        {iModerate ? (
          <div className="font-semibold text-sm">
            {otherInvitations.length ? (
              <div>
                {otherInvitations.map(inv => (
                  <div key={`${challenge.id}${inv.id}`}>
                    {inv.invitee.firstName +
                      " (" +
                      InviteStatus[inv.status].toLowerCase() +
                      ") "}
                    {inv.status === InviteStatus.ACCEPTED
                      ? formatTimeMS(inv.response.time)
                      : null}
                  </div>
                ))}
              </div>
            ) : displayChallengeInviteForm ? (
              <div>
                {currentUser.follows.map(userFollow => (
                  <button
                    className="bg-blue-500 rounded py-1 px-2 m-1"
                    onClick={() => createInvitation(userFollow.id)}
                  >
                    Challenge {userFollow.firstName} {userFollow.lastName}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="font-semibold text-sm">
            {challenge.moderator.firstName +
              " challenged you with " +
              formatTimeMS(otherInvitations[0].response.time)}
          </div>
        )}
        {displaySubmitEntryForm ? (
          <div>
            <CreateEntry
              invitation={myInvitation}
              updateInvitation={updateInvitation}
              currentUserId={currentUserId}
              toggleDisplayCreateEntryForm={toggleDisplaySubmitEntryForm}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ChallengeTile;
