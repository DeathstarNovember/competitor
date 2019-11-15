import { Challenge, User } from "./types";
import {
  InviteStatus,
  ChallengeStatus,
  ObjectiveTypes,
  ResultTypes,
} from "./enums";

const sampleUser: User = {
  id: 0,
  firstName: "Sample",
  lastName: "User",
  email: "sample.user@example.com",
  dob: "[01-01-1990T00:00:00]",
  username: "Sample User",
  bioSex: "male",
  currentWeight: 0,
  currentHeight: 0,
  warCry: "War cry!",
  biology: "male",
  followers: [],
  follows: [],
  challenges: [],
  invitations: [],
};

const sampleChallenge: Challenge = {
  id: 0,
  moderator: { ...sampleUser, id: 0 },
  invitations: [
    {
      id: 1,
      invitee: { ...sampleUser, id: 1 },
      status: InviteStatus.PENDING,
    },
    {
      id: 2,
      invitee: { ...sampleUser, id: 2 },
      status: InviteStatus.PENDING,
    },
  ],
  status: ChallengeStatus.PENDING,
  objective: {
    id: 1,
    objectiveType: ObjectiveTypes.DISTANCE,
    resultType: ResultTypes.TIME,
    value: 500,
  },

  startDate: "[01-01-2019T00:00:00]",
  duration: 7,
  name: "",
  endDate: "[01-08-2019T00:00:00]",
  description: "",
};

export const sampleChallenges: Challenge[] = [
  {
    ...sampleChallenge,
    id: 0,
    name: "Sample Challenge 1",
    moderator: { ...sampleUser, id: 0 },
    invitations: [
      {
        id: 1,
        invitee: { ...sampleUser, id: 1 },
        status: InviteStatus.PENDING,
      },
      {
        id: 2,
        invitee: { ...sampleUser, id: 2 },
        status: InviteStatus.PENDING,
      },
    ],
    status: ChallengeStatus.PENDING,
    objective: {
      id: 0,
      objectiveType: ObjectiveTypes.DISTANCE,
      resultType: ResultTypes.TIME,
      value: 500,
    },
  },
  {
    ...sampleChallenge,
    id: 1,
    name: "Sample Challenge 2",
    moderator: { ...sampleUser, id: 1 },
    invitations: [
      {
        id: 3,
        invitee: { ...sampleUser, id: 0 },
        status: InviteStatus.PENDING,
      },
      {
        id: 4,
        invitee: { ...sampleUser, id: 2 },
        status: InviteStatus.PENDING,
      },
    ],
    status: ChallengeStatus.PENDING,
    objective: {
      id: 1,
      objectiveType: ObjectiveTypes.DISTANCE,
      resultType: ResultTypes.TIME,
      value: 1000,
    },
  },
  {
    ...sampleChallenge,
    id: 2,
    name: "Sample Challenge 3",
    moderator: { ...sampleUser, id: 2 },
    invitations: [
      {
        id: 5,
        invitee: { ...sampleUser, id: 0 },
        status: InviteStatus.PENDING,
      },
      {
        id: 6,
        invitee: { ...sampleUser, id: 1 },
        status: InviteStatus.PENDING,
      },
    ],
    status: ChallengeStatus.PENDING,
    objective: {
      id: 2,
      objectiveType: ObjectiveTypes.DISTANCE,
      resultType: ResultTypes.TIME,
      value: 1500,
    },
  },
];
