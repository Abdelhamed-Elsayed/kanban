import { useState, useEffect, useMemo } from "react";
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
  closestCorners,
} from "@dnd-kit/core";

import { useTaskStore, Status, Task, priorityRank } from "../../store/useTaskStore";
import { useToastStore } from "../../store/useToastStore";
import Column from "./Column";
import TaskCard from "./TaskCard";
import EditTaskModal from "../modals/EditTaskModal";

function DroppableWrapper({
  id,
  title,
  tasks,
  onEditTask,
  isOver,
  isMobile,
}: {
  id: Status;
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  isOver: boolean;
  isMobile: boolean;
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={isMobile ? undefined : setNodeRef} className="flex flex-col">
      <Column
        title={title}
        status={id}
        tasks={tasks}
        onEditTask={onEditTask}
        isOver={isOver}
        isMobile={isMobile}
      />
    </div>
  );
}

export default function Board({
  search,
  priorityFilter,
}: {
  search: string;
  priorityFilter: string;
}) {
  const tasks = useTaskStore((s) => s.tasks);
  const moveTask = useTaskStore((s) => s.moveTask);
  const pushToast = useToastStore((s) => s.push);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [overColumn, setOverColumn] = useState<Status | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  const filtered = useMemo(() => {
    return tasks
      .filter((t) => {
        const matchSearch =
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase());
        const matchPriority =
          priorityFilter === "all" || t.priority === priorityFilter;
        return matchSearch && matchPriority;
      })
      .sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
  }, [tasks, search, priorityFilter]);

  const columns = useMemo(() => {
    return [
      { id: "todo" as Status, title: "To Do", tasks: filtered.filter((t) => t.status === "todo") },
      { id: "progress" as Status, title: "In Progress", tasks: filtered.filter((t) => t.status === "progress") },
      { id: "done" as Status, title: "Done", tasks: filtered.filter((t) => t.status === "done") },
    ];
  }, [filtered]);

  const statusLabels: Record<Status, string> = {
    todo: "To Do",
    progress: "In Progress",
    done: "Done",
  };

  const openEdit = (task: Task) => {
    setSelectedTask(task);
    setEditOpen(true);
  };

  const handleDragStart = (e: DragStartEvent) => {
    const task = tasks.find((t) => t.id === e.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragOver = (e: DragOverEvent) => {
    const overId = e.over?.id as string | null;
    if (!overId) { setOverColumn(null); return; }

    if (overId === "todo" || overId === "progress" || overId === "done") {
      setOverColumn(overId as Status);
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) setOverColumn(overTask.status);
      else setOverColumn(null);
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveTask(null);
    setOverColumn(null);
    if (!over) return;

    const overId = over.id as string;
    const activeTask = tasks.find((t) => t.id === active.id);

    if (overId === "todo" || overId === "progress" || overId === "done") {
      if (activeTask?.status !== overId) {
        moveTask(active.id as string, overId as Status);
        pushToast({ message: `Moved to ${statusLabels[overId as Status]}`, duration: 3000 });
      }
      return;
    }

    const overTask = tasks.find((t) => t.id === overId);
    if (overTask && activeTask?.status !== overTask.status) {
      moveTask(active.id as string, overTask.status);
      pushToast({ message: `Moved to ${statusLabels[overTask.status]}`, duration: 3000 });
    }
  };

  // Mobile mode
  if (isMobile) {
    return (
      <>
        <div className="grid grid-cols-1 gap-4">
          {columns.map((col) => (
            <div key={col.id}>
              <h2
                className="text-sm font-bold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {col.title}
              </h2>
              <div className="space-y-3">
                {col.tasks.map((task) => (
                  <TaskCard key={task.id} task={task} onEdit={openEdit} isMobile />
                ))}
              </div>
            </div>
          ))}
        </div>
        <EditTaskModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          task={selectedTask}
        />
      </>
    );
  }

  // Desktop mode
  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
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
              tasks={col.tasks}
              onEditTask={openEdit}
              isOver={overColumn === col.id}
              isMobile={false}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="drag-overlay" style={{ borderRadius: 12, width: "100%" }}>
              <TaskCard task={activeTask} onEdit={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <EditTaskModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        task={selectedTask}
      />
    </>
  );
}