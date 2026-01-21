import { handleDynamicVariables } from './handle-dynamic-variables'

export const handlePowerTag = async (uuid: string) => {
  const blk = await logseq.Editor.getBlock(uuid)
  if (!blk) return
  const tagMatch = /#(?:\[\[(.*?)\]\]|(.+))/.exec(blk.content)
  if (!tagMatch) return

  // Check whether tag is a PowerTag
  const tag = tagMatch[1] ?? tagMatch[2]
  if (!tag) return

  const powerTag = logseq.settings!.savedTags[tag.toLowerCase()]
  if (!powerTag) return

  //****RULES OF ENGAGEMENT****//
  // Ignore if properties already exist
  // Handle partial properties
  // Handle no properties exist
  //**************************//

  for (const property of powerTag) {
    const currProperty = await logseq.Editor.getBlockProperty(
      uuid,
      property.name,
    )
    if (currProperty) continue

    // Handle dynamic variables
    const propValue = await handleDynamicVariables(property.value)

    await logseq.Editor.upsertBlockProperty(uuid, property.name, propValue)
  }
}
