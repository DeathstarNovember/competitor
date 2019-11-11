import React from "react";
import EntryPreview from "./EntryPreview";
import { Entry, User } from "../types";
import { MdPerson, MdPersonAdd, MdPeople } from "react-icons/md";
import { useMutation } from "@apollo/react-hooks";
import {
  LIST_USERS,
  CREATE_FOLLOW_LINK,
  DELETE_FOLLOW_LINK,
  DELETE_FOLLOW_LINK_W_USER_IDS,
} from "../util";

type GroupedEntryFeedProps = {
  entries: Entry[];
  currentUser: User;
};

const groupEntriesByDate = (arr: Entry[]) => {
  return arr.reduce((groups: { [key: string]: Entry[] }, item) => {
    const groupName = `${(new Date(item.completedAt).getMonth() + 1 < 10
      ? "0"
      : "") +
      (new Date(item.completedAt).getMonth() + 1)}-${new Date(
      item.completedAt
    ).getDate()}`;
    groups[groupName] = groups[groupName] || [];
    groups[groupName].push(item);
    return groups;
  }, {});
};

const groupEntriesByUser = (arr: Entry[]) => {
  return arr.reduce((groups: { [key: string]: Entry[] }, item) => {
    const groupName = `${item.user.firstName}_${item.user.lastName}`;
    groups[groupName] = groups[groupName] || [];
    groups[groupName].push(item);
    return groups;
  }, {});
};

type UserEntryGroupProps = {
  currentUser: User;
  entryGroup: Entry[];
  userKey: string;
};
const UserEntryGroup: React.FC<UserEntryGroupProps> = ({
  currentUser,
  entryGroup,
  userKey,
}) => {
  const entryGroupUser: User = entryGroup[0].user;
  const userLabel = `${entryGroupUser.firstName} ${entryGroupUser.lastName}`;
  const [createFollowMutation] = useMutation(CREATE_FOLLOW_LINK, {
    update(cache, { data: { createFollowLink } }) {
      const cachedData: { listUsers: User[] } | null = cache.readQuery({
        query: LIST_USERS,
      });

      const reuseableCachedUsers = cachedData
        ? cachedData.listUsers.filter(
            cachedUser =>
              cachedUser.id !== currentUser.id ||
              cachedUser.id !== createFollowLink.follower.id
          )
        : [];
      const updatedUserFollows = {
        ...currentUser,
        follows: [
          ...currentUser.follows,
          { id: createFollowLink.followed.id, __typename: "User" },
        ],
      };
      const newData = {
        listUsers: [...reuseableCachedUsers, updatedUserFollows],
      };
      cache.writeQuery({
        query: LIST_USERS,
        data: newData,
      });
    },
  });
  const [deleteFollowMutation] = useMutation(DELETE_FOLLOW_LINK_W_USER_IDS, {
    update(cache) {
      const cachedData: { listUsers: User[] } | null = cache.readQuery({
        query: LIST_USERS,
      });
      const updatedUserFollows = {
        ...currentUser,
        follows: [
          ...currentUser.follows.filter(
            follow => follow.id !== entryGroupUser.id
          ),
        ],
      };
      const newData = {
        listUsers: cachedData
          ? [
              ...cachedData.listUsers.filter(
                user => user.id !== currentUser.id
              ),
              updatedUserFollows,
            ]
          : [],
      };
      cache.writeQuery({
        query: LIST_USERS,
        data: newData,
      });
    },
  });
  const handleFollow = (followedUserId: number) => {
    createFollowMutation({
      variables: { followerId: currentUser.id, followedId: followedUserId },
    });
  };
  const handleUnFollow = (unfollowedUserId: number) => {
    deleteFollowMutation({
      variables: { followerId: currentUser.id, followedId: unfollowedUserId },
    });
  };
  const groupUserId = entryGroup[0].user.id;
  const mine = groupUserId === currentUser.id;
  const iFollow = mine
    ? false
    : currentUser.follows.map(f => f.id).includes(groupUserId);
  return (
    <div className={`bg-${mine ? "green" : "blue"}-200 mb-2`}>
      <div>
        <div className="flex justify-between">
          <div className="font-semibold p-2">{userLabel}</div>
          {mine ? (
            <MdPerson className="mt-3 mx-3" />
          ) : iFollow ? (
            <MdPeople
              className="mt-3 mx-3"
              onClick={() => handleUnFollow(groupUserId)}
            />
          ) : (
            <MdPersonAdd
              className="mt-3 mx-3"
              onClick={() => handleFollow(groupUserId)}
            />
          )}
        </div>
        {entryGroup.map((entry: Entry, entryId: number) => (
          <EntryPreview
            key={`${entry.user.id}${entryId}`}
            entry={entry}
            entryId={entryId}
            mine={mine}
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  );
};

const GroupedEntryFeed: React.FC<GroupedEntryFeedProps> = ({
  entries,
  currentUser,
}) => {
  const dateGroupedEntries: { [key: string]: Entry[] } = groupEntriesByDate(
    entries
  );
  return (
    <div>
      {Object.keys(dateGroupedEntries)
        .sort()
        .reverse()
        .map((dateKey: string) => {
          const userGroupedEntries = groupEntriesByUser(
            dateGroupedEntries[dateKey]
          );
          return (
            <div key={dateKey}>
              <div className="flex-1 text-lg font-bold underline">
                {dateKey}
              </div>
              {Object.keys(userGroupedEntries).map((userKey: string) => (
                <UserEntryGroup
                  key={`${userKey}${dateKey}`}
                  currentUser={currentUser}
                  entryGroup={userGroupedEntries[userKey]}
                  userKey={userKey}
                />
              ))}
            </div>
          );
        })}
    </div>
  );
};

export default GroupedEntryFeed;
