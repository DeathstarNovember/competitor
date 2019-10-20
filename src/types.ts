export type User = {
  id: number;
  firstName: string;
  lastName: string;
  currentWeight: number;
};

export type Entry = {
  user: User;
  userWeight: number;
  date: Date;
  distance: number;
  time: number;
  strokeRate: number;
  completedAt: Date;
};

// type Result = {
//   rank: number;
//   competitorId: number;
//   entries: ContestEntry[];
// };

export enum Metrics {
  Distance, // m
  Time, // s
}

type Contest = {
  name: string;
  metric: Metrics;
  objective: number;
  description?: string;
};

// enum IntervalTypes {
//   Seconds,
//   Minutes,
//   Hours,
//   Days,
//   Weeks,
//   Months,
//   Years,
// }

// export type Comp = {
//   name: string;
//   active: Boolean;
//   contests: Contest[];
//   competitors: Competitor[];
// };
