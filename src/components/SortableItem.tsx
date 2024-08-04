import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PropsWithChildren } from 'react'

interface SortableItemProps {
  id: string
  index: string
}

export const SortableItem = ({
  id,
  index,
  children,
}: PropsWithChildren<SortableItemProps>) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id, data: { index: index } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}
