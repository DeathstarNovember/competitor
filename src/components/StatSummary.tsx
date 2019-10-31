import React from "react";
import { Entry } from "../types";
import { entryGroupCalculations, getEntryPace } from "../util";
import { format, parseISO } from "date-fns";
type StatSummaryProps = {
  entries: Entry[];
};
const StatSummary: React.FC<StatSummaryProps> = ({ entries }) => {
  const statSummary = entryGroupCalculations(entries);
  return (
    <div className="max-w-md mx-auto">
      <div className="text-xl font-bold">
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
      <div className="bg-blue-700 rounded-lg p-2 text-white">
        <div className="flex flex-1 mb-3 justify-around">
          <div className="flex-column">
            <div className="font-bold">Total Dist</div>
            <div className="font-bold">{`${statSummary.totalDistance}m`}</div>
          </div>
          <div className="flex-column">
            <div className="font-bold">Avg Dist</div>
            <div className="font-bold">{`${statSummary.averageDistance.toFixed(
              2
            )}m`}</div>
          </div>
          <div className="flex-column">
            <div className="font-bold">Avg Spd</div>
            <div className="font-bold">{`${statSummary.avgPace}m/s`}</div>
          </div>
        </div>
        <div className="flex flex-1 justify-around">
          <div className="flex-column">
            <div className="font-bold">Fastest Spd</div>
            <div className="font-bold">{`${getEntryPace(
              statSummary.fastestEntry
            )}m/s`}</div>
          </div>
          <div className="flex-column">
            <div className="font-bold">Avg Pwr</div>
            <div className="font-bold">{`${statSummary.avgPowerOutput}W`}</div>
          </div>
          <div className="flex-column">
            <div className="font-bold">Total Pwr</div>
            <div className="font-bold">{`${(
              statSummary.totalPowerProduced / 1000
            ).toFixed(2)}kJ`}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatSummary;
