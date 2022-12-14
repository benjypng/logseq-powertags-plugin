import findTag from "./utils/findTag";

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

      if (
        findTag(blk!.content) !== -1 &&
        findTag(blk!.content) !== blk!.content
      ) {
        logseq.settings!.savedTags[findTag(blk!.content)].map(
          async (t: string) => {
            await logseq.Editor.upsertBlockProperty(uuid, t, "...");
          }
        );
      }
    }
  }
}
