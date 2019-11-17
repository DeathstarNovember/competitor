import gql from "graphql-tag";

export const UserFollowsFrag = gql`
  fragment UserFollows on User {
    follows {
      id
      firstName
      lastName
    }
  }
`;
export const FollowLinkFrag = gql`
  fragment FollowLink on FollowLink {
    follower {
      id
      firstName
      LastName
    }
    followed {
      id
      firstName
      lastName
    }
  }
`;
export const UserFollowersFrag = gql`
  fragment UserFollowers on User {
    followers {
      id
      firstName
      lastName
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
      firstName
      lastName
      username
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

export const InvitationIviteeFrag = gql`
  fragment InvitationInvitee on Invitation {
    invitee {
      id
      firstName
      lastName
      username
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
export const InvitationChallengeFrag = gql`
  fragment InvitationChallenge on Invitation {
    challenge {
      id
      name
      description
      status
      startDate
      endDate
      duration
    }
  }
`;
export const InvitationFrag = gql`
  fragment Invitation on Invitation {
    status
    ...InvitationChallenge
    ...InvitationInvitee
    ...InvitationResponse
  }
  ${InvitationIviteeFrag}
  ${InvitationResponseFrag}
  ${InvitationChallengeFrag}
`;
export const EntryFrag = gql`
  fragment Entry on Entry {
    ...EntryDetails
    ...EntryUser
    ...EntryComments
    ...EntryLikes
    invitations {
      id
      status
      invitee {
        id
      }
    }
  }
  ${EntryDetailsFrag}
  ${EntryUserFrag}
  ${EntryCommentsFrag}
  ${EntryLikesFrag}
`;

export const ChallengeInfoFrag = gql`
  fragment ChallengeInfo on Challenge {
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
    moderator {
      id
      bioSex
      currentWeight
      currentHeight
      dob
      email
      warCry
      firstName
      lastName
      username
      follows {
        id
        firstName
        lastName
      }
    }
  }
`;
export const ObjectiveDetailsFrag = gql`
  fragment ObjectiveDetails on Objective {
    objectiveType
    resultType
    value
  }
`;
export const ObjectiveChallengeFrag = gql`
  fragment ObjectiveChallenge on Objective {
    challenge {
      id
      name
      description
      status
      startDate
      endDate
      duration
      invitations {
        id
      }
    }
  }
`;
export const ObjectiveFrag = gql`
  fragment Objective on Objective {
    ...ObjectiveDetails
    ...ObjectiveChallenge
  }
  ${ObjectiveDetailsFrag}
  ${ObjectiveChallengeFrag}
`;
export const ChallengeObjectiveFrag = gql`
  fragment ChallengeObjective on Challenge {
    objective {
      id
      ...ObjectiveDetails
      ...ObjectiveChallenge
    }
  }
  ${ObjectiveDetailsFrag}
  ${ObjectiveChallengeFrag}
`;
export const ChallengeInvitationsFrag = gql`
  fragment ChallengeInvitations on Challenge {
    invitations {
      id
      status
      challenge {
        id
      }
      ...InvitationResponse
      invitee {
        id
        firstName
      }
    }
  }
  ${InvitationResponseFrag}
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
