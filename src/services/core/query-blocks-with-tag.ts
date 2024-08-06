import { BlockEntity } from '@logseq/libs/dist/LSPlugin'

export const queryBlocksWithTag = async (
  tag: string,
): Promise<BlockEntity[] | null> => {
  let blocks = await logseq.DB.q(`[[${tag}]]`)
  if (!blocks || blocks.length === 0) {
    await logseq.UI.showMsg(`No blocks with PowerTag: ${tag} found`)
    logseq.hideMainUI()
    return null
  }
  // Only retrieve blocks where its parent is the page so that child blocks are not selected and properties are being added to child blocks
  blocks = blocks.filter(
    (block: BlockEntity) => block.page.id === block.parent.id,
  )
  return blocks
}
