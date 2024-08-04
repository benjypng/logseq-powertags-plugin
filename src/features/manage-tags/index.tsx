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
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react'

import { SortableItem } from '../../components/SortableItem'
import { Tag } from '..'

export const ManageTags = ({
  tags,
  setTags,
}: {
  tags: Tag
  setTags: Dispatch<SetStateAction<Tag>>
}) => {
  const [localTags, setLocalTags] = useState<Tag>()

  useEffect(() => {
    setLocalTags(tags)
  }, [tags])

  const deleteProperty = useCallback(
    (index: string, name: string) => {
      console.log(index)
      console.log(name)
    },
    [tags],
  )

  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (active.id !== over?.id) {
        setLocalTags((prevTags) => {
          if (!prevTags) return
          const newTags = { ...prevTags }
          const activeIndex = prevTags[active.data.current!.index]!.findIndex(
            (prop) => prop.name === active.id,
          )
          const overIndex = prevTags[active.data.current!.index]!.findIndex(
            (prop) => prop.name === over?.id,
          )

          newTags[active.data.current!.index] = arrayMove(
            prevTags[active.data.current!.index]!,
            activeIndex,
            overIndex,
          )

          // 1. Update logseq.settings
          // 2. Find all blocks with the specified tag
          // 3. Store the values in variables
          // 4. Remove the properties
          // 5. Re-add the properties in the new specified order

          console.log(
            'New order of properties:',
            newTags[active.data.current!.index],
          )
          return newTags
        })
      }
    },
    [tags],
  )

  if (!localTags) return <h2>Loading...</h2>

  return (
    <div className="powertags-section">
      <h2>Manage</h2>
      {Object.entries(localTags).map(([index, properties]) => (
        <div key={index} className="tag-management">
          <h3>{index}</h3>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext
              items={properties.map((prop) => prop.name)}
              strategy={verticalListSortingStrategy}
            >
              {properties.map(({ name }) => (
                <SortableItem key={name} id={name} index={index}>
                  <div className="sortable-property">
                    <p>{name}</p>
                    <button onClick={() => deleteProperty(index, name)}>
                      Delete
                    </button>
                  </div>
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        </div>
      ))}
    </div>
  )
}
