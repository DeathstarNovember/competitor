import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { formatTimeMS, entryCalculations, LIST_ENTRIES } from "../util";
import { Entry } from "../types";
import { DELETE_ENTRY } from "../util";
import { MdEdit, MdFunctions } from "react-icons/md";
import { EntryCalculations } from "../util/calculations";
import UpdateEntry from "./UpdateEntry";
import UpdateEntryHrInfo from "./UpdateEntryHrInfo";
import { format } from "date-fns/esm";

type EntryProps = {
  entry: Entry;
  entryId: number;
  mine?: boolean;
};
const EntryPreview: React.FC<EntryProps> = ({
  entry,
  entryId,
  mine = false,
}) => {
  const entryMetrics: EntryCalculations = entryCalculations(entry);
  const [deleteEntryMutation] = useMutation(DELETE_ENTRY, {
    update(cache) {
      const cachedData: { listEntries: Entry[] } | null = cache.readQuery({
        query: LIST_ENTRIES,
      });
      console.warn({ cachedData }, { deleteEntry: entry.id });
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
  const [displayWeightCorrected, setDisplayWeightCorrected] = useState(false);
  const [displayForm, setDisplayForm] = useState(false);
  const [displayHrForm, setDisplayHrForm] = useState(false);
  const handleDelete = (id: number) => {
    deleteEntryMutation({ variables: { id } });
  };

  const handleWcToggle = () => {
    setDisplayWeightCorrected(!displayWeightCorrected);
  };
  const handleFormToggle = () => {
    setDisplayForm(!displayForm);
  };
  const handleHrFormToggle = () => {
    if (mine) setDisplayHrForm(!displayHrForm);
  };
  return (
    <div
      key={entryId}
      className={`${
        mine ? "bg-green-200" : ""
      } p-2 border-b last:border-b-0 border-color-gray-700
          hover:bg-gray-200`}
    >
      <div className="">
        <div className="flex justify-between">
          <button onClick={handleWcToggle}>
            <MdFunctions
              style={{
                color: displayWeightCorrected ? "blue" : "black",
              }}
            />
          </button>
          {mine ? (
            <button onClick={handleFormToggle}>
              <MdEdit />
            </button>
          ) : null}
        </div>
        <div>
          <div className="flex flex-1 justify-between">
            <div>{`${entry.user.firstName} ${entry.user.lastName[0]}.`}</div>
            <div className="italic text-sm">
              {format(new Date(entry.completedAt), "MM/dd/yyyy")}
            </div>
          </div>
          <div className="flex flex-1 justify-between">
            <div className="flex">
              <div className="italic text-sm mr-2">{`${entry.userWeight}kg`}</div>
              <div className="italic text-sm">{`${entry.userHeight}cm`}</div>
            </div>
            <div className="italic text-sm">{`${
              displayWeightCorrected ? "Weight Corrected" : "Raw Scores"
            }`}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex-column flex-1">
          {displayForm ? (
            <UpdateEntry
              entry={entry}
              handleFormToggle={handleFormToggle}
              deleteEntry={handleDelete}
            />
          ) : null}
          {displayHrForm ? (
            <UpdateEntryHrInfo
              entry={entry}
              handleHrFormToggle={handleHrFormToggle}
            />
          ) : null}
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
              </div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryPreview;
