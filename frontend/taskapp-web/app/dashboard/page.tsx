"use client";

import { useCallback, useEffect, useReducer } from "react";
import { useRouter } from "next/navigation";
import { AddTaskForm } from "./components/AddTaskForm";
import { DashboardPagination } from "./components/DashboardPagination";
import { DashboardTasksList } from "./components/DashboardTasksList";
import { dashboardApi, UnauthorizedApiError } from "./api";
import { dashboardReducer, initialState } from "./dashboardReducer";
import { useDashboardActions } from "./hooks/useDashboardActions";
import { useDashboardForm } from "./hooks/useDashboardForm";
import { useDashboardPagination } from "./hooks/useDashboardPagination";

export default function DashboardPage() {
  const pageSize = 4;
  const router = useRouter();
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const {
    handleUnauthorized,
    handleCreateTask,
    handleDeleteTask,
    handleUpdateTask,
    startEditingTask,
    cancelEditingTask,
  } = useDashboardActions(dispatch, router);

  const { formState, formActions, onCancel } = useDashboardForm(state, dispatch, handleUnauthorized, handleCreateTask);

  useEffect(() => {
    const loadTasks = async () => {
      const token = localStorage.getItem("taskapp_token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const [tasksData, categoriesData] = await Promise.all([
          dashboardApi.getMyTasks(token),
          dashboardApi.getCategories(token),
        ]);

        dispatch({ type: "LOAD_TASKS_SUCCESS", payload: { tasks: tasksData, categories: categoriesData } });
      } catch (loadError) {
        if (loadError instanceof UnauthorizedApiError) {
          handleUnauthorized();
          return;
        }

        dispatch({ type: "LOAD_TASKS_ERROR", payload: "Could not connect to backend API." });
      }
    };

    void loadTasks();
  }, [handleUnauthorized, router]);

  const onUpdateTask = useCallback(
    async (taskId: number) => {
      await handleUpdateTask(taskId, state.editing.editStatus, state.editing.editNotes);
    },
    [handleUpdateTask, state.editing.editNotes, state.editing.editStatus],
  );


  const setCurrentPage = useCallback((value: number) => {
    dispatch({ type: "UI_SET_CURRENT_PAGE", payload: value });
  }, []);
  const { paginatedTasks, totalPages, currentPage, hasPagination } = useDashboardPagination(
    state.tasks,
    state.ui.currentPage,
    pageSize,
  );

  return (
    <main className="min-h-screen bg-linear-to-br from-violet-100 via-fuchsia-50 to-cyan-100 px-6 py-10">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(244,114,182,0.12),transparent_35%),radial-gradient(circle_at_85%_25%,rgba(167,139,250,0.12),transparent_40%),radial-gradient(circle_at_50%_90%,rgba(34,211,238,0.12),transparent_40%)]" />

      <div className="mx-auto w-full max-w-5xl rounded-3xl border border-violet-200/70 bg-white/75 p-3 shadow-[0_18px_45px_-20px_rgba(124,58,237,0.45)] backdrop-blur">
        <div className="rounded-2xl border border-fuchsia-100 bg-white/90 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          <AddTaskForm
            form={{ ...formState, showAddTask: state.ui.showAddTask, saving: state.ui.saving }}
            actions={formActions}
            onCancel={onCancel}
          />


        {state.ui.loading ? <p className="mt-6 text-zinc-600">Loading your tasks...</p> : null}
        {state.ui.error ? <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">{state.ui.error}</p> : null}

        {!state.ui.loading && !state.ui.error ? (
          <DashboardTasksList
            tasks={paginatedTasks}
            editing={state.editing}
            actions={{
              onStartEdit: startEditingTask,
              onCancelEdit: cancelEditingTask,
              onSave: onUpdateTask,
              onDelete: handleDeleteTask,
              setEditStatus: (value: string) => dispatch({ type: "EDIT_SET_STATUS", payload: value }),
              setEditNotes: (value: string) => dispatch({ type: "EDIT_SET_NOTES", payload: value }),
            }}
          />
        ) : null}

        {!state.ui.loading && !state.ui.error ? (
          <DashboardPagination
            hasPagination={hasPagination}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        ) : null}

        {!state.ui.loading && !state.ui.error && paginatedTasks.length === 0 ? (
          <p className="mt-6 rounded-xl border border-violet-100 bg-violet-50 px-3 py-2 text-sm text-violet-700">
            No tasks yet ✨
          </p>
        ) : null}
        </div>
      </div>
    </main>
  );
}
