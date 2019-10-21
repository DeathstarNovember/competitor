import { Entry } from "../types";

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
