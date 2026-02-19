import { FormEvent } from "react";

type AddTaskFormProps = {
  form: {
    showAddTask: boolean;
    saving: boolean;
    title: string;
    status: string;
    category: string;
    priority: string;
    dueDate: string;
    description: string;
    notes: string;
    categories: string[];
    useCustomCategory: boolean;
    newCategory: string;
  };
  actions: {
    setShowAddTask: (value: boolean) => void;
    setTitle: (value: string) => void;
    setStatus: (value: string) => void;
    setCategory: (value: string) => void;
    setPriority: (value: string) => void;
    setDueDate: (value: string) => void;
    setDescription: (value: string) => void;
    setNotes: (value: string) => void;
    setUseCustomCategory: (value: boolean) => void;
    setNewCategory: (value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onLogout: () => void;
  };
  onCancel: () => void;
};

export function AddTaskForm({
  form,
  actions,
  onCancel,
}: AddTaskFormProps) {
  return (
    <>
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-violet-100 bg-linear-to-r from-violet-50 via-fuchsia-50 to-cyan-50 p-4">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-900">Task Notebook ✨</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => actions.setShowAddTask(!form.showAddTask)}
            className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:scale-[1.02] hover:bg-violet-500"
          >
            {form.showAddTask ? "Close" : "Add Task"}
          </button>
          <button
            type="button"
            onClick={actions.onLogout}
            className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 shadow transition hover:scale-[1.02] hover:bg-rose-50"
          >
            Logout
          </button>
        </div>
      </div>

      {form.showAddTask ? (
        <form className="mt-6 grid gap-3 rounded-2xl border border-violet-100 bg-linear-to-br from-white to-violet-50 p-4 shadow-sm" onSubmit={actions.onSubmit}>
          <p className="text-sm font-semibold text-violet-700">New Task 💜</p>
          <input
            type="text"
            placeholder="Task title"
            value={form.title}
            onChange={(event) => actions.setTitle(event.target.value)}
            className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-zinc-900 outline-none transition focus:border-violet-400"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.status}
              onChange={(event) => actions.setStatus(event.target.value)}
              className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-zinc-900 outline-none transition focus:border-violet-400"
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
            <input
              type="date"
              value={form.dueDate}
              onChange={(event) => actions.setDueDate(event.target.value)}
              className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-zinc-900 outline-none transition focus:border-violet-400"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.useCustomCategory ? "__custom__" : form.category}
              onChange={(event) => {
                if (event.target.value === "__custom__") {
                  actions.setUseCustomCategory(true);
                  return;
                }

                actions.setUseCustomCategory(false);
                actions.setCategory(event.target.value);
              }}
              className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-zinc-900 outline-none transition focus:border-violet-400"
              required
            >
              {form.categories.map((categoryOption) => (
                <option key={categoryOption} value={categoryOption}>
                  {categoryOption}
                </option>
              ))}
              <option value="__custom__">+ Add new category</option>
            </select>
            <select
              value={form.priority}
              onChange={(event) => actions.setPriority(event.target.value)}
              className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-zinc-900 outline-none transition focus:border-violet-400"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          {form.useCustomCategory ? (
            <input
              type="text"
              placeholder="New category"
              value={form.newCategory}
              onChange={(event) => actions.setNewCategory(event.target.value)}
              className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-zinc-900 outline-none transition focus:border-violet-400"
              required
            />
          ) : null}
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(event) => actions.setDescription(event.target.value)}
            className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-zinc-900 outline-none transition focus:border-violet-400"
            rows={2}
          />
          <textarea
            placeholder="Notes"
            value={form.notes}
            onChange={(event) => actions.setNotes(event.target.value)}
            className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-zinc-900 outline-none transition focus:border-violet-400"
            rows={2}
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={form.saving}
              className="rounded-full bg-fuchsia-600 px-4 py-2 font-semibold text-white shadow transition hover:scale-[1.02] hover:bg-fuchsia-500 disabled:opacity-60"
            >
              {form.saving ? "Adding..." : "Add Task"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={form.saving}
              className="rounded-full border border-violet-200 bg-white px-4 py-2 font-semibold text-violet-700 transition hover:bg-violet-50 disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}
    </>
  );
}
