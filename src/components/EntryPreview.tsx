import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { formatTimeMS, entryCalculations } from "../util";
import { Entry } from "../types";
import { DELETE_ENTRY } from "../util";
import { format } from "date-fns/esm";
import { MdDelete, MdEdit, MdFunctions } from "react-icons/md";
import { EntryCalculations } from "../util/calculations";
import UpdateEntry from "./UpdateEntry";

type EntryProps = {
  entry: Entry;
  entryId: number;
};
const EntryPreview: React.FC<EntryProps> = ({ entry, entryId }) => {
  const entryMetrics: EntryCalculations = entryCalculations(entry);
  const [deleteEntryMutation] = useMutation(DELETE_ENTRY);
  const [displayWeightCorrected, setDisplayWeightCorrected] = useState(false);
  const [displayForm, setDisplayForm] = useState(false);
  const handleDelete = (id: number) => {
    deleteEntryMutation({ variables: { id } });
  };

  const handleWcToggle = () => {
    setDisplayWeightCorrected(!displayWeightCorrected);
  };
  const handleFormToggle = () => {
    setDisplayForm(!displayForm);
  };
  return (
    <div
      key={entryId}
      className="p-2 border-b last:border-b-0 border-color-gray-700
          hover:bg-gray-200"
    >
      <div className="flex justify-between">
        <div>{`${entry.user.firstName} ${entry.user.lastName[0]}.`}</div>
        <div className="italic text-sm">
          {`${format(new Date(entry.completedAt), "Pp")}`}
        </div>
        <div className="flex">
          <div className="italic text-sm">{`${entry.userWeight}kg`}</div>
          <button onClick={handleWcToggle}>
            <MdFunctions />
          </button>
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
          {displayForm ? (
            <UpdateEntry entry={entry} />
          ) : displayWeightCorrected ? (
            <div>
              <div className="flex-1 italic text-sm">Weight Corrected</div>
              <div className="flex justify-between">
                <div className="font-bold text-xl">
                  {`${entryMetrics.wcDistance.toFixed(0)}m in ${formatTimeMS(
                    Number(entryMetrics.wcTime.toFixed(0))
                  )}`}
                </div>
                {/* <div className="font-bold text-xl">
                  {`${formatTimeMS(Number(entryMetrics.wcTime.toFixed(0)))}`}
                </div> */}
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
              <div className="italic text-sm">Raw Scores</div>
              <div className="flex justify-between">
                <div className="font-bold text-xl">{`${
                  entry.distance
                }m in ${formatTimeMS(entry.time)}`}</div>
                {/* <div className="font-bold text-xl">
                    {`${formatTimeMS(entry.time)}`}
                  </div> */}

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
