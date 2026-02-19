import { Dispatch, useCallback } from "react";
import { dashboardApi, UnauthorizedApiError } from "../api";
import { DashboardAction, TaskFormData, TaskItem } from "../types";

type RouterLike = {
  push: (href: string) => void;
};

export function useDashboardActions(dispatch: Dispatch<DashboardAction>, router: RouterLike) {
  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("taskapp_token");
    router.push("/login");
  }, [router]);

  const handleCreateTask = useCallback(
    async (form: TaskFormData) => {
      const categoryValue = form.useCustomCategory ? form.newCategory.trim() : form.category.trim();
      if (!categoryValue) {
        dispatch({ type: "CREATE_TASK_ERROR", payload: "Category is required." });
        return;
      }

      const token = localStorage.getItem("taskapp_token");
      if (!token) {
        router.push("/login");
        return;
      }

      dispatch({ type: "CREATE_TASK_START" });

      try {
        const createdTask = await dashboardApi.createTask(token, {
          title: form.title,
          status: form.status,
          description: form.description || null,
          category: categoryValue,
          priority: form.priority,
          dueDate: form.dueDate,
          notes: form.notes || null,
        });

        dispatch({ type: "CREATE_TASK_SUCCESS", payload: { task: createdTask, categoryValue } });
      } catch (createError) {
        if (createError instanceof UnauthorizedApiError) {
          handleUnauthorized();
          return;
        }

        dispatch({ type: "CREATE_TASK_ERROR", payload: "Could not create task." });
      }
    },
    [dispatch, handleUnauthorized, router],
  );

  const handleDeleteTask = useCallback(
    async (taskId: number) => {
      if (!window.confirm("Delete this task?")) {
        return;
      }

      const token = localStorage.getItem("taskapp_token");
      if (!token) {
        router.push("/login");
        return;
      }

      dispatch({ type: "DELETE_TASK_START" });

      try {
        await dashboardApi.deleteTask(token, taskId);
        dispatch({ type: "DELETE_TASK_SUCCESS", payload: taskId });
      } catch (deleteError) {
        if (deleteError instanceof UnauthorizedApiError) {
          handleUnauthorized();
          return;
        }

        dispatch({ type: "DELETE_TASK_ERROR", payload: "Could not delete task." });
      }
    },
    [dispatch, handleUnauthorized, router],
  );

  const handleUpdateTask = useCallback(
    async (taskId: number, editStatus: string, editNotes: string) => {
      const token = localStorage.getItem("taskapp_token");
      if (!token) {
        router.push("/login");
        return;
      }

      dispatch({ type: "UPDATE_TASK_START", payload: taskId });

      try {
        const updatedTask = await dashboardApi.updateTask(token, taskId, {
          status: editStatus,
          notes: editNotes.trim() ? editNotes.trim() : null,
        });

        dispatch({ type: "UPDATE_TASK_SUCCESS", payload: updatedTask });
      } catch (updateError) {
        if (updateError instanceof UnauthorizedApiError) {
          handleUnauthorized();
          return;
        }

        dispatch({ type: "UPDATE_TASK_ERROR", payload: "Could not update task." });
      }
    },
    [dispatch, handleUnauthorized, router],
  );

  const startEditingTask = useCallback(
    (task: TaskItem) => {
      dispatch({ type: "EDIT_START", payload: task });
    },
    [dispatch],
  );

  const cancelEditingTask = useCallback(() => {
    dispatch({ type: "EDIT_CANCEL" });
  }, [dispatch]);

  return {
    handleUnauthorized,
    handleCreateTask,
    handleDeleteTask,
    handleUpdateTask,
    startEditingTask,
    cancelEditingTask,
  };
}
