import React, { useEffect, useState } from "react";

export default function CreateTag(props: { tag: string | number }) {
  const [tag, setTag] = useState<string | number>();
  const [properties, setProperties] = useState<string>("");
  const [propertyList, setPropertyList] = useState<string[]>([]);
  const [repeatTag, setRepeatTag] = useState<boolean>(false);

  useEffect(function () {
    setTag(props.tag);
    if (logseq.settings!.savedTags[props.tag]) {
      setRepeatTag(true);
    } else {
      setRepeatTag(false);
    }
  });

  function handleForm(e: React.ChangeEvent<HTMLInputElement>) {
    setProperties(([e.target.name] = e.target.value));
  }

  function handleSubmit(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (properties === "") {
        logseq.UI.showMsg(
          "Please key in at least one property or ensure a tag is selected",
          "error"
        );
        return;
      } else {
        const arr: string[] = properties
          .trim()
          .split(",")
          .map((p) => p.trim());
        setPropertyList((prevState) => [...prevState, ...arr]);
        setProperties("");
      }
    }
  }

  function saveProperty() {
    if (propertyList.length === 0) {
      logseq.UI.showMsg(
        "Please key in at least one property or ensure a tag is selected",
        "error"
      );
      return;
    } else {
      let tagsObj = logseq.settings!.savedTags;

      tagsObj[props.tag] = propertyList;

      logseq.updateSettings({
        savedTags: tagsObj,
      });

      setPropertyList([]);
      logseq.hideMainUI();
    }
  }
  return (
    <div className="flex justify-center px-3" tabIndex={-1} id="container">
      <div className="absolute top-10 bg-white rounded-lg p-3 w-100 border">
        <div className="bg-white rounded-lg p-3 mb-2">
          <h5 className="mt-0 mb-4 text-xl font-medium leading-tight text-primary">
            Create Power Tags for {tag}
          </h5>

          {repeatTag && (
            <p className="mb-2">
              You have already created a power tag for this tag.
            </p>
          )}
          {!repeatTag && tag === -1 && (
            <p className="mb-2">You have not selected a tag.</p>
          )}

          {!repeatTag && tag !== -1 && (
            <div>
              <div
                className="relative mb-3 mt-5 align-middle"
                data-te-input-wrapper-init
              >
                <input
                  id="text-field"
                  type="text"
                  name="property"
                  value={properties}
                  onChange={handleForm}
                  onKeyDown={(e) => handleSubmit(e)}
                  className="peer block min-h-[auto] rounded w-full border-b-primary bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-black dark:placeholder:text-black [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                  id="text-field"
                />
                <label
                  for="text-field"
                  className="pointer-events-none absolute top-0 left-3 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-black transition-all duration-200 ease-out peer-focus:-translate-y-[1.3rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.3rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-gray-500 dark:peer-focus:text-gray-500"
                >
                  Enter properties separated by comma.
                </label>
              </div>

              <div className="flex flex-row justify-between">
                <div className="w-3/4 flex flex-wrap gap-2">
                  {propertyList.map((p) => (
                    <div className="flex flex-row border-2 border-primary align-middle">
                      <div className="px-3 pt-1">{p}</div>
                    </div>
                  ))}
                </div>
                <div className="w-1/4 flex justify-end">
                  <button
                    onClick={saveProperty}
                    type="button"
                    className="inline-block rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                  >
                    Save Properties
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
