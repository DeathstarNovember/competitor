import gql from "graphql-tag";

export const UserFollowsFrag = gql`
  fragment UserFollows on User {
    follows {
      id
    }
  }
`;
export const FollowLinkFrag = gql`
  fragment FollowLink on FollowLink {
    id
    follower {
      id
    }
    followed {
      id
    }
  }
`;
export const UserFollowersFrag = gql`
  fragment UserFollowers on User {
    followers {
      id
    }
  }
`;
export const EntryLikesFrag = gql`
  fragment EntryLikes on Entry {
    likes {
      id
      userId
    }
  }
`;
export const UserNamesFrag = gql`
  fragment UserNames on User {
    firstName
    lastName
    username
  }
`;
export const CommentUserFrag = gql`
  fragment CommentUser on Comment {
    user {
      id
      ...UserNames
    }
  }
`;
export const CommentEntryFrag = gql`
  fragment CommentEntry on Comment {
    entry {
      id
    }
  }
`;
export const CommentDetailsFrag = gql`
  fragment CommentDetails on Comment {
    body
    insertedAt
    updatedAt
    visibility
  }
`;
export const CommentFrag = gql`
  fragment Comment on Comment {
    id
    ...CommentDetails
    ...CommentUser
    ...CommentEntry
  }
  ${CommentDetailsFrag}
  ${CommentUserFrag}
  ${CommentEntryFrag}
`;
export const EntryCommentsFrag = gql`
  fragment EntryComments on Entry {
    comments {
      ...Comment
    }
  }
  ${CommentFrag}
`;

export const UserProfileFrag = gql`
  fragment UserProfile on User {
    bioSex
    currentWeight
    currentHeight
    dob
    email
    warCry
    ...UserNames
  }
  ${UserNamesFrag}
`;
export const EntryDetailsFrag = gql`
  fragment EntryDetails on Entry {
    userWeight
    userHeight
    distance
    time
    strokeRate
    completedAt
    maxHr
    avgHr
  }
`;
export const EntryFrag = gql`
  fragment Entry on Entry {
    id
    ...EntryDetails
    ...EntryUser
    ...EntryComments
    ...EntryLikes
  }
`;
export const InvitationIviteeFrag = gql`
  fragment InvitationInvitee on Invitation {
    invitee {
      id
      ...UserNames
    }
  }
  ${UserNamesFrag}
`;

export const EntryUserFrag = gql`
  fragment EntryUser on Entry {
    user {
      id
      ...UserProfile
      ...UserFollows
    }
  }
  ${UserProfileFrag}
  ${UserFollowsFrag}
`;
export const InvitationResponseFrag = gql`
  fragment InvitationResponse on Invitation {
    response {
      id
      ...EntryDetails
    }
  }
  ${EntryDetailsFrag}
`;
export const InvitationFrag = gql`
  fragment Invitation on Invitation {
    id
    status
    ...InvitationInvitee
    ...InvitationResponse
  }
  ${InvitationIviteeFrag}
  ${InvitationResponseFrag}
`;
export const ObjectiveDetailsFrag = gql`
  fragment ObjectiveDetails on Objective {
    id
    objectiveType
    resultType
    value
  }
`;
export const ObjectiveFrag = gql`
  fragment Objective on Objective {
    id
    ...ObjectiveDetails
  }
  ${ObjectiveDetailsFrag}
`;
export const ChallengeInfoFrag = gql`
  fragment ChallengeInfo on Challenge {
    id
    name
    description
    status
    startDate
    endDate
    duration
  }
`;
export const ChallengeModeratorFrag = gql`
  fragment ChallengeModerator on Challenge {
    ...UserProfile
  }
  ${UserProfileFrag}
`;
export const ChallengeObjectiveFrag = gql`
  fragment ChallengeObjective on Challenge {
    objective {
      ...ObjectiveDetails
    }
  }
  ${ObjectiveDetailsFrag}
`;
export const ChallengeInvitationsFrag = gql`
  fragment ChallengeInvitations on Challenge {
    invitations {
      id
      status
      invitee {
        id
        firstName
      }
    }
  }
`;
export const ChallengeFrag = gql`
  fragment Challenge on Challenge {
    ...ChallengeInfo
    ...ChallengeModerator
    ...ChallengeObjective
    ...ChallengeInvitations
  }
  ${ChallengeInfoFrag}
  ${ChallengeObjectiveFrag}
  ${ChallengeInvitationsFrag}
  ${ChallengeModeratorFrag}
`;
