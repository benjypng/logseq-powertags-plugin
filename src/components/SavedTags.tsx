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
    <div>
      <div className="bg-white rounded-lg p-3 mb-2 flex flex-row justify-between">
        {!warning && (
          <div className="flex flex-row justify-between w-full">
            <div className="w-3/4 align-middle">
              <h5 className="mt-0 mb-4 text-xl font-medium leading-tight text-primary">
                {props.tag}

                {!propertyInput && (
                  <span
                    onClick={addProperty}
                    className="ml-4 cursor-pointer whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.65em] pt-[0.35em] pb-[0.25em] text-center align-baseline text-[0.6em] font-bold leading-none text-primary-700"
                  >
                    Add Property
                  </span>
                )}
              </h5>
              <div className="flex flex-wrap gap-2">
                {props.properties.map((p) => (
                  <div className="flex flex-row border-2 border-primary">
                    <div className="px-3">{p}</div>
                    <button
                      onClick={removeProperty}
                      id={p}
                      className="bg-primary text-white px-2"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-1/4 flex flex-col gap-2 justify-center align-middle">
              <button
                onClick={toggle}
                type="button"
                className="inline-block rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
              >
                Apply All
              </button>
              <button
                onClick={deleteTag}
                type="button"
                className="inline-block rounded bg-danger px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {warning && (
          <div className="flex flex-row justify-between w-full bg-white">
            <div className="w-3/4 align-middle">
              <p className="font-bold text-red-600">
                Are you sure? This process is irreversible.
              </p>
            </div>
            <div className="flex flex-col align-middle w-1/4 gap-2">
              <button
                onClick={applyAll}
                type="button"
                className="inline-block rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
              >
                Apply All
              </button>
              <button
                onClick={cancel}
                type="button"
                className="inline-block rounded bg-danger px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {propertyInput && (
        <div className="flex flex-row justify-between w-full bg-white p-3">
          <div
            className="relative mb-3 mt-5 w-3/4 align-middle pr-5"
            data-te-input-wrapper-init
          >
            <input
              type="text"
              value={property}
              onChange={handleForm}
              className="peer block min-h-[auto] rounded w-full border-b-primary bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-black dark:placeholder:text-black [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
              id="text-field"
            />
            <label
              htmlFor="text-field"
              className="pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-black transition-all duration-200 ease-out peer-focus:-translate-y-[1.3rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.3rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-gray-500 dark:peer-focus:text-gray-500"
            >
              Enter property for {props.tag}
            </label>
          </div>

          <div className="flex flex-col align-middle w-1/4 gap-2">
            <button
              onClick={saveProperty}
              type="button"
              className="inline-block rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
            >
              Save Property
            </button>
            <button
              onClick={cancel}
              type="button"
              className="inline-block rounded bg-danger px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
