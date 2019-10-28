import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { formatTimeMS, entryCalculations } from "../util";
import { Entry } from "../types";
import { DELETE_ENTRY } from "../util";
import {
  MdDelete,
  MdEdit,
  MdFunctions,
  MdFavorite as MdHeartRate,
} from "react-icons/md";
import { EntryCalculations } from "../util/calculations";
import UpdateEntry from "./UpdateEntry";
import UpdateEntryHrInfo from "./UpdateEntryHrInfo";
import { format } from "date-fns/esm";

type EntryProps = {
  entry: Entry;
  entryId: number;
};
const EntryPreview: React.FC<EntryProps> = ({ entry, entryId }) => {
  const entryMetrics: EntryCalculations = entryCalculations(entry);
  const [deleteEntryMutation] = useMutation(DELETE_ENTRY);
  const [displayWeightCorrected, setDisplayWeightCorrected] = useState(false);
  const [displayHrInfo, setDisplayHrInfo] = useState(false);
  const [displayForm, setDisplayForm] = useState(false);
  const [displayHrForm, setDisplayHrForm] = useState(false);
  const handleDelete = (id: number) => {
    deleteEntryMutation({ variables: { id } });
  };

  const handleWcToggle = () => {
    if (!displayWeightCorrected && displayHrInfo) setDisplayHrInfo(false);
    setDisplayWeightCorrected(!displayWeightCorrected);
  };
  const handleHrToggle = () => {
    if (!displayHrInfo && displayWeightCorrected)
      setDisplayWeightCorrected(false);
    setDisplayHrInfo(!displayHrInfo);
  };
  const handleFormToggle = () => {
    setDisplayForm(!displayForm);
  };
  const handleHrFormToggle = () => {
    setDisplayHrForm(!displayHrForm);
  };
  return (
    <div
      key={entryId}
      className="p-2 border-b last:border-b-0 border-color-gray-700
          hover:bg-gray-200"
    >
      <div className="flex justify-between">
        <div>{`${entry.user.firstName} ${entry.user.lastName[0]}.`}</div>
        <div className="italic text-sm">{`${entry.userWeight}kg`}</div>
        <div className="italic text-sm">{`${entry.userHeight}cm`}</div>
        <button onClick={handleWcToggle}>
          <MdFunctions
            style={{
              color:
                displayWeightCorrected && !displayHrInfo ? "blue" : "black",
            }}
          />
        </button>
        {entry.maxHr || entry.avgHr ? (
          <button onClick={handleHrToggle}>
            <MdHeartRate style={{ color: displayHrInfo ? "red" : "black" }} />
          </button>
        ) : (
          <button onClick={handleHrFormToggle}>
            <MdHeartRate style={{ color: "gray" }} />
          </button>
        )}
        <div className="flex">
          <button onClick={handleFormToggle}>
            <MdEdit />
          </button>
          <button onClick={() => handleDelete(entry.id)}>
            <MdDelete />
          </button>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex-column flex-1">
          {displayForm ? <UpdateEntry entry={entry} /> : null}
          {displayHrForm ? <UpdateEntryHrInfo entry={entry} /> : null}
          {displayHrInfo ? (
            <div>
              <div className="flex-1 italic text-sm">HR Info</div>
              <div className="flex justify-between">
                <div className="font-bold text-xl">
                  {`Avg ${entry.avgHr}bpm`}
                </div>
                <div>
                  <div className="font-bold text-l">
                    {`Max ${entry.maxHr}bpm`}
                  </div>
                </div>
              </div>
            </div>
          ) : displayWeightCorrected ? (
            <div>
              <div className="flex-1 italic text-sm">Weight Corrected</div>
              <div className="flex justify-between">
                <div className="font-bold text-xl">
                  {`${entryMetrics.wcDistance.toFixed(0)}m in ${formatTimeMS(
                    Number(entryMetrics.wcTime.toFixed(0))
                  )}`}
                </div>
                <div>
                  <div className="font-bold text-l">
                    {`${entryMetrics.wcPace.toFixed(2)}m/s`}
                  </div>
                  <div className="font-bold text-l">{`${entryMetrics.wcAvgPowerOutput}W`}</div>
                  <div className="font-bold text-l">{`${entryMetrics.wcTotalPower}J`}</div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-1 justify-between">
                <div className="italic text-sm">
                  {format(new Date(entry.completedAt), "MM/dd/yyyy")}
                </div>
                <div className="italic text-sm">Raw Scores</div>
              </div>
              <div className="flex justify-between">
                <div className="font-bold text-xl">{`${
                  entry.distance
                }m in ${formatTimeMS(entry.time)}`}</div>
                <div>
                  <div className="font-bold text-l">{`${entryMetrics.pace.toFixed(
                    2
                  )}m/s`}</div>
                  <div className="font-bold text-l">{`${entryMetrics.avgPowerOutput}W`}</div>
                  <div className="font-bold text-l">{`${entryMetrics.totalPower.toFixed(
                    0
                  )}J`}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntryPreview;
