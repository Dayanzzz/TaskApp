import { useMemo } from "react";
import { DashboardState } from "../types";

export function useDashboardFilteredTasks(state: DashboardState) {
  const normalize = (value: string) => value.trim().toLowerCase();

  return useMemo(
    () =>
      state.tasks
        .filter((task) => {
          const priorityMatches =
            state.filters.priority === "All" || normalize(task.priority) === normalize(state.filters.priority);
          const dueDateMatches = !state.filters.dueDate || String(task.dueDate).split("T")[0] === state.filters.dueDate;
          const categoryMatches =
            state.filters.category === "All" || normalize(task.category) === normalize(state.filters.category);

          return priorityMatches && dueDateMatches && categoryMatches;
        })
        .sort((leftTask, rightTask) => {
          const leftDue = new Date(`${String(leftTask.dueDate).split("T")[0]}T00:00:00`).getTime();
          const rightDue = new Date(`${String(rightTask.dueDate).split("T")[0]}T00:00:00`).getTime();

          if (Number.isNaN(leftDue) && Number.isNaN(rightDue)) {
            return 0;
          }

          if (Number.isNaN(leftDue)) {
            return 1;
          }

          if (Number.isNaN(rightDue)) {
            return -1;
          }

          return leftDue - rightDue;
        }),
    [state.tasks, state.filters.priority, state.filters.dueDate, state.filters.category],
  );
}
