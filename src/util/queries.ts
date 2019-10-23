import gql from "graphql-tag";
export const LIST_ENTRIES = gql`
  {
    listEntries {
      id
      user {
        id
        firstName
        lastName
        currentWeight
      }
      userWeight
      distance
      time
      strokeRate
      completedAt
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
    $completedAt: NaiveDateTime!
  ) {
    createEntry(
      userId: $userId
      time: $time
      distance: $distance
      strokeRate: $strokeRate
      completedAt: $completedAt
      userWeight: $userWeight
    ) {
      id
      user {
        id
        firstName
        lastName
        currentWeight
      }
      time
      distance
      strokeRate
      userWeight
    }
  }
`;

export const DELETE_ENTRY = gql`
  mutation deleteEntry($id: ID!) {
    deleteEntry(id: $id)
  }
`;

export const LIST_USERS = gql`
  {
    list_users {
      id
      firstName
      lastName
      currentWeight
    }
  }
`;
