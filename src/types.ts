export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  username: string;
  bioSex: string;
  currentWeight: number;
  currentHeight: number;
  warCry: string;
  biology: string;
};
export type Like = {
  id: number;
  userId: number;
  entryId: number;
};

export type Entry = {
  id: number;
  user: User;
  likes: Like[];
  userWeight: number;
  userHeight: number;
  distance: number;
  time: number;
  strokeRate: number;
  completedAt: string;
  maxHr?: number;
  avgHr?: number;
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
