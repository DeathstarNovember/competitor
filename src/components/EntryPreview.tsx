import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import {
  formatTimeMS,
  entryCalculations,
  LIST_ENTRIES,
  LIKE_ENTRY,
  DELETE_ENTRY,
  UNLIKE_ENTRY,
} from "../util";
import { Entry, User, Like } from "../types";
import { MdEdit, MdFunctions, MdAccessTime, MdThumbUp } from "react-icons/md";
import { EntryCalculations } from "../util/calculations";
import UpdateEntry from "./UpdateEntry";
import EntryComments from "./EntryComments";
import { format } from "date-fns/esm";
import { ExecutionResult } from "graphql";

type EntryProps = {
  entry: Entry;
  entryId: number;
  mine?: boolean;
  currentUser?: User;
};
const EntryPreview: React.FC<EntryProps> = ({
  entry,
  entryId,
  mine = false,
  currentUser,
}) => {
  const currentUserId = currentUser ? currentUser.id : 0;
  const likerIds = entry.likes
    .map(like => like.userId)
    .filter((v, i, a) => a.indexOf(v) === i);
  const iLike = currentUser ? likerIds.includes(currentUser.id) : false;
  const myLike: Like | undefined = iLike
    ? entry.likes.find(like => like.userId === currentUserId) || {
        id: 0,
        userId: currentUserId,
        entryId: entry.id,
      }
    : { id: 0, userId: currentUserId, entryId: entry.id };
  const entryMetrics: EntryCalculations = entryCalculations(entry);
  const [deleteEntryMutation] = useMutation(DELETE_ENTRY, {
    update(cache) {
      const cachedData: { listEntries: Entry[] } | null = cache.readQuery({
        query: LIST_ENTRIES,
      });
      // console.warn({ cachedData }, { deleteEntry: entry.id });
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
  const [likeEntryMutation] = useMutation(LIKE_ENTRY);
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
                  likes: currentUser
                    ? [
                        ...entry.likes.filter(
                          like =>
                            like.userId !== currentUser.id &&
                            like.entryId !== entry.id
                        ),
                      ]
                    : [...entry.likes],
                },
              ]
            : [],
        },
      });
    },
  });

  const [displayWeightCorrected, setDisplayWeightCorrected] = useState(false);
  const [displayForm, setDisplayForm] = useState(false);
  const [displayDetails, setDisplayDetails] = useState(false);
  const handleDelete = (id: number) => {
    deleteEntryMutation({ variables: { id } });
  };
  const handleLike = async () => {
    if (currentUser) {
      try {
        const result: ExecutionResult<{
          likeEntry: Like;
        }> = await likeEntryMutation({
          variables: { userId: currentUserId, entryId: entry.id },
          update(cache, { data: { likeEntry } }) {
            const cachedData: { listEntries: Entry[] } | null = cache.readQuery(
              {
                query: LIST_ENTRIES,
              }
            );
            cache.writeQuery({
              query: LIST_ENTRIES,
              data: {
                listEntries: cachedData
                  ? [
                      ...cachedData.listEntries.filter(
                        cachedEntry => cachedEntry.id !== entry.id
                      ),
                      { ...entry, likes: [...entry.likes, likeEntry] },
                    ]
                  : "No Data",
              },
            });
          },
        });
        console.warn({ result });
      } catch (err) {
        console.warn({ err });
      }
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
      key={entryId}
      className={`${
        mine ? "bg-green-200" : ""
      } p-2 border-b last:border-b-0 border-gray-700
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
                onClick={iLike ? () => handleUnlike(myLike.id) : handleLike}
                style={{
                  color: iLike ? "blue" : "black",
                }}
              />
              <div className="text-sm mr-1">{`${entry.likes.length}`}</div>
            </div>
          </button>
        </div>
      </div>
      <div onClick={handleDetailsToggle} style={{ cursor: "pointer" }}>
        <div className="flex flex-1 justify-between">
          <div>{`${entry.user.firstName} ${entry.user.lastName[0]}.`}</div>
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

      {currentUser ? (
        <EntryComments entry={entry} currentUser={currentUser} />
      ) : null}
    </div>
  );
};

export default EntryPreview;
