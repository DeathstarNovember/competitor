import React from "react";
import EntryPreview from "./EntryPreview";
import { Entry } from "../types";

type PublicEntryFeedProps = {
  entries: Entry[];
};

const PublicEntryFeed: React.FC<PublicEntryFeedProps> = ({ entries }) => {
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

export default PublicEntryFeed;
