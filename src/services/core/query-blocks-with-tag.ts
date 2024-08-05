import { BlockEntity } from '@logseq/libs/dist/LSPlugin'

export const queryBlocksWithTag = async (
  tag: string,
): Promise<BlockEntity[] | null> => {
  const blocks = await logseq.DB.q(`[[${tag}]]`)
  if (!blocks || blocks.length === 0) {
    await logseq.UI.showMsg(`No blocks with PowerTag: ${tag} found`)
    logseq.hideMainUI()
    return null
  }
  return blocks
}
