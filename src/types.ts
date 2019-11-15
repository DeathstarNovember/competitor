import {
  Visibility,
  ObjectiveTypes,
  InviteStatus,
  ChallengeStatus,
  ResultTypes,
} from "./enums";

export type Follow = {
  id: number;
  followerId: number;
  followedId: number;
};
export type UserFollow = {
  id: number;
  __typename: string;
};
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
  followers: UserFollow[];
  follows: UserFollow[];
  invitations?: ChallengeInvite[];
  challenges?: Challenge[];
};

export type Like = {
  id: number;
  userId: number;
  entryId: number;
};
export type Comment = {
  id: number;
  user: { id: number; firstName: string };
  entry: { id: number };
  body: string;
  visibility: Visibility;
  insertedAt: string;
  updatedAt: string;
};

export type Entry = {
  id: number;
  user: User;
  likes: Like[];
  comments: Comment[];
  userWeight: number;
  userHeight: number;
  distance: number;
  time: number;
  strokeRate: number;
  completedAt: string;
  maxHr?: number;
  avgHr?: number;
};

export type ChallengeObjective = {
  id: number;
  objectiveType: ObjectiveTypes;
  resultType: ResultTypes;
  value: number;
};

export type ChallengeInvite = {
  id: number;
  invitee: User;
  status: InviteStatus;
};
export type Challenge = {
  id: number;
  moderator: User;
  invitations: ChallengeInvite[];
  status: ChallengeStatus;
  objective: ChallengeObjective;
  startDate: string;
  duration: number;
  name?: string;
  endDate?: string;
  description?: string;
};
