import gql from "graphql-tag";
import {
  UserProfileFrag,
  UserFollowsFrag,
  UserFollowersFrag,
  EntryDetailsFrag,
  EntryUserFrag,
  EntryLikesFrag,
  EntryCommentsFrag,
  ChallengeFrag,
} from "./fragments";

export const LIST_ENTRIES = gql`
  {
    listEntries {
      id
      ...EntryUser
      ...EntryLikes
      ...EntryComments
      ...EntryDetails
    }
  }
  ${EntryUserFrag}
  ${EntryLikesFrag}
  ${EntryCommentsFrag}
  ${EntryDetailsFrag}
`;

export const LIST_CHALLENGES = gql`
  {
    listChallenges {
      ...Challenge
    }
  }
  ${ChallengeFrag}
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
