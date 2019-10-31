import React from "react";
import EntryPreview from "./EntryPreview";
import { Entry, User } from "../types";

type PublicEntryFeedProps = {
  entries: Entry[];
  currentUser?: User;
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

const PublicEntryFeed: React.FC<PublicEntryFeedProps> = ({
  entries,
  currentUser,
}) => {
  const dateGroupedEntries: { [key: string]: Entry[] } = groupEntriesByDate(
    entries
  );
  return (
    <div className="mb-16">
      {Object.keys(dateGroupedEntries)
        .sort()
        .reverse()
        .map((dateKey: string) => {
          const userGroupedEntries = groupEntriesByUser(
            dateGroupedEntries[dateKey]
          );
          return (
            <div key={dateKey}>
              {/* <div className="flex-1 bg-blue-400 rounded-lg p-2 mb-1 text-l">
                {dateKey}
              </div> */}
              {Object.keys(userGroupedEntries).map((userKey: string) => (
                <div key={`${userKey}${dateKey}`} className="bg-blue-200 mb-2">
                  <div>
                    {/* <div className="bg-blue-200 rounded-lg p-2 m-1">
                      {userKey.replace(/_/, " ")}
                    </div> */}
                    {userGroupedEntries[userKey].map(
                      (entry: Entry, entryId: number) => (
                        <EntryPreview
                          key={`${entry.user.id}${entryId}`}
                          entry={entry}
                          entryId={entryId}
                          mine={
                            currentUser
                              ? currentUser.id === entry.user.id
                              : false
                          }
                        />
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
    </div>
  );
};

export default PublicEntryFeed;
