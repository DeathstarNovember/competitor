import gql from "graphql-tag";
export const LIST_ENTRIES = gql`
  {
    listEntries {
      id
      user {
        id
        firstName
        lastName
        bioSex
        currentWeight
        currentHeight
        follows {
          id
        }
        warCry
      }
      likes {
        id
        userId
      }
      comments {
        id
        user {
          id
          firstName
        }
        entry {
          id
        }
        body
        insertedAt
        updatedAt
        visibility
      }
      userWeight
      userHeight
      distance
      time
      strokeRate
      completedAt
      maxHr
      avgHr
    }
  }
`;

export const LIKE_ENTRY = gql`
  mutation LikeEntry($userId: Int!, $entryId: Int!) {
    likeEntry(userId: $userId, entryId: $entryId) {
      id
      entryId
      userId
    }
  }
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
      id
      entry {
        id
      }
      user {
        id
        firstName
      }
      insertedAt
      updatedAt
      body
      visibility
    }
  }
`;

export const CREATE_FOLLOW_LINK = gql`
  mutation CreateFollowLink($followerId: ID!, $followedId: ID!) {
    createFollowLink(followerId: $followerId, followedId: $followedId) {
      id
      follower {
        id
      }
      followed {
        id
      }
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($id: ID!, $body: String!, $visibility: Int!) {
    updateComment(id: $id, body: $body, visibility: $visibility) {
      id
      entry {
        id
      }
      user {
        id
        firstName
      }
      body
      visibility
    }
  }
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
      id
      user {
        id
        firstName
        lastName
        bioSex
        currentWeight
        currentHeight
      }
      time
      distance
      strokeRate
      userWeight
      userHeight
      maxHr
      avgHr
      completedAt
    }
  }
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
      firstName
      lastName
      dob
      bioSex
      email
      username
      warCry
      currentWeight
      currentHeight
    }
  }
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
      firstName
      lastName
      bioSex
      email
      dob
      username
      warCry
      currentWeight
      currentHeight
    }
  }
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
      id
      user {
        id
        firstName
        lastName
        bioSex
        currentWeight
        currentHeight
      }
      time
      distance
      strokeRate
      userWeight
      userHeight
      maxHr
      avgHr
    }
  }
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

export const GET_USER = gql`
  query getUser($id: ID!) {
    getUser(id: $id) {
      id
      firstName
      lastName
      dob
      bioSex
      email
      username
      warCry
      currentWeight
      currentHeight
      follows {
        id
      }
    }
  }
`;

export const GET_USER_FOLLOWS = gql`
  query getUserFollows($id: ID!) {
    getUser(id: $id) {
      follows {
        id
      }
    }
  }
`;
export const GET_USER_FOLLOWERS = gql`
  query getUserFollowers($id: ID!) {
    getUser(id: $id) {
      followers {
        id
      }
    }
  }
`;

export const LIST_USERS = gql`
  {
    listUsers {
      id
      firstName
      lastName
      currentWeight
      currentHeight
      warCry
      follows {
        id
      }
    }
  }
`;
