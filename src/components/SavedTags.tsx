import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";
import React, { useState } from "react";

export default function SavedTags(props: {
  tag: string;
  properties: string[];
}) {
  const [warning, setWarning] = useState(false);

  function toggle() {
    warning ? setWarning(false) : setWarning(true);
  }

  function cancel() {
    setWarning(false);
  }

  function deleteTag() {
    const savedTags = logseq.settings!.savedTags;
    delete savedTags[props.tag];

    logseq.updateSettings({ savedTags: "why can't a setting be deleted" });
    logseq.updateSettings({ savedTags: savedTags });

    logseq.hideMainUI();
  }

  async function applyAll() {
    let results = await logseq.DB.datascriptQuery(`
				[:find (pull ?b [*])
    		 :where
         [?b :block/path-refs [:block/name "${props.tag.substring(1)}"]]]
`);

    results = results
      .map((r: BlockEntity[]) => r[0])
      .filter((r: BlockEntity) => r.content !== props.tag)
      .filter((r: BlockEntity) => Object.keys(r.properties!).length === 0)
      .map((r: BlockEntity) => {
        logseq.settings!.savedTags[props.tag].map(async (t: string) => {
          await logseq.Editor.upsertBlockProperty(r.uuid, t, "...");
        });
      });

    setWarning(false);
    logseq.hideMainUI();
  }

  return (
    <div className="bg-purple-200 rounded-lg p-3 mb-2 flex flex-row justify-between">
      {!warning && (
        <React.Fragment>
          <div className="w-3/4 align-middle">
            <p className="font-bold mb-1">{props.tag}</p>
            {props.properties.map((p) => (
              <span className="mr-1 px-2 py-1 rounded-full text-xs bg-blue-500 text-white">
                {p}
              </span>
            ))}
          </div>

          <div className="flex flex-col align-middle w-1/4 gap-2">
            <button
              onClick={toggle}
              className="text-white bg-gray-800 p-1 text-xs rounded-md"
            >
              Apply All
            </button>
            <button
              onClick={deleteTag}
              className="text-white bg-red-500 p-1 text-xs rounded-md"
            >
              Delete
            </button>
          </div>
        </React.Fragment>
      )}

      {warning && (
        <React.Fragment>
          <div className="w-3/4 align-middle">
            <p className="font-bold mb-1">
              Are you sure? This process is irreversible.
            </p>
          </div>

          <div className="flex flex-col align-middle w-1/4 gap-2">
            <button
              onClick={applyAll}
              className="text-white bg-gray-800 p-1 text-xs rounded-md"
            >
              Yes
            </button>
            <button
              onClick={cancel}
              className="text-white bg-red-500 p-1 text-xs rounded-md"
            >
              Cancel
            </button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
