import { useMemo } from "react";
import { TaskItem } from "../types";

export function useDashboardPagination(tasks: TaskItem[], currentPage: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(tasks.length / pageSize));
  const current = Math.min(currentPage, totalPages);

  const paginatedTasks = useMemo(() => {
    const start = (current - 1) * pageSize;
    return tasks.slice(start, start + pageSize);
  }, [current, pageSize, tasks]);

  const hasPagination = tasks.length > pageSize;

  return { paginatedTasks, totalPages, currentPage: current, hasPagination };
}
