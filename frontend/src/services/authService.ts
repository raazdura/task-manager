import axiosInstance from "../utils/axiosConfig";

interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginFormData {
  username: string;
  password: string;
}

// Function to send signup data
export const signupUser = async (formData: SignupFormData) => {
  try {
    console.log(formData);
    const response = await axiosInstance.post("/auth/signup", formData);
    return response.data; // Return response from the server
  } catch (error: any) {
    throw error.response?.data?.message || "An error occurred";
  }
};

// Function to send signup data
export const loginUser = async (formData: LoginFormData) => {
  try {
    console.log(formData);
    const response = await axiosInstance.post("/auth/login", formData);
    return response.data; // Return response from the server
  } catch (error: any) {
    throw error.response?.data?.message || "An error occurred";
  }
};
