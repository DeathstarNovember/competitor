import React from "react";
import { useMutation } from "@apollo/react-hooks";
import {
  formatTimeMS,
  getEntryAvgPowerOutput,
  getEntryTotalPowerProduced,
  getWeightCorrectedDistance,
  getWeightCorrectedTime,
  getWeightCorrectedPace,
  getEntryPace,
  getWeightCorrectedEntryAvgPowerOutput,
  getWeightCorrectedEntryTotalPowerProduced,
} from "../util";
import { Entry } from "../types";
import { DELETE_ENTRY } from "../util";
import { format } from "date-fns/esm";

type EntryProps = {
  entry: Entry;
  entryId: number;
};
const EntryPreview: React.FC<EntryProps> = ({ entry, entryId }) => {
  const [deleteEntryMutation] = useMutation(DELETE_ENTRY);
  const handleDelete = (id: number) => {
    deleteEntryMutation({ variables: { id } });
  };
  return (
    <div
      key={entryId}
      className="p-2 border-b last:border-b-0 border-color-gray-700
          hover:bg-gray-200"
    >
      <div>{`${entry.user.firstName} ${entry.user.lastName[0]}.`}</div>
      <button onClick={() => handleDelete(entry.id)}>X</button>
      <div className="flex justify-between">
        <div className="flex-column flex-1">
          <div className="flex-1 italic text-sm">
            {`${format(new Date(entry.completedAt), "Pp")}`}
          </div>
          <div className="flex-1 italic text-sm">Raw Scores</div>
        </div>
        <div className="flex-column flex-1">
          <div className="flex-1 italic text-sm">{`${entry.userWeight}kg`}</div>
          <div className="flex-1 italic text-sm">Weight Corrected</div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex-1 font-bold text-xl">{`${entry.distance}m`}</div>
        <div className="flex-1 font-bold text-xl">
          {`${getWeightCorrectedDistance(entry).toFixed(2)}m`}
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex-1 font-bold text-xl">
          {`${formatTimeMS(entry.time)}`}
        </div>
        <div className="flex-1 font-bold text-xl">
          {`${formatTimeMS(Number(getWeightCorrectedTime(entry).toFixed(0)))}`}
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex-1 font-bold text-xl">{`${getEntryPace(
          entry
        ).toFixed(2)}m/s`}</div>
        <div className="flex-1 font-bold text-xl">
          {`${getWeightCorrectedPace(entry).toFixed(2)}m/s`}
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex-1 font-bold text-xl">{`${getEntryAvgPowerOutput(
          entry
        )}W`}</div>
        <div className="flex-1 font-bold text-xl">{`${getWeightCorrectedEntryAvgPowerOutput(
          entry
        )}W`}</div>
      </div>
      <div className="flex justify-between">
        <div className="flex-1 font-bold text-xl">{`${getEntryTotalPowerProduced(
          entry
        ).toFixed(0)}J`}</div>
        <div className="flex-1 font-bold text-xl">{`${getWeightCorrectedEntryTotalPowerProduced(
          entry
        ).toFixed(0)}J`}</div>
      </div>
    </div>
  );
};

export default EntryPreview;
