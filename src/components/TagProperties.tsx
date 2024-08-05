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
import { SortableItem } from './SortableItem'

interface TagPropertiesProps {
  setLocalTags: Dispatch<SetStateAction<Tag>>
  index: string
  properties: { name: string; value: string }[]
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

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
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

        const currSavedTags = logseq.settings!.savedTags
        currSavedTags[index] = newTags[tagIndex]

        logseq.updateSettings({
          savedTags: 'Need to add some arbitrary string first',
        })
        logseq.updateSettings({ savedTags: currSavedTags })

        return newTags
      })
    }
  }, [])

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

      logseq.hideMainUI()
      await logseq.UI.showMsg(
        `Property ${name} deleted from #${index}`,
        'success',
      )

      const blocksWithPowertag = await logseq.DB.q(`[[${index}]]`)
      if (!blocksWithPowertag || blocksWithPowertag.length == 0) return
      blocksWithPowertag.forEach(
        async (block) =>
          await logseq.Editor.removeBlockProperty(block.uuid, name),
      )
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
