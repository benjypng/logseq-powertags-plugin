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
import { ActionIcon, Flex, Stack, Text } from '@mantine/core'
import { ArrowDownUp, Trash } from 'lucide-react'
import { Dispatch, SetStateAction, useCallback } from 'react'

import { Tag } from '../features'
import { updateBlocks } from '../services/core/update-blocks'
import { updateSettings } from '../services/core/update-settings'
import { reorderBlockProperties } from '../services/re-ordering'
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
        <Stack gap="sm">
          {properties.map(({ name }) => (
            <SortableItem key={name} id={name} index={index}>
              {(attributes, listeners) => (
                <Flex
                  justify="space-between"
                  bg="#eee"
                  p="xs"
                  style={{ borderRadius: '0.4rem' }}
                >
                  <Flex
                    direction="row"
                    {...attributes}
                    {...listeners}
                    gap="xs"
                    align="center"
                  >
                    <ArrowDownUp size="1rem" style={{ cursor: 'pointer' }} />
                    <Text style={{ cursor: 'pointer' }}>{name}</Text>
                  </Flex>
                  {properties.length > 1 && (
                    <ActionIcon
                      onClick={() => deleteProperty(index, name)}
                      variant="outline"
                      color="red"
                    >
                      <Trash size="1rem" />
                    </ActionIcon>
                  )}
                </Flex>
              )}
            </SortableItem>
          ))}
        </Stack>
      </SortableContext>
    </DndContext>
  )
}
