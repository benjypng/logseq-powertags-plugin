export const observerCallback = async (mutationsList: any[]) => {
  for (const mutation of mutationsList) {
    if (
      mutation.type === 'childList' &&
      mutation.removedNodes.length > 0 &&
      mutation.removedNodes[0].className === 'editor-inner block-editor'
    ) {
      const uuid = mutation.target
        .closest('div[id^="ls-block"]')
        ?.getAttribute('blockid')

      const blk = await logseq.Editor.getBlock(uuid)
      if (!blk) return
      const tagMatch = /#(?:\[\[(.*?)\]\]|(\w+))/.exec(blk.content)
      if (!tagMatch) return

      // Check whether tag is a PowerTag
      const tag = tagMatch[1] ?? tagMatch[2]
      if (!tag) return

      const powerTag = logseq.settings!.savedTags[tag]
      if (!powerTag) return

      // Ignore if properties already exist
      // Handle partial properties
      // Handle no properties exist
      for (const property of powerTag) {
        const currProperty = await logseq.Editor.getBlockProperty(
          uuid,
          property.name,
        )
        if (currProperty) continue

        // TODO: Handle dynamic variables

        await logseq.Editor.upsertBlockProperty(
          uuid,
          property.name,
          property.value,
        )
      }
    }
  }
}
