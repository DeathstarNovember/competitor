import gql from "graphql-tag";
import {
  UserProfileFrag,
  UserFollowsFrag,
  UserFollowersFrag,
  ChallengeFrag,
  EntryFrag,
  InvitationFrag,
} from "./fragments";

export const LIST_ENTRIES = gql`
  {
    listEntries {
      id
      ...Entry
    }
  }
  ${EntryFrag}
`;

export const LIST_CHALLENGES = gql`
  {
    listChallenges {
      id
      ...Challenge
    }
  }
  ${ChallengeFrag}
`;

export const GET_CHALLENGE = gql`
  query getChallenge($id: ID!) {
    getChallenge(id: $id) {
      id
      ...Challenge
    }
  }
  ${ChallengeFrag}
`;
export const GET_INVITATION = gql`
  query getInvitation($id: ID!) {
    getInvitation(id: $id) {
      id
      ...Invitation
    }
  }
  ${InvitationFrag}
`;

export const GET_USER = gql`
  query getUser($id: ID!) {
    getUser(id: $id) {
      id
      ...UserProfile
      ...UserFollows
    }
  }
  ${UserProfileFrag}
  ${UserFollowsFrag}
`;

export const GET_USER_FOLLOWS = gql`
  query getUserFollows($id: ID!) {
    getUser(id: $id) {
      id
      ...UserFollows
    }
  }
  ${UserFollowsFrag}
`;
export const GET_USER_FOLLOWERS = gql`
  query getUserFollowers($id: ID!) {
    getUser(id: $id) {
      id
      ...UserFollowers
    }
  }
  ${UserFollowersFrag}
`;

export const LIST_USERS = gql`
  {
    listUsers {
      id
      ...UserProfile
      ...UserFollows
    }
  }
  ${UserProfileFrag}
  ${UserFollowsFrag}
`;
