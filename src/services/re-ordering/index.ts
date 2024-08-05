import { BlockEntity } from '@logseq/libs/dist/LSPlugin'

import { PropertiesProps } from '../../components/TagProperties'
import { updateBlocks } from '../core/update-blocks'
import { insertOrderedProps } from './insert-ordered-properties'
import { removeAllProperties } from './remove-all-properties'
import { reorderProperties } from './reorder-properties'

export const reorderBlockProperties = async (
  index: string,
  localProps: PropertiesProps[],
) => {
  const newOrder = localProps.map((prop) => prop.name)

  await updateBlocks(index, async (block: BlockEntity) => {
    const blockProps = await logseq.Editor.getBlockProperties(block.uuid)
    const newOrderBlockProps = reorderProperties(blockProps, newOrder)
    if (!newOrderBlockProps) return

    await removeAllProperties(block.uuid, Object.keys(blockProps))
    await insertOrderedProps(block.uuid, newOrderBlockProps)

    await logseq.UI.showMsg(
      `Properties rearranged for ${block.uuid}`,
      'success',
    )
  })

  logseq.hideMainUI()
}
