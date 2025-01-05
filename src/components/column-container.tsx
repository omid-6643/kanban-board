import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import PlusIcon from "../icons/plus-icon";
import TrashIcon from "../icons/trash-icon";
import { Column, ID, Task } from "../types";
import TaskCard from "./task-card";

interface Props {
  column: Column;
  deleteColumn: (id: ID) => void;
  updateColumnTitle: (id: ID, title: string) => void;
  createTask: (columnId: ID) => void;
  tasks: Task[];
  deleteTask: (id: ID) => void;
  updateTask: (id: ID, content: string) => void;
}

const ColumnContainer = (props: Props) => {
  const {
    column,
    deleteColumn,
    updateColumnTitle,
    createTask,
    tasks,
    deleteTask,
    updateTask,
  } = props;
  const [isEditTitle, setIsEditTitle] = React.useState(false);

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
    disabled: isEditTitle,
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
      className="bg-columnBGColor rounded-md w-[350px] h-[500px] max-h-[500px] flex flex-col justify-between"
    >
      {/* header */}
      <div
        {...attributes}
        {...listeners}
        className="bg-mainBGColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBGColor border-4 flex items-center justify-between"
        onClick={() => setIsEditTitle(true)}
      >
        <div className="flex gap-2 items-center">
          <div className="flex justify-center items-center bg-columnBGColor px-2 py-1 text-sm rounded-full">
            0
          </div>
          {isEditTitle ? (
            <input
              autoFocus
              className="bg-black focus:border-rose-500 border rounded outline-none px-2"
              defaultValue={column.title}
              onBlur={() => setIsEditTitle(false)}
              onKeyDown={(event) => {
                if (event.key !== "Enter") return;
                setIsEditTitle(false);
              }}
              onChange={(event) => {
                updateColumnTitle(column.id, event.target.value);
              }}
            />
          ) : (
            <span>{column.title}</span>
          )}
        </div>
        <button
          className="stroke-gray-500 hover:stroke-white hover:bg-columnBGColor rounded px-1 py-2"
          onClick={() => deleteColumn(column.id)}
        >
          <TrashIcon />
        </button>
      </div>

      {/* tasks */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        {tasks.map((task) => {
          return (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          );
        })}
      </div>
      {/* footer */}

      <button
        className="flex gap-2 items-center border-columnBGColor border-2 rounded-md p-4 border-x-columnBGColor hover:text-rose-500 active:bg-black hover:bg-mainBGColor"
        onClick={() => {
          createTask(column.id);
        }}
      >
        <PlusIcon /> Add Task
      </button>
    </div>
  );
};

export default ColumnContainer;
