import { Dispatch, useCallback, useMemo } from "react";
import { DashboardAction, DashboardState } from "../types";

export function useDashboardFilters(state: DashboardState, dispatch: Dispatch<DashboardAction>) {
  const setFilterField = useCallback((field: "priority" | "dueDate" | "category", value: string) => {
    dispatch({ type: "FILTER_SET_FIELD", payload: { field, value } });
  }, [dispatch]);

  const clearFilters = useCallback(() => {
    dispatch({ type: "FILTER_CLEAR" });
  }, [dispatch]);

  const filterCategories = useMemo(
    () =>
      Array.from(new Set([...state.categories, ...state.tasks.map((task) => task.category)])).sort((left, right) =>
        left.localeCompare(right),
      ),
    [state.categories, state.tasks],
  );

  const filterState = useMemo(
    () => ({
      filterPriority: state.filters.priority,
      filterDueDate: state.filters.dueDate,
      filterCategory: state.filters.category,
      categories: filterCategories,
    }),
    [filterCategories, state.filters.category, state.filters.dueDate, state.filters.priority],
  );

  const filterActions = useMemo(
    () => ({
      setFilterPriority: (value: string) => setFilterField("priority", value),
      setFilterDueDate: (value: string) => setFilterField("dueDate", value),
      setFilterCategory: (value: string) => setFilterField("category", value),
      onClear: clearFilters,
    }),
    [clearFilters, setFilterField],
  );

  return { filterState, filterActions };
}
