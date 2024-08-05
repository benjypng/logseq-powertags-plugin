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
import { updateBlocks } from '../services/core/update-blocks'
import { updateSettings } from '../services/core/update-settings'
import { reorderProperties } from '../services/re-ordering/reorder-properties'
import { SortableItem } from './SortableItem'
import { reorderBlockProperties } from '../services/re-ordering'

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
          updateSettings((currSavedTags) => ({
            ...currSavedTags,
            [index]: newTags[tagIndex],
          }))
          localProps = newTags[tagIndex]

          return newTags
        })
        reorderBlockProperties(index, localProps!)
      }
    },
    [tags],
  )

  const deleteProperty = useCallback(
    async (index: string, name: string) => {
      updateSettings((currSavedTags) => ({
        ...currSavedTags,
        [index]: currSavedTags[index]?.filter(
          (property: { name: string }) => property.name !== name,
        ),
      }))

      await updateBlocks(index, async (block) => {
        await logseq.Editor.removeBlockProperty(block.uuid, name)
        await logseq.UI.showMsg(
          `Property ${name} deleted from #${index}. Block ${block.uuid} updated`,
          'success',
        )
      })
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
