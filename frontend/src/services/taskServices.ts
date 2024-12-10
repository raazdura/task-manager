import axiosInstance from "../utils/axiosConfig";

interface TaskFormData {
  userId: string
  title: string;
  description: string;
  deadline: string;
}
interface EditTaskFormData {
  taskId: string
  title: string;
  description: string;
  deadline: string;
}

interface TaskIdData {
  id: string;
}

interface CompleteTaskData {
  taskId: string;
}

interface SearchFormData {
  title: string;
}

// Function to add a task
export const addTask = async (formData: TaskFormData) => {
  try {
    console.log("Adding Task:", formData);
    const response = await axiosInstance.post("tasks/tasks", formData); // Adjusted endpoint
    return response.data; // Return response from the server
  } catch (error: any) {
    console.log(error);
    throw error.response?.data?.message || "An error occurred while adding the task.";
  }
};

// Function to fetch all tasks for a user
export const fetchAllTasks = async (limit: number, offset: number, userId: string) => {
  try {
    console.log("Fetching Tasks with offset:", offset, "limit:", limit, "userId:", userId);
    const response = await axiosInstance.get(`/tasks/tasks`, {
      params: { limit, offset, userId }, // Pass limit and offset as query params
    });
    return response.data; // Return response from the server
  } catch (error: any) {
    throw error.response?.data?.message || "An error occurred while fetching tasks.";
  }
};

// Function to edit a task
export const editTask = async (formData: EditTaskFormData) => {
  try {
    console.log("Editing Task:", formData);
    const response = await axiosInstance.put(`tasks/update`, formData); // Adjusted endpoint to include task ID
    return response.data; // Return response from the server
  } catch (error: any) {
    throw error.response?.data?.message || "An error occurred while editing the task.";
  }
};

// Function to delete a task
export const deleteTask = async (taskIdData: TaskIdData) => {
  try {
    console.log("Deleting Task with ID:", taskIdData.id);
    const response = await axiosInstance.delete(`/tasks/${taskIdData.id}`); // Adjusted endpoint to use DELETE method
    return response.data; // Return response from the server
  } catch (error: any) {
    throw error.response?.data?.message || "An error occurred while deleting the task.";
  }
};

// Function to mark a task as complete
export const completeTask = async (taskId: CompleteTaskData) => {
  try {
    console.log("Completing Task with ID:", taskId);
    const response = await axiosInstance.patch(`/tasks/${taskId}/complete`); // Adjusted endpoint to use PATCH method
    return response.data; // Return response from the server
  } catch (error: any) {
    throw error.response?.data?.message || "An error occurred while completing the task.";
  }
};

// export const searchTasks = async (formData: SearchFormData) => {
//   try {
//     console.log("Searching task with title", formData);
//     const response = await axiosInstance.get("tasks/search", formData); 
//     return response.data; // Return response from the server
//   } catch (error: any) {
//     console.log(error.response?.data?.message);
//     throw error.response?.data?.message || "An error occurred while searching the task.";
//   }
// };

export const searchTasks = async (formData: SearchFormData) => {
  try {
    console.log("Searching Task:", formData);
    const response = await axiosInstance.post("tasks/search", formData); // Adjusted endpoint
    return response.data; // Return response from the server
  } catch (error: any) {
    console.log(error.response?.data?.message );
    throw error.response?.data?.message || "An error occurred while adding the task.";
  }
};
