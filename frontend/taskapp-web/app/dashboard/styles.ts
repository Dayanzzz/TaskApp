export const getPriorityClasses = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "medium":
      return "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700";
    case "low":
      return "border-cyan-200 bg-cyan-50 text-cyan-700";
    default:
      return "border-violet-200 bg-violet-50 text-violet-700";
  }
};

export const getStatusClasses = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "in progress":
      return "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700";
    case "open":
      return "border-violet-200 bg-violet-50 text-violet-700";
    default:
      return "border-violet-200 bg-violet-50 text-violet-700";
  }
};

export const getDueDateClasses = (dueDate: string) => {
  const due = new Date(`${String(dueDate).split("T")[0]}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (Number.isNaN(due.getTime())) {
    return "text-violet-600";
  }

  const diffInMs = due.getTime() - today.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays < 0) {
    return "text-rose-700";
  }

  if (diffInDays <= 2) {
    return "text-fuchsia-700";
  }

  return "text-cyan-700";
};
