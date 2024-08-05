import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { IconMenuOrder, IconTrash } from '@tabler/icons-react'
import { Dispatch, SetStateAction, useCallback } from 'react'

import { Tag } from '../features'
import { reorderProperties } from '../services/reorder-properties'
import { SortableItem } from './SortableItem'

export interface PropertiesProps {
  name: string
  value: string
}

export interface TagPropertiesProps {
  setLocalTags: Dispatch<SetStateAction<Tag>>
  index: string
  properties: PropertiesProps[]
  tags: Tag
}

export const TagProperties = ({
  setLocalTags,
  index,
  properties,
  tags,
}: TagPropertiesProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      let localProps
      const { active, over } = event

      if (active.id !== over?.id) {
        setLocalTags((prevTags) => {
          if (!prevTags) return prevTags

          const newTags = { ...prevTags }
          const tagIndex = Object.keys(prevTags).find((key) =>
            prevTags[key]!.some((prop) => prop.name === active.id),
          )

          if (!tagIndex) return prevTags

          const activeIndex = prevTags[tagIndex]!.findIndex(
            (prop) => prop.name === active.id,
          )
          const overIndex = prevTags[tagIndex]!.findIndex(
            (prop) => prop.name === over?.id,
          )
          if (activeIndex === -1 || overIndex === -1) return prevTags
          newTags[tagIndex] = arrayMove(
            prevTags[tagIndex]!,
            activeIndex,
            overIndex,
          )

          // Save to settings
          const currSavedTags = logseq.settings!.savedTags
          currSavedTags[index] = newTags[tagIndex]
          logseq.updateSettings({
            savedTags: 'Need to add some arbitrary string first',
          })
          logseq.updateSettings({ savedTags: currSavedTags })
          localProps = newTags[tagIndex]

          return newTags
        })

        const newOrder = localProps!.map((prop: PropertiesProps) => prop.name)
        const blocksWithPowertag = await logseq.DB.q(`[[${index}]]`)
        if (!blocksWithPowertag || blocksWithPowertag.length == 0) {
          await logseq.UI.showMsg(`No blocks with PowerTag: ${index} found`)
          logseq.hideMainUI()
          return
        }

        blocksWithPowertag.forEach(async (block) => {
          const blockProps = await logseq.Editor.getBlockProperties(block.uuid)
          const newOrderBlockProps = reorderProperties(blockProps, newOrder)
          if (!newOrderBlockProps) return

          // Remove all properties
          Object.keys(blockProps).forEach(
            async (propKey: string) =>
              await logseq.Editor.removeBlockProperty(block.uuid, propKey),
          )

          // Reinsert in new order
          Object.entries(newOrderBlockProps).forEach(async (propPair) => {
            await logseq.Editor.upsertBlockProperty(
              block.uuid,
              propPair[0],
              propPair[1],
            )
          })

          await logseq.UI.showMsg(
            `Properties rearranged for ${block.uuid}`,
            'success',
          )

          logseq.hideMainUI()
        })
      }
    },
    [tags],
  )

  const deleteProperty = useCallback(
    async (index: string, name: string) => {
      const currSavedTags = logseq.settings!.savedTags
      const properties = currSavedTags[index]
      currSavedTags[index] = properties.filter(
        (property: { name: string }) => property.name !== name,
      )

      logseq.updateSettings({
        savedTags: 'Need to add some arbitrary string first',
      })
      logseq.updateSettings({ savedTags: currSavedTags })

      const blocksWithPowertag = await logseq.DB.q(`[[${index}]]`)
      if (!blocksWithPowertag || blocksWithPowertag.length == 0) {
        await logseq.UI.showMsg(`No blocks with PowerTag: ${index} found`)
        logseq.hideMainUI()
        return
      }

      blocksWithPowertag.forEach(async (block) => {
        await logseq.Editor.removeBlockProperty(block.uuid, name)
        await logseq.UI.showMsg(
          `Property ${name} deleted from #${index}. Block ${block.uuid} updated`,
          'success',
        )
      })

      logseq.hideMainUI()
    },
    [tags],
  )

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext
        items={properties.map((prop) => prop.name)}
        strategy={verticalListSortingStrategy}
      >
        {properties.map(({ name }) => (
          <SortableItem key={name} id={name} index={index}>
            {(attributes, listeners) => (
              <div className="sortable-property">
                <div className="icon-group" {...attributes} {...listeners}>
                  <IconMenuOrder stroke={2} size="1rem" />
                  <p>{name}</p>
                </div>
                {properties.length > 1 && (
                  <button onClick={() => deleteProperty(index, name)}>
                    <IconTrash stroke={1} size="1rem" />
                  </button>
                )}
              </div>
            )}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  )
}
