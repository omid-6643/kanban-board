import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TrashIcon from "../icons/trash-icon";
import { Column, ID } from "../types";

interface Props {
  column: Column;
  deleteColumn: (id: ID) => void;
}

const ColumnContainer = (props: Props) => {
  const { column, deleteColumn } = props;

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-columnBGColor rounded-md w-[350px] h-[500px] max-h-[500px] flex flex-col border-red-500 opacity-40 border-2"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columnBGColor rounded-md w-[350px] h-[500px] max-h-[500px] flex flex-col"
    >
      <div
        {...attributes}
        {...listeners}
        className="bg-mainBGColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBGColor border-4 flex items-center justify-between"
      >
        <div className="flex gap-2 items-center">
          <div className="flex justify-center items-center bg-columnBGColor px-2 py-1 text-sm rounded-full">
            0
          </div>
          {column.title}
        </div>
        <button
          className="stroke-gray-500 hover:stroke-white hover:bg-columnBGColor rounded px-1 py-2"
          onClick={() => deleteColumn(column.id)}
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default ColumnContainer;
