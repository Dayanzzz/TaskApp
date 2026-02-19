import { DashboardAction, DashboardState, TaskFormData } from "./types";

export const initialTaskFormData: TaskFormData = {
  title: "",
  status: "Open",
  category: "",
  priority: "Medium",
  dueDate: "",
  description: "",
  notes: "",
  useCustomCategory: false,
  newCategory: "",
};

export const initialState: DashboardState = {
  tasks: [],
  categories: [],
  ui: {
    loading: true,
    saving: false,
    showAddTask: false,
    currentPage: 1,
    error: null,
  },
  form: initialTaskFormData,
  filters: {
    priority: "All",
    dueDate: "",
    category: "All",
  },
  editing: {
    editingTaskId: null,
    editStatus: "Open",
    editNotes: "",
    updatingTaskId: null,
  },
};

export function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case "LOAD_TASKS_SUCCESS": {
      const firstCategory = action.payload.categories[0] ?? state.form.category;

      return {
        ...state,
        tasks: action.payload.tasks,
        categories: action.payload.categories,
        form: {
          ...state.form,
          category: firstCategory,
        },
        ui: {
          ...state.ui,
          loading: false,
          error: null,
        },
      };
    }

    case "LOAD_TASKS_ERROR":
      return {
        ...state,
        ui: {
          ...state.ui,
          loading: false,
          error: action.payload,
        },
      };

    case "FORM_SET_FIELD":
      return {
        ...state,
        form: {
          ...state.form,
          [action.payload.field]: action.payload.value,
        },
      };

    case "FORM_RESET":
      return {
        ...state,
        form: {
          ...initialTaskFormData,
          category: state.form.category,
        },
      };

    case "UI_SET_SHOW_ADD_TASK":
      return {
        ...state,
        ui: {
          ...state.ui,
          showAddTask: action.payload,
        },
      };

    case "UI_SET_CURRENT_PAGE":
      return {
        ...state,
        ui: {
          ...state.ui,
          currentPage: action.payload,
        },
      };

    case "CREATE_TASK_START":
      return {
        ...state,
        ui: {
          ...state.ui,
          saving: true,
          error: null,
        },
      };

    case "CREATE_TASK_SUCCESS": {
      const categoryExists = state.categories.some(
        (existingCategory) => existingCategory.toLowerCase() === action.payload.categoryValue.toLowerCase(),
      );

      const nextCategories = categoryExists
        ? state.categories
        : [...state.categories, action.payload.categoryValue].sort((left, right) => left.localeCompare(right));

      return {
        ...state,
        tasks: [...state.tasks, action.payload.task],
        categories: nextCategories,
        form: {
          ...initialTaskFormData,
          category: action.payload.categoryValue,
        },
        ui: {
          ...state.ui,
          saving: false,
          showAddTask: false,
          error: null,
        },
      };
    }

    case "CREATE_TASK_ERROR":
      return {
        ...state,
        ui: {
          ...state.ui,
          saving: false,
          error: action.payload,
        },
      };

    case "DELETE_TASK_START":
      return {
        ...state,
        ui: {
          ...state.ui,
          error: null,
        },
      };

    case "DELETE_TASK_SUCCESS":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        ui: {
          ...state.ui,
          error: null,
        },
      };

    case "DELETE_TASK_ERROR":
      return {
        ...state,
        ui: {
          ...state.ui,
          error: action.payload,
        },
      };

    case "FILTER_SET_FIELD":
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.field]: action.payload.value,
        },
        ui: {
          ...state.ui,
          currentPage: 1,
        },
      };

    case "FILTER_CLEAR":
      return {
        ...state,
        filters: {
          priority: "All",
          dueDate: "",
          category: "All",
        },
        ui: {
          ...state.ui,
          currentPage: 1,
        },
      };

    case "EDIT_START":
      return {
        ...state,
        editing: {
          ...state.editing,
          editingTaskId: action.payload.id,
          editStatus: action.payload.status,
          editNotes: action.payload.notes ?? "",
        },
      };

    case "EDIT_CANCEL":
      return {
        ...state,
        editing: {
          ...state.editing,
          editingTaskId: null,
          editStatus: "Open",
          editNotes: "",
        },
      };

    case "EDIT_SET_STATUS":
      return {
        ...state,
        editing: {
          ...state.editing,
          editStatus: action.payload,
        },
      };

    case "EDIT_SET_NOTES":
      return {
        ...state,
        editing: {
          ...state.editing,
          editNotes: action.payload,
        },
      };

    case "UPDATE_TASK_START":
      return {
        ...state,
        editing: {
          ...state.editing,
          updatingTaskId: action.payload,
        },
        ui: {
          ...state.ui,
          error: null,
        },
      };

    case "UPDATE_TASK_SUCCESS":
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.payload.id ? action.payload : task)),
        editing: {
          ...state.editing,
          editingTaskId: null,
          updatingTaskId: null,
        },
        ui: {
          ...state.ui,
          error: null,
        },
      };

    case "UPDATE_TASK_ERROR":
      return {
        ...state,
        editing: {
          ...state.editing,
          updatingTaskId: null,
        },
        ui: {
          ...state.ui,
          error: action.payload,
        },
      };

    default:
      return state;
  }
}
