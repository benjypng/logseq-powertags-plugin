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
import { IconMenuOrder } from '@tabler/icons-react'
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (active.id !== over?.id) {
        setLocalTags((prevTags) => {
          if (!prevTags) return prevTags

          const newTags = { ...prevTags }
          const tagIndex = Object.keys(prevTags).find((key) =>
            prevTags[key].some((prop) => prop.name === active.id),
          )

          if (!tagIndex) return prevTags

          const activeIndex = prevTags[tagIndex].findIndex(
            (prop) => prop.name === active.id,
          )
          const overIndex = prevTags[tagIndex].findIndex(
            (prop) => prop.name === over?.id,
          )

          if (activeIndex === -1 || overIndex === -1) return prevTags

          newTags[tagIndex] = arrayMove(
            prevTags[tagIndex],
            activeIndex,
            overIndex,
          )

          console.log('New order of properties:', newTags[tagIndex])
          return newTags
        })
      }
    },
    [], // Remove the tags dependency as we're using the function form of setLocalTags
  )

  const deleteProperty = useCallback(
    (index: string, name: string) => {
      console.log('HELLO WORLD')
      console.log(index)
      console.log(name)
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
                  {(attributes, listeners) => (
                    <div className="sortable-property">
                      <div
                        className="icon-group"
                        {...attributes}
                        {...listeners}
                      >
                        <IconMenuOrder stroke={2} size="1rem" />
                        <p>{name}</p>
                      </div>
                      <button onClick={() => deleteProperty(index, name)}>
                        Delete
                      </button>
                    </div>
                  )}
                </SortableItem>
              ))}
            </SortableContext>
          </DndContext>
        </div>
      ))}
    </div>
  )
}
