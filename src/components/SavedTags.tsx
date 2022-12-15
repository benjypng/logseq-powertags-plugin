import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";
import React, { useState } from "react";
import dbQuery from "../utils/dbQuery";

export default function SavedTags(props: {
  tag: string;
  properties: string[];
}) {
  const [warning, setWarning] = useState<boolean>(false);
  const [propertyInput, setPropertyInput] = useState<boolean>(false);
  const [property, setProperty] = useState<string>("");

  function toggle() {
    warning ? setWarning(false) : setWarning(true);
  }

  function cancel() {
    setWarning(false);
    setPropertyInput(false);
  }

  function deleteTag() {
    const savedTags = logseq.settings!.savedTags;
    delete savedTags[props.tag];

    logseq.updateSettings({ savedTags: "why can't a setting be deleted" });
    logseq.updateSettings({ savedTags: savedTags });

    logseq.hideMainUI();
  }

  async function applyAll() {
    let results = await dbQuery(props.tag, true);

    results = results.map((r: BlockEntity) => {
      logseq.settings!.savedTags[props.tag].map(async (t: string) => {
        await logseq.Editor.upsertBlockProperty(r.uuid, t, "...");
      });
    });

    setWarning(false);
    logseq.hideMainUI();
  }

  async function removeProperty(e) {
    let results = await dbQuery(props.tag, false);

    results = results.map(async (r: BlockEntity) => {
      await logseq.Editor.removeBlockProperty(r.uuid, e.target.id);
    });

    const properties = logseq.settings!.savedTags[props.tag];
    properties.splice(properties.indexOf(e.target.id), 1);
    logseq.updateSettings({
      savedTags: {
        [props.tag]: "why why why",
      },
    });

    logseq.updateSettings({
      savedTags: {
        [props.tag]: properties,
      },
    });

    logseq.hideMainUI();
  }

  function addProperty() {
    setPropertyInput(true);
  }

  async function saveProperty() {
    let properties = logseq.settings!.savedTags[props.tag];
    properties.push(property);

    logseq.updateSettings({
      savedTags: {
        [props.tag]: "why why why",
      },
    });

    logseq.updateSettings({
      savedTags: {
        [props.tag]: properties,
      },
    });

    let results = await dbQuery(props.tag, false);

    results = results.map(async (r: BlockEntity) => {
      await logseq.Editor.upsertBlockProperty(r.uuid, property, "...");
    });

    setPropertyInput(false);
    setProperty("");
    logseq.hideMainUI();
  }

  function handleForm(e: React.ChangeEvent<HTMLInputElement>) {
    setProperty(([e.target.name] = e.target.value));
  }

  return (
    <div className="bg-purple-200 rounded-lg p-3 mb-2 flex flex-row justify-between">
      {!warning && !propertyInput && (
        <React.Fragment>
          <div className="w-3/4 align-middle">
            <p className="font-bold mb-1">{props.tag}</p>
            {props.properties.map((p) => (
              <span className="mr-1 px-2 py-1 rounded-full text-xs bg-blue-500 text-white">
                {p}{" "}
                <button onClick={removeProperty} id={p}>
                  x
                </button>
              </span>
            ))}{" "}
            <button className="font-bold" onClick={addProperty}>
              +
            </button>
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

      {propertyInput && (
        <React.Fragment>
          <div className="w-3/4 align-middle">
            <p className="font-bold mb-1">
              <input
                id="text-field"
                type="text"
                name="property"
                value={property}
                onChange={handleForm}
                className="px-2 py-1 rounded-xl mb-3 w-2/3 h-6"
              />
            </p>
          </div>

          <div className="flex flex-col align-middle w-1/4 gap-2">
            <button
              onClick={saveProperty}
              className="text-white bg-gray-800 p-1 text-xs rounded-md"
            >
              Add Property
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
