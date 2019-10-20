export const formatTimeMS = (totalSeconds: number) =>
  `${Math.floor(totalSeconds / 60)}:${
    totalSeconds % 60 < 10 ? "0" + (totalSeconds % 60) : totalSeconds % 60
  }`;
