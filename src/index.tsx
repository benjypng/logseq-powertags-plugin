import "@logseq/libs";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import CreateTag from "./components/CreateTag";
import observerCallback from "./observerCallback";
import findTag from "./utils/findTag";
import handleListeners from "./utils/handleListeners";

function main() {
  console.log("logseq-powertags-plugin loaded");

  handleListeners();

  // Create setup
  if (!logseq.settings!.savedTags) {
    logseq.updateSettings({
      savedTags: {},
    });
  }

  // CREATE TAG
  logseq.Editor.registerSlashCommand("Create power tag", async function (e) {
    const blk = await logseq.Editor.getBlock(e.uuid);
    const tag = findTag(blk!.content);

    ReactDOM.render(
      <React.StrictMode>
        <CreateTag tag={tag} />;
      </React.StrictMode>,
      document.getElementById("app")
    );
    logseq.showMainUI();
  });

  // MANAGE TAGS
  logseq.provideModel({
    manageTag() {
      const mappedSavedTags = Object.entries(logseq.settings!.savedTags).map(
        (i) => ({
          tag: i[0],
          properties: i[1],
        })
      );

      ReactDOM.render(
        <React.StrictMode>
          <App savedTags={mappedSavedTags} />
        </React.StrictMode>,
        document.getElementById("app")
      );
      logseq.showMainUI();
    },
  });

  logseq.App.registerUIItem("toolbar", {
    key: "logseq-clock-plugin",
    template: `<a data-on-click="manageTag" class="button"><i class="ti ti-hash"></i></a>`,
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
