interface Task {
    _id: string;
    title: string;
    description: string;
    deadline: string;
    status: string;
  }

  export interface TaskContextType {
    tasks: Task[];
    saveTask: (tasks: Task[]) => void; // Function to save multiple tasks
    addTask: (task: Task) => void
    updateEditedTask: (updatedTask: Task) => void; // Function to update a specific task
    updateTaskStatus: (updatedTask: Task) => void; // Function to update the status of a task
    deleteTask: (taskToDelete: Task) => void; // Function to delete a task
  }