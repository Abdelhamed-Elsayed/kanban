import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { useTaskStore, Status, Task, priorityRank } from "../../store/useTaskStore";
import Column from "./Column";
import TaskCard from "./TaskCard";
import EditTaskModal from "../modals/EditTaskModal";

function DroppableWrapper({
  id,
  title,
  status,
  tasks,
  onEditTask,
  isOver,
}: {
  id: Status;
  title: string;
  status: Status;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  isOver: boolean;
}) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="flex flex-col">
      <Column title={title} status={status} tasks={tasks} onEditTask={onEditTask} isOver={isOver} />
    </div>
  );
}

export default function Board({ search, priorityFilter }: { search: string; priorityFilter: string }) {
  const tasks = useTaskStore((s) => s.tasks);
  const moveTask = useTaskStore((s) => s.moveTask);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [overColumn, setOverColumn] = useState<Status | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const filtered = tasks
    .filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchPriority = priorityFilter === "all" || t.priority === priorityFilter;
      return matchSearch && matchPriority;
    })
    .sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);

  const todo = filtered.filter((t) => t.status === "todo");
  const progress = filtered.filter((t) => t.status === "progress");
  const done = filtered.filter((t) => t.status === "done");

  const handleDragStart = (e: DragStartEvent) => {
    const task = tasks.find((t) => t.id === e.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragOver = (e: DragOverEvent) => {
    const col = e.over?.id as Status | null;
    if (col === "todo" || col === "progress" || col === "done") {
      setOverColumn(col);
    } else {
      setOverColumn(null);
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveTask(null);
    setOverColumn(null);
    if (!over) return;
    const newStatus = over.id as Status;
    if (newStatus === "todo" || newStatus === "progress" || newStatus === "done") {
      moveTask(active.id as string, newStatus);
    }
  };

  const openEdit = (task: Task) => {
    setSelectedTask(task);
    setEditOpen(true);
  };

  const columns: { id: Status; title: string; tasks: Task[] }[] = [
    { id: "todo", title: "To Do", tasks: todo },
    { id: "progress", title: "In Progress", tasks: progress },
    { id: "done", title: "Done", tasks: done },
  ];

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((col) => (
            <DroppableWrapper
              key={col.id}
              id={col.id}
              title={col.title}
              status={col.id}
              tasks={col.tasks}
              onEditTask={openEdit}
              isOver={overColumn === col.id}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 200, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
          {activeTask ? (
            <div className="drag-overlay" style={{ borderRadius: 12, width: "100%" }}>
              <TaskCard task={activeTask} onEdit={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <EditTaskModal open={editOpen} onClose={() => setEditOpen(false)} task={selectedTask} />
    </>
  );
}
