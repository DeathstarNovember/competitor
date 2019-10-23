import { Entry } from "../types";
import { sortAscByNumberProp, sortDescByNumberProp } from "./arrayUtils";
export const getEntryAvgPowerOutput = (entry: Entry) =>
  Number((2.8 / Math.pow(entry.time / entry.distance, 3)).toFixed(2));

export const getEntryTotalPowerProduced = (entry: Entry) =>
  getEntryAvgPowerOutput(entry) * entry.time;

export const getEntryPace = (entry: Entry) =>
  Number((entry.distance / entry.time).toFixed(2));

export const getEntryGroupAvgPowerOutput = (entryGroup: Entry[]) =>
  Number(
    (
      entryGroup
        .map(entry => getEntryAvgPowerOutput(entry))
        .reduce((acc, curr) => acc + curr) / entryGroup.length
    ).toFixed(2)
  );

export const getEntryGroupAvgPace = (entryGroup: Entry[]) =>
  Number(
    (
      entryGroup
        .map(entry => getEntryPace(entry))
        .reduce((acc, curr) => acc + curr) / entryGroup.length
    ).toFixed(2)
  );

export const getEntryGroupTotalPowerProduced = (entryGroup: Entry[]) =>
  entryGroup
    .map(entry => getEntryTotalPowerProduced(entry))
    .reduce((acc, curr) => acc + curr);
export const getEntryGroupTotalDistance = (entryGroup: Entry[]) =>
  entryGroup.map(entry => entry.distance).reduce((acc, curr) => acc + curr);

export const getWeightCorrectionFactor = (entry: Entry) =>
  Math.pow((entry.userWeight * 2.2) / 270, 0.222);

export const getWeightCorrectedTime = (entry: Entry) =>
  getWeightCorrectionFactor(entry) * entry.time;

export const getWeightCorrectedDistance = (entry: Entry) =>
  entry.distance / getWeightCorrectionFactor(entry);

export const getWeightCorrectedPace = (entry: Entry) =>
  getWeightCorrectedDistance(entry) / getWeightCorrectedTime(entry);

export const getWeightCorrectedEntryAvgPowerOutput = (entry: Entry) =>
  Number(
    (2.8 / Math.pow(getWeightCorrectedTime(entry) / entry.distance, 3)).toFixed(
      2
    )
  );

export const getWeightCorrectedEntryTotalPowerProduced = (entry: Entry) =>
  Number(
    (
      getWeightCorrectedEntryAvgPowerOutput(entry) *
      getWeightCorrectedTime(entry)
    ).toFixed(0)
  );
export type EntryCalculations = {
  pace: number;
  avgPowerOutput: number;
  totalPower: number;
  wcTime: number;
  wcDistance: number;
  wcPace: number;
  wcAvgPowerOutput: number;
  wcTotalPower: number;
};
export const entryCalculations = (entry: Entry) => ({
  pace: getEntryPace(entry),
  avgPowerOutput: getEntryAvgPowerOutput(entry),
  totalPower: getEntryTotalPowerProduced(entry),
  wcTime: getWeightCorrectedTime(entry),
  wcDistance: getWeightCorrectedDistance(entry),
  wcPace: getWeightCorrectedPace(entry),
  wcAvgPowerOutput: getWeightCorrectedEntryAvgPowerOutput(entry),
  wcTotalPower: getWeightCorrectedEntryTotalPowerProduced(entry),
});

export const getFarthestEntry = (entryGroup: Entry[]) =>
  entryGroup.sort((a, b) => b.distance - a.distance)[0];

export const getEntryGroupAverageDistance = (entryGroup: Entry[]) =>
  getEntryGroupTotalDistance(entryGroup) / entryGroup.length;

export const getFastestEntry = (entryGroup: Entry[]) =>
  entryGroup.sort((a, b) => getEntryPace(b) - getEntryPace(a))[0];

export const entryGroupCalculations = (entryGroup: Entry[]) => ({
  avgPowerOutput: getEntryGroupAvgPowerOutput(entryGroup),
  avgPace: getEntryGroupAvgPace(entryGroup),
  totalPowerProduced: getEntryGroupTotalPowerProduced(entryGroup),
  totalDistance: getEntryGroupTotalDistance(entryGroup),
  averageDistance: getEntryGroupAverageDistance(entryGroup),
  fastestEntry: getFastestEntry(entryGroup),
});
