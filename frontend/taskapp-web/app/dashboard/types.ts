export type TaskItem = {
	id: number;
	userId: number;
	title: string;
	status: string;
	description?: string;
	category: string;
	priority: string;
	dueDate: string;
	notes?: string;
	createdAt: string;
};

export type TaskFormData = {
	title: string;
	status: string;
	category: string;
	priority: string;
	dueDate: string;
	description: string;
	notes: string;
	useCustomCategory: boolean;
	newCategory: string;
};

export type DashboardState = {
	tasks: TaskItem[];
	categories: string[];
	ui: {
		loading: boolean;
		saving: boolean;
		showAddTask: boolean;
		currentPage: number;
		error: string | null;
	};
	form: TaskFormData;
	filters: {
		priority: string;
		dueDate: string;
		category: string;
	};
	editing: {
		editingTaskId: number | null;
		editStatus: string;
		editNotes: string;
		updatingTaskId: number | null;
	};
};

export type DashboardAction =
	| { type: "LOAD_TASKS_SUCCESS"; payload: { tasks: TaskItem[]; categories: string[] } }
	| { type: "LOAD_TASKS_ERROR"; payload: string }
	| { type: "FORM_SET_FIELD"; payload: { field: keyof TaskFormData; value: string | boolean } }
	| { type: "FORM_RESET" }
	| { type: "UI_SET_SHOW_ADD_TASK"; payload: boolean }
	| { type: "UI_SET_CURRENT_PAGE"; payload: number }
	| { type: "CREATE_TASK_START" }
	| { type: "CREATE_TASK_SUCCESS"; payload: { task: TaskItem; categoryValue: string } }
	| { type: "CREATE_TASK_ERROR"; payload: string }
	| { type: "DELETE_TASK_START" }
	| { type: "DELETE_TASK_SUCCESS"; payload: number }
	| { type: "DELETE_TASK_ERROR"; payload: string }
	| { type: "FILTER_SET_FIELD"; payload: { field: "priority" | "dueDate" | "category"; value: string } }
	| { type: "FILTER_CLEAR" }
	| { type: "EDIT_START"; payload: TaskItem }
	| { type: "EDIT_CANCEL" }
	| { type: "EDIT_SET_STATUS"; payload: string }
	| { type: "EDIT_SET_NOTES"; payload: string }
	| { type: "UPDATE_TASK_START"; payload: number }
	| { type: "UPDATE_TASK_SUCCESS"; payload: TaskItem }
	| { type: "UPDATE_TASK_ERROR"; payload: string };

export type CreateTaskPayload = {
	title: string;
	status: string;
	description: string | null;
	category: string;
	priority: string;
	dueDate: string;
	notes: string | null;
};

export type UpdateTaskPayload = {
	status: string;
	notes: string | null;
};
