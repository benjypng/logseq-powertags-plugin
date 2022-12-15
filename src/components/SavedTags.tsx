import React, { useState } from "react";

export default function SavedTags(props: {
  tag: string;
  properties: string[];
}) {
  const [warning, setWarning] = useState(false);

  function toggle() {
    warning ? setWarning(false) : setWarning(true);
  }

  return (
    <div className="bg-purple-200 rounded-lg p-3 mb-2 flex flex-row justify-between">
      {!warning && (
        <React.Fragment>
          <div className="w-3/4">
            <p className="font-bold mb-1">{props.tag}</p>
            {props.properties.map((p) => (
              <span className="mr-1 px-2 py-1 rounded-full text-xs bg-blue-500 text-white">
                {p}
              </span>
            ))}
          </div>

          <div className="flex align-middle w-1/4">
            <button
              onClick={toggle}
              className="text-white bg-gray-800 px-1 py-0 text-xs rounded-md h-10 w-12"
            >
              Apply All
            </button>
            <button className="text-white bg-red-500 px-1 py-0 text-xs rounded-md ml-2 h-10 w-12">
              Delete
            </button>
          </div>
        </React.Fragment>
      )}

      {warning && (
        <React.Fragment>
          <div className="w-3/4">
            <p className="font-bold mb-1">
              Are you sure? This process is irreversible.
            </p>
          </div>

          <div className="flex align-middle w-1/4">
            <button className="text-white bg-gray-800 px-1 py-0 text-xs rounded-md">
              Yes
            </button>
            <button className="text-white bg-red-500 px-1 py-0 text-xs rounded-md ml-2">
              Cancel
            </button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
