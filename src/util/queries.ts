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
    }
  }
`;

export const LIST_USERS = gql`
  {
    list_users {
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
