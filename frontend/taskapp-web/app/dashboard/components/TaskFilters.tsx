type TaskFiltersProps = {
  filters: {
    filterPriority: string;
    filterDueDate: string;
    filterCategory: string;
    categories: string[];
  };
  actions: {
    setFilterPriority: (value: string) => void;
    setFilterDueDate: (value: string) => void;
    setFilterCategory: (value: string) => void;
    onClear: () => void;
  };
};

export function TaskFilters({
  filters,
  actions,
}: TaskFiltersProps) {
  return (
    <div className="mt-6 rounded-2xl border border-fuchsia-100 bg-linear-to-br from-fuchsia-50 to-cyan-50 p-4 shadow-sm">
      <p className="text-sm font-semibold tracking-wide text-fuchsia-700">Filter Tasks</p>
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-semibold text-violet-700">Priority</label>
          <select
            value={filters.filterPriority}
            onChange={(event) => actions.setFilterPriority(event.target.value)}
            className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-zinc-900 outline-none transition hover:border-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          >
            <option>All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-violet-700">Due Date</label>
          <input
            type="date"
            value={filters.filterDueDate}
            onChange={(event) => actions.setFilterDueDate(event.target.value)}
            className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-zinc-900 outline-none transition hover:border-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-violet-700">Category</label>
          <select
            value={filters.filterCategory}
            onChange={(event) => actions.setFilterCategory(event.target.value)}
            className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-zinc-900 outline-none transition hover:border-violet-300 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          >
            <option>All</option>
            {filters.categories.map((categoryOption) => (
              <option key={categoryOption} value={categoryOption}>
                {categoryOption}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="button"
        onClick={actions.onClear}
        className="mt-3 rounded-full border border-fuchsia-200 bg-white px-4 py-1.5 text-sm font-semibold text-fuchsia-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-fuchsia-50"
      >
        Clear Filters
      </button>
    </div>
  );
}
