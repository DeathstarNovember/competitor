import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import {
  formatTimeMS,
  entryCalculations,
  LIST_ENTRIES,
  LIKE_ENTRY,
  DELETE_ENTRY,
  UNLIKE_ENTRY,
  LIST_CHALLENGES,
} from "../util";
import { Entry, User, Like, Challenge, ChallengeObjective } from "../types";
import { MdEdit, MdFunctions, MdAccessTime, MdThumbUp } from "react-icons/md";
import { EntryCalculations } from "../util/calculations";
import UpdateEntry from "./UpdateEntry";
import EntryComments from "./EntryComments";
import { format, addDays } from "date-fns";
import { ExecutionResult } from "graphql";
import {
  CREATE_CHALLENGE,
  UPDATE_INVITATION,
  UPDATE_OBJECTIVE,
} from "../util/mutations";
import {
  ChallengeStatus,
  InviteStatus,
  ObjectiveTypes,
  ResultTypes,
  DashboardDisplayOptions,
} from "../enums";
import { GiTrophy } from "react-icons/gi";

type EntryProps = {
  entry: Entry;
  mine?: boolean;
  currentUser: User;
  changeDashboardDisplayOption: (arg0: number) => void;
};
const EntryPreview: React.FC<EntryProps> = ({
  entry,
  mine = false,
  currentUser,
  changeDashboardDisplayOption,
}) => {
  const currentUserId = currentUser.id;
  const myLike: Like | undefined = entry.likes.find(
    like => like.userId === currentUserId
  );
  const entryMetrics: EntryCalculations = entryCalculations(entry);
  const [deleteEntryMutation] = useMutation(DELETE_ENTRY, {
    update(cache) {
      const cachedData: { listEntries: Entry[] } | null = cache.readQuery({
        query: LIST_ENTRIES,
      });
      cache.writeQuery({
        query: LIST_ENTRIES,
        data: {
          listEntries: cachedData
            ? [...cachedData.listEntries.filter(e => e.id !== entry.id)]
            : [],
        },
      });
    },
  });
  const [likeEntryMutation] = useMutation(LIKE_ENTRY, {
    update(cache, { data: { likeEntry } }) {
      const cachedData: { listEntries: Entry[] } | null = cache.readQuery({
        query: LIST_ENTRIES,
      });
      if (cachedData) {
        cache.writeQuery({
          query: LIST_ENTRIES,
          data: {
            listEntries: [
              ...cachedData.listEntries.filter(
                cachedEntry => cachedEntry.id !== entry.id
              ),
              { ...entry, likes: [...entry.likes, likeEntry] },
            ],
          },
        });
      }
    },
  });
  const [unlikeEntryMutation] = useMutation(UNLIKE_ENTRY, {
    update(cache) {
      const cachedData: { listEntries: Entry[] } | null = cache.readQuery({
        query: LIST_ENTRIES,
      });
      cache.writeQuery({
        query: LIST_ENTRIES,
        data: {
          listEntries: cachedData
            ? [
                ...cachedData.listEntries.filter(e => e.id !== entry.id),
                {
                  ...entry,
                  likes: [
                    ...entry.likes.filter(
                      like =>
                        like.userId !== currentUserId &&
                        like.entryId !== entry.id
                    ),
                  ],
                },
              ]
            : [],
        },
      });
    },
  });
  const [createChallengeMutation] = useMutation(CREATE_CHALLENGE, {
    update(cache, { data: { createChallenge } }) {
      const cachedData: {
        listChallenges: Challenge[];
      } | null = cache.readQuery({
        query: LIST_CHALLENGES,
      });
      // console.warn({ cachedData }, { createChallenge });
      if (cachedData) {
        cache.writeQuery({
          query: LIST_CHALLENGES,
          data: {
            listChallenges: [...cachedData.listChallenges, createChallenge],
          },
        });
      }
    },
  });
  const handleCreateChallenge = async () => {
    const variables = {
      name: `${entry.distance} in ${formatTimeMS(entry.time)}`,
      description: `${entry.user.firstName} challenges`,
      moderatorId: currentUserId,
      status: ChallengeStatus.PENDING,
      startDate: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      duration: 1,
      endDate: format(addDays(new Date(), 1), "yyyy-MM-dd HH:mm:ss"),
    };
    try {
      const challengeResult: ExecutionResult<any> = await createChallengeMutation(
        { variables }
      );
      console.warn({ challengeResult });
      updateInvitation({ ...challengeResult.data.createChallenge });
      updateObjective({ ...challengeResult.data.createChallenge.objective });
      changeDashboardDisplayOption(DashboardDisplayOptions.Challenges);
    } catch (err) {
      console.warn({ err });
    }
  };
  const [updateObjectiveMutation] = useMutation(UPDATE_OBJECTIVE);
  const updateObjective = async (objective: ChallengeObjective) => {
    console.warn({ Objective: { ...objective } });
    try {
      const result = await updateObjectiveMutation({
        variables: {
          id: objective.id,
          value: entry.distance,
          objectiveType: ObjectiveTypes.DISTANCE,
          resultType: ResultTypes.TIME,
          challengeId: objective.challenge.id,
        },
      });

      console.warn({ updateObjectiveResult: { result } });
    } catch (err) {
      console.warn({ err });
    }
  };
  const [updateInvitationMutation] = useMutation(UPDATE_INVITATION);
  const updateInvitation = async (challenge: Challenge) => {
    try {
      const result = await updateInvitationMutation({
        variables: {
          id: challenge.invitations[0].id,
          status: InviteStatus.ACCEPTED,
          inviteeId: currentUserId,
          challengeId: challenge.id,
          responseId: entry.id,
        },
      });
      console.warn({ updateInvitationResult: { result } });
      console.warn({ challenge: { ...challenge } });
    } catch (err) {
      console.warn({ err });
    }
  };
  const [displayWeightCorrected, setDisplayWeightCorrected] = useState(false);
  const [displayForm, setDisplayForm] = useState(false);
  const [displayDetails, setDisplayDetails] = useState(false);
  const handleDelete = (id: number) => {
    deleteEntryMutation({ variables: { id } });
  };

  const handleLike = async () => {
    try {
      const entryResult: ExecutionResult<{
        likeEntry: Like;
      }> = await likeEntryMutation({
        variables: { userId: currentUserId, entryId: entry.id },
      });
      console.warn({ entryResult });
    } catch (err) {
      console.warn({ err });
    }
  };
  const handleUnlike = (likeId: number) => {
    unlikeEntryMutation({ variables: { id: likeId } });
  };
  const handleWcToggle = () => {
    setDisplayWeightCorrected(!displayWeightCorrected);
  };
  const handleFormToggle = () => {
    setDisplayForm(!displayForm);
  };
  const handleDetailsToggle = () => {
    setDisplayDetails(!displayDetails);
  };
  return (
    <div
      key={entry.id}
      className={`${
        mine ? "bg-green-200" : ""
      } px-2 border-b last:border-b-0 border-gray-700
          hover:bg-gray-200`}
    >
      <div>
        <div className="flex justify-between">
          <button onClick={handleWcToggle}>
            <MdFunctions
              style={{
                color: displayWeightCorrected ? "blue" : "black",
              }}
            />
          </button>
          {mine ? (
            <button
              className="items-center flex"
              onClick={handleCreateChallenge}
            >
              {entry.invitations ? entry.invitations.length : null}
              <GiTrophy />
            </button>
          ) : (
            <button className="items-center flex">
              {entry.invitations ? entry.invitations.length : null}
              <GiTrophy />
            </button>
          )}
          {mine && displayDetails ? (
            <button
              onClick={handleFormToggle}
              style={{
                color: displayForm ? "blue" : "black",
              }}
            >
              <MdEdit />
            </button>
          ) : null}
          <button>
            <div className="flex">
              <MdThumbUp
                onClick={myLike ? () => handleUnlike(myLike.id) : handleLike}
                style={{
                  color: myLike ? "blue" : "black",
                }}
              />
              <div className="text-sm mr-1">{`${entry.likes.length}`}</div>
            </div>
          </button>
        </div>
      </div>
      <div onClick={handleDetailsToggle} style={{ cursor: "pointer" }}>
        <div className="flex flex-1 justify-between">
          {/* <div>{`${entry.user.firstName} ${entry.user.lastName[0]}.`}</div> */}
          <div className="italic text-sm">{`${
            displayWeightCorrected ? "Weight Corrected" : "Raw Scores"
          }`}</div>
        </div>
        {displayDetails ? (
          <div className="flex flex-1 justify-between">
            <div className="flex align-center">
              <MdAccessTime size={16} />
              <div className="italic text-sm ml-1">
                {`${format(new Date(entry.completedAt), "hh:mm")}`}
              </div>
            </div>
            <div className="flex">
              <div className="italic text-sm mr-2">{`${entry.userWeight}kg`}</div>
              <div className="italic text-sm">{`${entry.userHeight}cm`}</div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="flex justify-between">
        <div className="flex-column flex-1">
          <div>
            <div className="flex justify-between">
              <div>
                <div className="font-bold">
                  {displayWeightCorrected
                    ? `${entryMetrics.wcDistance.toFixed(0)}m in ${formatTimeMS(
                        Number(entryMetrics.wcTime.toFixed(0))
                      )}`
                    : `${entry.distance}m in ${formatTimeMS(entry.time)}`}
                </div>
                {displayDetails ? (
                  <div className="flex">
                    {entry.avgHr ? (
                      <div className="mr-3">
                        <div className=" font-bold text-xs">bpm Avg</div>
                        <div className=" font-bold">{`${entry.avgHr ||
                          "-"}`}</div>
                      </div>
                    ) : null}
                    {entry.maxHr ? (
                      <div>
                        <div className=" font-bold text-xs">bpm Max</div>
                        <div className=" font-bold text-l">
                          {`${entry.maxHr || "-"}`}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
              {displayDetails ? (
                <div>
                  <div className="font-bold text-l">
                    {displayWeightCorrected
                      ? `${entryMetrics.wcPace.toFixed(2)}m/s`
                      : `${entryMetrics.pace.toFixed(2)}m/s`}
                  </div>
                  <div className="font-bold text-l">
                    {displayWeightCorrected
                      ? `${entryMetrics.wcAvgPowerOutput}W`
                      : `${entryMetrics.avgPowerOutput}W`}
                  </div>
                  <div className="font-bold text-l">
                    {displayWeightCorrected
                      ? `${entryMetrics.wcTotalPower}J`
                      : `${entryMetrics.totalPower.toFixed(0)}J`}
                  </div>
                </div>
              ) : null}
            </div>
            {displayForm ? (
              <UpdateEntry
                entry={entry}
                handleFormToggle={handleFormToggle}
                deleteEntry={handleDelete}
              />
            ) : null}
          </div>
        </div>
      </div>
      <EntryComments entry={entry} currentUser={currentUser} />
    </div>
  );
};

export default EntryPreview;
