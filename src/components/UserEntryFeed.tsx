import React from "react";
import EntryPreview from "./EntryPreview";
import { Entry } from "../types";
import StatSummary from "./StatSummary";

type UserEntryFeedProps = {
  entries: Entry[];
};

const UserEntryFeed: React.FC<UserEntryFeedProps> = ({ entries }) => {
  return (
    <div className="mb-16">
      {entries.map((entry: Entry, entryId: number) => (
        <EntryPreview
          key={`${entry.user.id}${entryId}`}
          entry={entry}
          entryId={entryId}
        />
      ))}
    </div>
  );
};

export default UserEntryFeed;
