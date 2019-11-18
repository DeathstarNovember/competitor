import { Entry } from "../types";
export const getEntryAvgPowerOutput = (entry: Entry) =>
  2.8 / Math.pow(entry.time / entry.distance, 3);

export const getEntryTotalPowerProduced = (entry: Entry) =>
  getEntryAvgPowerOutput(entry) * entry.time;

export const getEntryPace = (entry: Entry) => entry.distance / entry.time;

export const getEntryGroupAvgPowerOutput = (entryGroup: Entry[]) =>
  entryGroup
    .map(entry => getEntryAvgPowerOutput(entry))
    .reduce((acc, curr) => acc + curr) / entryGroup.length;

export const getEntryGroupAvgPace = (entryGroup: Entry[]) =>
  entryGroup
    .map(entry => getEntryPace(entry))
    .reduce((acc, curr) => acc + curr) / entryGroup.length;

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
  2.8 / Math.pow(getWeightCorrectedTime(entry) / entry.distance, 3);

export const getWeightCorrectedEntryTotalPowerProduced = (entry: Entry) =>
  getWeightCorrectedEntryAvgPowerOutput(entry) * getWeightCorrectedTime(entry);

export type WeightCorrectedEntryCalculations = {
  wcTime: number;
  wcDistance: number;
  wcPace: number;
  wcAvgPowerOutput: number;
  wcTotalPower: number;
};
export type EntryCalculations = WeightCorrectedEntryCalculations & {
  entry: Entry;
  pace: number;
  avgPowerOutput: number;
  totalPower: number;
};
export const entryCalculations = (entry: Entry) => ({
  entry,
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

export const getHighestPowerOutputEntry = (entryGroup: Entry[]) =>
  entryGroup
    .map(entry => ({ entry, avgPowerOutput: getEntryAvgPowerOutput(entry) }))
    .sort((a, b) => b.avgPowerOutput - a.avgPowerOutput)[0].entry;
export const getMostPowerProducedEntry = (entryGroup: Entry[]) =>
  entryGroup
    .map(entry => ({
      entry,
      totalPowerProduced: getEntryTotalPowerProduced(entry),
    }))
    .sort((a, b) => b.totalPowerProduced - a.totalPowerProduced)[0].entry;

export const entryGroupCalculations = (entryGroup: Entry[]) => ({
  entryGroup,
  avgPowerOutput: getEntryGroupAvgPowerOutput(entryGroup),
  avgPace: getEntryGroupAvgPace(entryGroup),
  totalPowerProduced: getEntryGroupTotalPowerProduced(entryGroup),
  totalDistance: getEntryGroupTotalDistance(entryGroup),
  averageDistance: getEntryGroupAverageDistance(entryGroup),
  fastestEntry: getFastestEntry(entryGroup),
  farthestEntry: getFarthestEntry(entryGroup),
  highestPowerOutputEntry: getHighestPowerOutputEntry(entryGroup),
  mostPowerProducedEntry: getMostPowerProducedEntry(entryGroup),
});
