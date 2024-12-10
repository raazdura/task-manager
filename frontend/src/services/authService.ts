import axiosInstance from "../utils/axiosConfig";

interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

// Function to send signup data
export const signupUser = async (formData: SignupFormData) => {
  try {
    const response = await axiosInstance.post("/user/register", formData);
    return response.data; // Return response from the server
  } catch (error: any) {
    console.log(error);
    throw error.response?.data?.message || "An error occurred";
  }
};

// Function to send signup data
export const loginUser = async (formData: LoginFormData) => {
  try {
    console.log(formData);
    const response = await axiosInstance.post("/user/login", formData);
    return response.data; // Return response from the server
  } catch (error: any) {
    throw error.response?.data?.message || "An error occurred";
  }
};

export const userDetails = async (userId: string) => {
  try {
    console.log(userId);
    const response = await axiosInstance.get(`user/${userId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || "An error occurred";
  }
};

export const userTasks = async (limit: number, offset: number, userId: string, filter: string) => {
  try {
    // console.log("Fetching Tasks with offset:", offset, "limit:", limit, "userId:", userId);
    const response = await axiosInstance.get(`user/user/${userId}/tasks`, {
      params: { limit, offset, filter }, // Pass limit and offset as query params
    });
    return response.data; // Return response from the server
  } catch (error: any) {
    throw error.response?.data?.message || "An error occurred while fetching tasks.";
  }
};




