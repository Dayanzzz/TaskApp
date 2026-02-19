import { Dispatch, FormEvent, useCallback, useMemo } from "react";
import { DashboardAction, DashboardState, TaskFormData } from "../types";

type CreateTaskHandler = (form: TaskFormData) => Promise<void>;

type UnauthorizedHandler = () => void;

export function useDashboardForm(
  state: DashboardState,
  dispatch: Dispatch<DashboardAction>,
  handleUnauthorized: UnauthorizedHandler,
  handleCreateTask: CreateTaskHandler,
) {
  const setFormField = useCallback(
    <K extends keyof TaskFormData>(field: K, value: TaskFormData[K]) => {
      dispatch({ type: "FORM_SET_FIELD", payload: { field, value } });
    },
    [dispatch],
  );

  const setShowAddTask = useCallback(
    (value: boolean) => {
      dispatch({ type: "UI_SET_SHOW_ADD_TASK", payload: value });
    },
    [dispatch],
  );

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await handleCreateTask(state.form);
    },
    [handleCreateTask, state.form],
  );

  const onCancel = useCallback(() => {
    dispatch({ type: "FORM_RESET" });
    dispatch({ type: "UI_SET_SHOW_ADD_TASK", payload: false });
  }, [dispatch]);

  const formState = useMemo(
    () => ({
      title: state.form.title,
      status: state.form.status,
      category: state.form.category,
      priority: state.form.priority,
      dueDate: state.form.dueDate,
      description: state.form.description,
      notes: state.form.notes,
      categories: state.categories,
      useCustomCategory: state.form.useCustomCategory,
      newCategory: state.form.newCategory,
    }),
    [
      state.categories,
      state.form.category,
      state.form.description,
      state.form.dueDate,
      state.form.newCategory,
      state.form.notes,
      state.form.priority,
      state.form.status,
      state.form.title,
      state.form.useCustomCategory,
    ],
  );

  const formActions = useMemo(
    () => ({
      setShowAddTask,
      setTitle: (value: string) => setFormField("title", value),
      setStatus: (value: string) => setFormField("status", value),
      setCategory: (value: string) => setFormField("category", value),
      setPriority: (value: string) => setFormField("priority", value),
      setDueDate: (value: string) => setFormField("dueDate", value),
      setDescription: (value: string) => setFormField("description", value),
      setNotes: (value: string) => setFormField("notes", value),
      setUseCustomCategory: (value: boolean) => setFormField("useCustomCategory", value),
      setNewCategory: (value: string) => setFormField("newCategory", value),
      onSubmit,
      onLogout: handleUnauthorized,
    }),
    [handleUnauthorized, onSubmit, setFormField, setShowAddTask],
  );

  return { formState, formActions, onCancel };
}
