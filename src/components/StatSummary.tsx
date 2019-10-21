import React from "react";
import { Entry } from "../types";
import {
  getEntryGroupAvgPace,
  getEntryGroupAvgPowerOutput,
  getEntryGroupTotalPowerProduced,
  getEntryGroupTotalDistance,
} from "../util";
import { format, parseISO } from "date-fns";
import { parse } from "date-fns/esm";
type StatSummaryProps = {
  entries: Entry[];
};
const StatSummary: React.FC<StatSummaryProps> = ({ entries }) => {
  return (
    <div>
      <div className="ml-2 text-xl font-bold">
        {`${entries
          .map(e => `${e.user.firstName} ${e.user.lastName[0]}.`)
          .filter((v, i, a) => a.indexOf(v) === i)
          .join(", ")} ${format(
          parseISO(
            String(
              entries
                .map(e => e.completedAt)
                .sort((a, b) => Number(b) - Number(a))[entries.length - 1]
            )
          ),
          "MM/dd/yy"
        )} - ${format(
          parseISO(
            String(
              entries
                .map(e => e.completedAt)
                .sort((a, b) => Number(b) - Number(a))[0]
            )
          ),
          "MM/dd/yy"
        )}`}
      </div>
      <div className="flex justify-around p-2 ml-2 bg-blue-700 rounded-lg p-2 text-white">
        <div className="flex-column">
          <div className="font-bold">Total Dist</div>
          <div className="font-bold">{`${getEntryGroupTotalDistance(
            entries
          )}m`}</div>
        </div>
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
          <div className="font-bold">{`${(
            getEntryGroupTotalPowerProduced(entries) / 1000
          ).toFixed(2)}kJ`}</div>
        </div>
      </div>
    </div>
  );
};

export default StatSummary;
