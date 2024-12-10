import React, { useState, createContext, ReactNode } from "react";
import { TaskContextType, Task } from "../types/tasks";

// Create the TaskContext
export const TaskContext = createContext<TaskContextType>({
  tasks: [],
  saveTask: () => {},
  addTask: () => {},
  updateEditedTask: () => {},
  updateTaskStatus: () => {},
  deleteTask: () => {},
});

const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Save new tasks (array of tasks)
  const saveTask = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  const addTask = (newTask: Task) => {
    setTasks((prevTasks) => [newTask, ...prevTasks ]);
  };

  // Update an existing task (by _id)
  const updateEditedTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? { ...task, ...updatedTask } : task
      )
    );
  };

  // Update the status of a task (by _id)
  const updateTaskStatus = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? { ...task, status: updatedTask.status } : task
      )
    );
  };

  // Delete a task (by _id)
  const deleteTask = (taskToDelete: Task) => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task._id !== taskToDelete._id)
    );
  };

  return (
    <TaskContext.Provider
      value={{ tasks, saveTask, addTask, updateEditedTask, updateTaskStatus, deleteTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskProvider;
