import gql from "graphql-tag";
import {
  UserProfileFrag,
  InvitationFrag,
  CommentFrag,
  ObjectiveFrag,
  ChallengeFrag,
  EntryFrag,
  FollowLinkFrag,
} from "./fragments";
export const LIKE_ENTRY = gql`
  mutation LikeEntry($userId: Int!, $entryId: Int!) {
    likeEntry(userId: $userId, entryId: $entryId) {
      id
      entryId
      userId
    }
  }
`;

export const CREATE_CHALLENGE = gql`
  mutation CreateChallenge(
    $name: String
    $description: String
    $startDate: NaiveDateTime!
    $endDate: NaiveDateTime
    $duration: Int!
    $moderatorId: ID!
    $status: Int!
  ) {
    createChallenge(
      name: $name
      description: $description
      startDate: $startDate
      endDate: $endDate
      duration: $duration
      moderatorId: $moderatorId
      status: $status
    ) {
      ...Challenge
    }
  }
  ${ChallengeFrag}
`;

export const UPDATE_OBJECTIVE = gql`
  mutation UpdateObjective(
    $id: ID!
    $objectiveType: Int!
    $resultType: Int!
    $value: Int!
  ) {
    updateObjective(
      id: $id
      objectiveType: $objectiveType
      resultType: $resultType
      value: $value
    ) {
      ...Objective
    }
  }
  ${ObjectiveFrag}
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment(
    $userId: ID!
    $entryId: ID!
    $body: String!
    $visibility: Int!
  ) {
    createComment(
      userId: $userId
      entryId: $entryId
      body: $body
      visibility: $visibility
    ) {
      ...Comment
    }
  }
  ${CommentFrag}
`;

export const CREATE_FOLLOW_LINK = gql`
  mutation CreateFollowLink($followerId: ID!, $followedId: ID!) {
    createFollowLink(followerId: $followerId, followedId: $followedId) {
      ...FollowLink
    }
  }
  ${FollowLinkFrag}
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($id: ID!, $body: String!, $visibility: Int!) {
    updateComment(id: $id, body: $body, visibility: $visibility) {
      ...Comment
    }
  }
  ${CommentFrag}
`;

export const CREATE_ENTRY = gql`
  mutation CreateEntry(
    $userId: Int!
    $time: Int!
    $distance: Int!
    $strokeRate: Int!
    $userWeight: Float!
    $userHeight: Int!
    $completedAt: NaiveDateTime!
    $maxHr: Int
    $avgHr: Int
  ) {
    createEntry(
      userId: $userId
      time: $time
      distance: $distance
      strokeRate: $strokeRate
      completedAt: $completedAt
      userWeight: $userWeight
      userHeight: $userHeight
      maxHr: $maxHr
      avgHr: $avgHr
    ) {
      ...Entry
    }
  }
  ${EntryFrag}
`;

export const CREATE_INVITATION = gql`
  mutation CreateInvitation($inviteeId: ID!, $challengeId: ID!, $status: Int!) {
    createInvitation(
      inviteeId: $inviteeId
      challengeId: $challengeId
      status: $status
    ) {
      ...Invitation
    }
  }
  ${InvitationFrag}
`;

export const UPDATE_INVITATION = gql`
  mutation UpdateInvitation(
    $id: ID!
    $inviteeId: ID!
    $challengeId: ID!
    $status: Int!
    $responseId: ID
  ) {
    updateInvitation(
      id: $id
      inviteeId: $inviteeId
      challengeId: $challengeId
      status: $status
      responseId: $responseId
    ) {
      ...Invitation
    }
  }
  ${InvitationFrag}
`;

export const CREATE_USER = gql`
  mutation CreateUser(
    $dob: NaiveDateTime!
    $email: String!
    $firstName: String!
    $lastName: String!
    $bioSex: String!
    $username: String!
    $warCry: String!
    $currentWeight: Float!
    $currentHeight: Int!
  ) {
    createUser(
      dob: $dob
      email: $email
      firstName: $firstName
      lastName: $lastName
      bioSex: $bioSex
      username: $username
      warCry: $warCry
      currentWeight: $currentWeight
      currentHeight: $currentHeight
    ) {
      id
      ...UserProfile
    }
  }
  ${UserProfileFrag}
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $dob: NaiveDateTime!
    $email: String!
    $firstName: String!
    $lastName: String!
    $bioSex: String!
    $username: String!
    $warCry: String!
    $currentWeight: Float!
    $currentHeight: Int!
  ) {
    updateUser(
      id: $id
      dob: $dob
      email: $email
      firstName: $firstName
      lastName: $lastName
      bioSex: $bioSex
      username: $username
      warCry: $warCry
      currentWeight: $currentWeight
      currentHeight: $currentHeight
    ) {
      id
      ...UserProfile
    }
  }
  ${UserProfileFrag}
`;

export const UPDATE_ENTRY = gql`
  mutation UpdateEntry(
    $id: ID!
    $userId: Int!
    $time: Int!
    $distance: Int!
    $strokeRate: Int!
    $userWeight: Float!
    $userHeight: Int!
    $completedAt: NaiveDateTime!
    $maxHr: Int
    $avgHr: Int
  ) {
    updateEntry(
      id: $id
      userId: $userId
      time: $time
      distance: $distance
      strokeRate: $strokeRate
      completedAt: $completedAt
      userWeight: $userWeight
      userHeight: $userHeight
      maxHr: $maxHr
      avgHr: $avgHr
    ) {
      ...Entry
    }
  }
  ${EntryFrag}
`;

export const DELETE_ENTRY = gql`
  mutation deleteEntry($id: ID!) {
    deleteEntry(id: $id)
  }
`;

export const DELETE_COMMENT = gql`
  mutation deleteComment($id: ID!) {
    deleteComment(id: $id)
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($id: ID!) {
    deleteUSER(id: $id)
  }
`;
export const DELETE_FOLLOW_LINK = gql`
  mutation deleteFollowLink($id: ID!) {
    deleteFollowLink(id: $id)
  }
`;
export const DELETE_FOLLOW_LINK_W_USER_IDS = gql`
  mutation DeleteFollowWithIds($followerId: ID!, $followedId: ID!) {
    deleteFollowLinkWithIds(followedId: $followedId, followerId: $followerId)
  }
`;

export const UNLIKE_ENTRY = gql`
  mutation unlikeEntry($id: ID!) {
    unlikeEntry(id: $id)
  }
`;
