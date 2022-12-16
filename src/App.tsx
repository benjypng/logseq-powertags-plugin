import "@logseq/libs";
import React, { useEffect, useState } from "react";
import "./App.css";
import SavedTags from "./components/SavedTags";

export default function App(props: { savedTags: any[] }) {
  const [savedTags, setSavedTags] = useState<any[]>([]);

  useEffect(function () {
    setSavedTags(props.savedTags);
  });

  return (
    <div className="flex justify-end px-3" id="container" tabIndex={-1}>
      <div className="absolute top-10 bg-white rounded-lg p-3 w-1/2 border text-sm">
        {/* Start content here */}
        <h1 className="mb-3 text-black text-xl">Manage Power Tags</h1>
        {savedTags.length > 0 &&
          savedTags.map((t) => (
            <SavedTags tag={t.tag} properties={t.properties} />
          ))}
        {savedTags.length < 1 && (
          <p>
            You have no power tags saved. Start by type /Create power tag on a
            block with a tag that you want to convert to a power tag
          </p>
        )}
        {/* End content here */}
      </div>
    </div>
  );
}
