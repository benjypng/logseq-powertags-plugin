import "@logseq/libs";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import observerCallback from "./observerCallback";
import findTag from "./utils/findTag";
import handleListeners from "./utils/handleListeners";

function main() {
  console.log("logseq-powertags-plugin loaded");

  if (!logseq.settings!.allTags) {
    logseq.updateSettings({
      savedTags: {},
    });
  }

  handleListeners();

  logseq.Editor.registerSlashCommand("Create Powertag", async function () {
    const content: string = await logseq.Editor.getEditingBlockContent();
    const tag: string = findTag(content) as string;

    logseq.showMainUI();

    ReactDOM.render(
      <React.StrictMode>
        <App tag={tag} />
      </React.StrictMode>,
      document.getElementById("app")
    );
  });

  //@ts-expect-error
  const observer = new top.MutationObserver(observerCallback);

  //@ts-expect-error
  observer.observe(top.document.getElementById("app-container"), {
    attributes: false,
    childList: true,
    subtree: true,
  });
}

logseq.ready(main).catch(console.error);
