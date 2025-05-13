import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SongBar } from './SongBar';


export const SortableSongBar = ({ id, ...props }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };


  return (
    <div ref={setNodeRef} style={style}>
      <SongBar
        {...props}
        dragHandleProps={{ ...attributes, ...listeners }}
        withHandle
      />
    </div>
  );
};
