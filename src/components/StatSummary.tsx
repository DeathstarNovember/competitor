import React, { useState } from "react";
import { Entry } from "../types";
import { entryGroupCalculations, getEntryPace } from "../util";
import { format, parseISO } from "date-fns";
import { MdSwapVert } from "react-icons/md";
import { FaQuestion } from "react-icons/fa";
import {
  GiPaperBoat,
  GiFishingBoat,
  GiSailboat,
  GiSpeedBoat,
} from "react-icons/gi";
type StatSummaryProps = {
  entries: Entry[];
};
type LevelBadgeProps = {
  totalDistance: number;
};
const LevelBadge: React.FC<LevelBadgeProps> = ({ totalDistance }) => {
  if (totalDistance < 100000) {
    return <GiPaperBoat />;
  } else if (totalDistance < 500000) {
    return <GiFishingBoat />;
  } else if (totalDistance < 750000) {
    return <GiSailboat />;
  } else if (totalDistance >= 1000000) {
    return <GiSpeedBoat />;
  } else {
    return <FaQuestion />;
  }
};
const StatSummary: React.FC<StatSummaryProps> = ({ entries }) => {
  const statSummary = entryGroupCalculations(entries);
  const [displayFullSummary, setDisplayFullSummary] = useState(false);
  return (
    <div className="max-w-md mx-auto">
      <div>
        <div className="text-l font-bold flex flex-1 justify-between">
          {`${format(
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
            <div className="flex">
              <div>Total Dist</div>
              <div className="bg-blue-400 p-1 rounded ml-2">
                <LevelBadge totalDistance={statSummary.totalDistance} />
              </div>
            </div>
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
                <div className="">{`${statSummary.avgPace.toFixed(3)}m/s`}</div>
              </div>
              <div className="flex flex-1 justify-between">
                <div className="">Fastest Spd</div>
                <div className="">{`${getEntryPace(
                  statSummary.fastestEntry
                ).toFixed(3)}m/s`}</div>
              </div>
              <div className="flex flex-1 justify-between">
                <div className="">Avg Pwr</div>
                <div className="">{`${statSummary.avgPowerOutput.toFixed(
                  3
                )}W`}</div>
              </div>
              <div className="flex flex-1 justify-between">
                <div className="">Total Pwr</div>
                <div className="">{`${statSummary.totalPowerProduced.toFixed(
                  0
                )}J`}</div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default StatSummary;
