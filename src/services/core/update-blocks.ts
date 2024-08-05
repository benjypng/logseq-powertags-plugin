import { BlockEntity } from '@logseq/libs/dist/LSPlugin'

import { queryBlocksWithTag } from './query-blocks-with-tag'

export const updateBlocks = async (
  tag: string,
  operation: (block: BlockEntity) => Promise<void>,
) => {
  const blocks = await queryBlocksWithTag(tag)
  if (!blocks) return

  await Promise.all(blocks.map(operation))
  logseq.hideMainUI()
}
