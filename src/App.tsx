import "@logseq/libs";
import React, { useState } from "react";
import "./App.css";
//let blk = await logseq.DB.datascriptQuery(`
//[:find (pull ?b [*])
//    :where
//        [?b :block/path-refs [:block/name "${props.tag}"]]]
//`);
export default function App(props: { tag: string | number }) {
  const [properties, setProperties] = useState("");
  const [propertyList, setPropertyList] = useState<string[]>([]);

  console.log(props.tag);
  function handleForm(e: React.ChangeEvent<HTMLInputElement>) {
    setProperties(([e.target.name] = e.target.value));
  }

  function handleSubmit(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (properties === "" || props.tag === -1) {
        logseq.UI.showMsg(
          "Please key in a property or ensure a tag is selected",
          "error"
        );
        return;
      } else {
        const arr: string[] = properties.trim().split(",");
        setPropertyList((prevState) => [...prevState, ...arr]);
        setProperties("");
      }
    }
  }

  function saveProperty() {
    let tagsObj = logseq.settings!.savedTags;

    tagsObj[props.tag] = propertyList;

    logseq.updateSettings({
      savedTags: tagsObj,
    });

    setPropertyList([]);
    logseq.hideMainUI();
  }

  return (
    <div className="flex justify-center border border-black" tabIndex={-1}>
      <div className="absolute top-10 bg-white rounded-lg p-3 w-1/3 border text-sm">
        {/* Start content here */}
        <h1 className="mb-3 text-black text-lg">Create Auto Properties</h1>
        <p className="mb-3">
          Please start keying in properties for{" "}
          {props.tag !== -1 ? (
            <span className="bg-purple-800 text-white px-2 py-1 rounded-full text-sm">
              {props.tag}
            </span>
          ) : (
            ""
          )}
        </p>

        <div>
          <input
            id="text-field"
            type="text"
            name="property"
            className="px-2 py-1 rounded-xl mb-3 w-full h-6"
            value={properties}
            onChange={handleForm}
            onKeyDown={(e) => handleSubmit(e)}
          />
        </div>

        <div>
          {propertyList.map((p) => (
            <span className="bg-blue-800 px-2 py-1 text-white rounded-full mr-1">
              {p}
            </span>
          ))}
        </div>

        <div className="mt-4">
          <button
            className="border border-purple-600 text-black px-1 rounded-md"
            onClick={saveProperty}
          >
            Save
          </button>
        </div>
        {/* End content here */}
      </div>
    </div>
  );
}
