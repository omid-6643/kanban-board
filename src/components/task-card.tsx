import React from "react";
import TrashIcon from "../icons/trash-icon";
import { ID, Task } from "../types";

interface Props {
  task: Task;
  deleteTask: (id: ID) => void;
  updateTask: (id: ID, content: string) => void;
}

const TaskCard = ({ task, deleteTask, updateTask }: Props) => {
  const [mouseIsOver, setMouseIsOver] = React.useState(false);
  const [editTask, setEditTask] = React.useState(false);

  const toggleEditTask = () => {
    setEditTask(!editTask);
    setMouseIsOver(false);
  };

  if (editTask) {
    return (
      <div className="bg-mainBGColor cursor-grab relative p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500">
        <textarea
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
          value={task.content}
          autoFocus
          placeholder="Task content here"
          onBlur={toggleEditTask}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              toggleEditTask();
            }
          }}
          onChange={(e) => {
            updateTask(task.id, e.target.value);
          }}
        ></textarea>
      </div>
    );
  }

  return (
    <div
      className="task bg-mainBGColor cursor-grab relative p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={toggleEditTask}
    >
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>
      {mouseIsOver && (
        <button
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBGColor p-2 rounded opacity-60 hover:opacity-100"
          onClick={() => deleteTask(task.id)}
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
};

export default TaskCard;
