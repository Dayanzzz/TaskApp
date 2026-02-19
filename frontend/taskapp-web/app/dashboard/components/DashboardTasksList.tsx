import { TaskCard } from "./TaskCard";
import { TaskItem } from "../types";

type DashboardTasksListProps = {
  tasks: TaskItem[];
  editing: {
    editingTaskId: number | null;
    editStatus: string;
    editNotes: string;
    updatingTaskId: number | null;
  };
  actions: {
    onStartEdit: (task: TaskItem) => void;
    onCancelEdit: () => void;
    onSave: (taskId: number) => void;
    onDelete: (taskId: number) => void;
    setEditStatus: (value: string) => void;
    setEditNotes: (value: string) => void;
  };
};

export function DashboardTasksList({ tasks, editing, actions }: DashboardTasksListProps) {
  return (
    <ul className="mt-6 space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          editing={{
            isEditing: editing.editingTaskId === task.id,
            editStatus: editing.editStatus,
            editNotes: editing.editNotes,
            isUpdating: editing.updatingTaskId === task.id,
          }}
          actions={{
            onStartEdit: actions.onStartEdit,
            onCancelEdit: actions.onCancelEdit,
            onSave: actions.onSave,
            onDelete: actions.onDelete,
            setEditStatus: actions.setEditStatus,
            setEditNotes: actions.setEditNotes,
          }}
        />
      ))}
    </ul>
  );
}
