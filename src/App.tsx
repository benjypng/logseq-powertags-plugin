import "@logseq/libs";
import React, { useEffect, useState } from "react";
import "./App.css";
import SavedTags from "./components/SavedTags";
//let blk = await logseq.DB.datascriptQuery(`
//[:find (pull ?b [*])
//    :where
//        [?b :block/path-refs [:block/name "${props.tag}"]]]
//`);
export default function App(props: { savedTags: any[] }) {
  const [savedTags, setSavedTags] = useState<any[]>([]);

  useEffect(function () {
    setSavedTags(props.savedTags);
    console.log(savedTags);
  });

  return (
    <div className="flex justify-end border border-black px-3" tabIndex={-1}>
      <div className="absolute top-10 bg-white rounded-lg p-3 w-1/3 border text-sm">
        {/* Start content here */}
        <h1 className="mb-3 text-black text-xl">Manage Power Tags</h1>
        {savedTags.map((t) => (
          <SavedTags tag={t.tag} properties={t.properties} />
        ))}
        {/* End content here */}
      </div>
    </div>
  );
}
