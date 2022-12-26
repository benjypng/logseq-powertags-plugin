import findTag from "../utils/findTag";

export default async function observerCallback(mutationsList: any[]) {
  for (const mutation of mutationsList) {
    if (
      mutation.type === "childList" &&
      mutation.removedNodes.length > 0 &&
      mutation.removedNodes[0].className === "editor-inner block-editor"
    ) {
      const uuid = mutation.target
        .closest('div[id^="ls-block"]')
        ?.getAttribute("blockid");

      const blk = await logseq.Editor.getBlock(uuid);
      const tag = findTag(blk!.content);

      if (
        tag !== -1 &&
        tag !== blk!.content &&
        logseq.settings!.savedTags[tag] &&
        Object.keys(blk!.properties!).length === 0
      ) {
        if (logseq.settings!.addTypeProperty)
          await logseq.Editor.upsertBlockProperty(uuid, "type", tag);

        logseq.settings!.savedTags[tag].map(async (t: string) => {
          await logseq.Editor.upsertBlockProperty(uuid, t, "...");
        });
      }
    }
  }
}
