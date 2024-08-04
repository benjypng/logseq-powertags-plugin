import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SortableItemProps {
  id: string
  index: string
  children: (
    attributes: ReturnType<typeof useSortable>['attributes'],
    listeners: ReturnType<typeof useSortable>['listeners'],
  ) => React.ReactNode
}

export const SortableItem: React.FC<SortableItemProps> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
      {children(attributes, listeners)}
    </div>
  )
}
