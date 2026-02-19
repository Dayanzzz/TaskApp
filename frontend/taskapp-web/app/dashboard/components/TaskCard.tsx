import { getDueDateClasses, getPriorityClasses, getStatusClasses } from "../styles";
import { TaskItem } from "../types";

type TaskCardProps = {
  task: TaskItem;
  editing: {
    isEditing: boolean;
    editStatus: string;
    editNotes: string;
    isUpdating: boolean;
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

export function TaskCard({
  task,
  editing,
  actions,
}: TaskCardProps) {
  return (
    <li className="rounded-2xl border border-violet-100 bg-linear-to-br from-white to-violet-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold tracking-wide text-zinc-900">{task.title}</p>
        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusClasses(task.status)}`}>
          {task.status}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-violet-200 bg-white px-2.5 py-0.5 text-xs font-semibold text-violet-700">
          {task.category}
        </span>
        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getPriorityClasses(task.priority)}`}>
          {task.priority}
        </span>
      </div>
      <p className={`mt-2 text-sm font-medium ${getDueDateClasses(task.dueDate)}`}>
        Due: {String(task.dueDate).split("T")[0]}
      </p>
      {task.description ? <p className="mt-2 text-sm text-zinc-700">{task.description}</p> : null}

      {editing.isEditing ? (
        <div className="mt-3 space-y-2 rounded-xl border border-violet-100 bg-white p-3 shadow-sm">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-violet-600">Status</label>
            <select
              value={editing.editStatus}
              onChange={(event) => actions.setEditStatus(event.target.value)}
              className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-zinc-900 outline-none transition hover:border-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-violet-600">Notes</label>
            <textarea
              value={editing.editNotes}
              onChange={(event) => actions.setEditNotes(event.target.value)}
              className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-zinc-900 outline-none transition hover:border-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              rows={2}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => actions.onSave(task.id)}
              disabled={editing.isUpdating}
              className="rounded-full bg-fuchsia-600 px-3 py-1 text-sm font-semibold text-white shadow transition hover:scale-[1.02] hover:bg-fuchsia-500 disabled:opacity-60"
            >
              {editing.isUpdating ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={actions.onCancelEdit}
              disabled={editing.isUpdating}
              className="rounded-full border border-violet-200 bg-white px-3 py-1 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-2 text-sm text-zinc-700">Notes: {task.notes?.trim() ? task.notes : "—"}</p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => actions.onStartEdit(task)}
              className="rounded-full border border-violet-200 bg-white px-3 py-1 text-sm font-semibold text-violet-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-violet-50"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => actions.onDelete(task.id)}
              className="ml-auto rounded-full bg-rose-500 px-3 py-1 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-400"
            >
              Delete
            </button>
          </div>
        </>
      )}

      {editing.isEditing ? (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => actions.onDelete(task.id)}
            className="rounded-full bg-rose-500 px-3 py-1 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-400"
          >
            Delete
          </button>
        </div>
      ) : null}
    </li>
  );
}
