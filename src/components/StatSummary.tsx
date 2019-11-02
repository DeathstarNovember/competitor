import React, { useState } from "react";
import { Entry } from "../types";
import { entryGroupCalculations, getEntryPace } from "../util";
import { format, parseISO } from "date-fns";
import { MdSwapVert } from "react-icons/md";
type StatSummaryProps = {
  entries: Entry[];
};
const StatSummary: React.FC<StatSummaryProps> = ({ entries }) => {
  const statSummary = entryGroupCalculations(entries);
  const [displayFullSummary, setDisplayFullSummary] = useState(false);
  return (
    <div className="max-w-md mx-auto">
      <div>
        <div className="text-xl font-bold flex flex-1 justify-between">
          {`Summary since ${format(
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
          <button
            className="bg-gray-500 hover:bg-green-700 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => setDisplayFullSummary(!displayFullSummary)}
          >
            <MdSwapVert />
          </button>
        </div>
      </div>
      <div className="p-2">
        <div className="flex flex-col mb-3">
          <div className="flex flex-1 justify-between">
            <div className="">Total Dist</div>
            <div className="">{`${statSummary.totalDistance}m`}</div>
          </div>
          {displayFullSummary ? (
            <>
              <div className="flex flex-1 justify-between">
                <div className="">Avg Dist</div>
                <div className="">{`${statSummary.averageDistance.toFixed(
                  2
                )}m`}</div>
              </div>
              <div className="flex flex-1 justify-between">
                <div className="">Avg Spd</div>
                <div className="">{`${statSummary.avgPace}m/s`}</div>
              </div>
              <div className="flex flex-1 justify-between">
                <div className="">Fastest Spd</div>
                <div className="">{`${getEntryPace(
                  statSummary.fastestEntry
                )}m/s`}</div>
              </div>
              <div className="flex flex-1 justify-between">
                <div className="">Avg Pwr</div>
                <div className="">{`${statSummary.avgPowerOutput}W`}</div>
              </div>
              <div className="flex flex-1 justify-between">
                <div className="">Total Pwr</div>
                <div className="">{`${(
                  statSummary.totalPowerProduced / 1000
                ).toFixed(2)}kJ`}</div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default StatSummary;
