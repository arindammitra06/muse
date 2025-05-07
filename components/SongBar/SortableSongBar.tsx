import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SongBar } from './SongBar';

export const SortableSongBar = (props: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
