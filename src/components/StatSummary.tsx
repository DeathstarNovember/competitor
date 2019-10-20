import React from "react";
import { Entry } from "../types";
import {
  getEntryGroupAvgPace,
  getEntryGroupAvgPowerOutput,
  getEntryGroupTotalPowerProduced,
} from "../util";
type StatSummaryProps = {
  entries: Entry[];
};
const StatSummary: React.FC<StatSummaryProps> = ({ entries }) => {
  return (
    <div>
      <div className="ml-2 text-xl font-bold">
        {entries
          .map(e => `${e.user.firstName} ${e.user.lastName[0]}.`)
          .filter((v, i, a) => a.indexOf(v) === i)
          .join(", ")}
      </div>
      <div className="flex justify-around pb-4 ml-2 bg-blue-700 rounded-lg p-2 text-white">
        <div className="flex-column">
          <div className="font-bold">Avg Spd</div>
          <div className="font-bold">{`${getEntryGroupAvgPace(
            entries
          )}m/s`}</div>
        </div>
        <div className="flex-column">
          <div className="font-bold">Avg Pwr</div>
          <div className="font-bold">{`${getEntryGroupAvgPowerOutput(
            entries
          )}W`}</div>
        </div>
        <div className="flex-column">
          <div className="font-bold">Total Pwr</div>
          <div className="font-bold">{`${getEntryGroupTotalPowerProduced(
            entries
          )}J`}</div>
        </div>
      </div>
    </div>
  );
};

export default StatSummary;
