import "@logseq/libs";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import CreateTag from "./components/CreateTag";
import settings from "./services/callSettings";
import observerCallback from "./services/observerCallback";
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
  logseq.Editor.registerSlashCommand("Create power tag", async function () {
    const content = await logseq.Editor.getEditingBlockContent();
    const tag = findTag(content);

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
    async manageTag() {
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
    key: "logseq-powertags-plugin",
    template: `<a data-on-click="manageTag" class="button"><i class="ti ti-tag"></i></a>`,
  });

  //@ts-expect-error
  const observer = new top.MutationObserver(observerCallback);

  //@ts-expect-error
  observer.observe(top.document.getElementById("app-container"), {
    attributes: false,
    childList: true,
    subtree: true,
  });

  logseq.App.onMacroRendererSlotted(async ({ payload, slot }) => {
    let [type, content] = payload.arguments;
    const uuid = payload.uuid;
    if (!type.startsWith(":dynamic-block_")) return;

    const blk = await logseq.Editor.getBlock(uuid);
    const propertiesArr = Object.keys(blk!.properties!);

    for (const k of propertiesArr) {
      content = content.replace(
        k,
        await logseq.Editor.getBlockProperty(uuid, k)
      );
    }

    logseq.provideUI({
      key: `${slot}`,
      slot,
      reset: true,
      template: `<p data-slot-id=${slot} class="dynamic-block">${content
        .replace('"', "")
        .replace('"', "")}</p>`,
    });
  });
}

logseq.useSettingsSchema(settings).ready(main).catch(console.error);
