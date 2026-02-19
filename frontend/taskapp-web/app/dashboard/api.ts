import { CreateTaskPayload, TaskItem, UpdateTaskPayload } from "./types";

const apiBaseUrl = "/api";

export class UnauthorizedApiError extends Error {
  constructor() {
    super("Unauthorized");
  }
}

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${apiBaseUrl}${path}`, options);

  if (response.status === 401) {
    throw new UnauthorizedApiError();
  }

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

const authHeaders = (token: string, includeJsonContentType = false) => {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (includeJsonContentType) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

export const dashboardApi = {
  getMyTasks: (token: string) =>
    request<TaskItem[]>("/tasks/me", {
      headers: authHeaders(token),
    }),

  getCategories: (token: string) =>
    request<string[]>("/tasks/categories", {
      headers: authHeaders(token),
    }),

  createTask: (token: string, payload: CreateTaskPayload) =>
    request<TaskItem>("/tasks/me", {
      method: "POST",
      headers: authHeaders(token, true),
      body: JSON.stringify(payload),
    }),

  deleteTask: (token: string, taskId: number) =>
    request<void>(`/tasks/${taskId}`, {
      method: "DELETE",
      headers: authHeaders(token),
    }),

  updateTask: (token: string, taskId: number, payload: UpdateTaskPayload) =>
    request<TaskItem>(`/tasks/${taskId}`, {
      method: "PUT",
      headers: authHeaders(token, true),
      body: JSON.stringify(payload),
    }),
};
