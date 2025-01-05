import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import React from "react";
import { createPortal } from "react-dom";
import PlusIcon from "../icons/plus-icon";
import { Column, ID, Task } from "../types";
import ColumnContainer from "./column-container";
import TaskCard from "./task-card";

const KanbanBoard = () => {
  const [columns, setColumns] = React.useState<Column[]>([]);
  const [activeColumn, setActiveColumn] = React.useState<Column | null>(null);

  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  const columnsId = React.useMemo(
    () => columns.map((column) => column.id),
    [columns]
  );

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const createNewColumn = () => {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  };

  const deleteColumn = (id: ID) => {
    setColumns(columns.filter((column) => column.id !== id));
    setTasks(tasks.filter((task) => task.columnId !== id));
  };

  const updateColumnTitle = (id: ID, title: string) => {
    setColumns(
      columns.map((column) =>
        column.id === id ? { ...column, title } : column
      )
    );
  };

  const createTask = (columnId: ID) => {
    const newTask: Task = {
      id: generateId(),
      content: `Task ${tasks.length + 1}`,
      columnId,
    };

    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id: ID) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTask = (id: ID, content: string) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, content } : task))
    );
  };

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (column) => column.id === activeColumnId
      );
      const overColumnIndex = columns.findIndex(
        (column) => column.id === overColumnId
      );

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // drop task over another column
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);

        const overIndex = tasks.findIndex((task) => task.id === overId);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === activeId);

        tasks[activeIndex].columnId = overId;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-10">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-2">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((column) => (
                <ColumnContainer
                  key={column.id}
                  column={column}
                  deleteColumn={deleteColumn}
                  updateColumnTitle={updateColumnTitle}
                  createTask={createTask}
                  tasks={tasks.filter((task) => task.columnId === column.id)}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              ))}
            </SortableContext>
          </div>

          <button
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBGColor border-2 border-columnBGColor p-4 ring-rose-500 hover:ring-2 flex gap-2"
            onClick={createNewColumn}
          >
            <PlusIcon /> Add Column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumnTitle={updateColumnTitle}
                createTask={createTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
