import axiosInstance from "../utils/axiosConfig";

interface TaskFormData {
    task: string;
    deadline: string;
  }

interface deleteFormData {
  id: string;
}

// Function to send signup data
export const addTask = async (formData: TaskFormData) => {
  try {
    console.log(formData);
    const response = await axiosInstance.post("/task/addtask", formData);
    return response.data; // Return response from the server
  } catch (error: any) {
    throw error.response?.data?.message || "An error occurred";
  }
};

// Function to send signup data
export const editTask = async (formData: TaskFormData) => {
  try {
    console.log(formData);
    const response = await axiosInstance.post("/task/edit", formData);
    return response.data; // Return response from the server
  } catch (error: any) {
    throw error.response?.data?.message || "An error occurred";
  }
};

export const deleteTask = async (formData: TaskFormData) => {
  try {
    console.log(formData);
    const response = await axiosInstance.post("/task/edit", formData);
    return response.data; // Return response from the server
  } catch (error: any) {
    throw error.response?.data?.message || "An error occurred";
  }
};

export const completeTask = async (formData: deleteFormData) => {
  try {
    console.log(formData);
    const response = await axiosInstance.post("/task/delete", formData);
    return response.data; // Return response from the server
  } catch (error: any) {
    throw error.response?.data?.message || "An error occurred";
  }
};
