import { useForm, SubmitHandler } from "react-hook-form";
import { loginUser } from "../services/authService";
import { toast } from "react-toastify"; 
import { useNavigate } from "react-router-dom"; 

// Define the form data type
interface LoginFormData {
  email: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const response = await loginUser(data);
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("userId", response.user?._id);
        toast.success("Login Successful!"); // Success toast
        navigate("/");
      } else {
        toast.error("Login Failed: No token received."); // Error toast
      }
    } catch (error: any) {
      toast.error(`Login Failed: ${error.message}`); // Error toast
    }
  };

  return (
    <div className="w-80 rounded-lg bg-gray-900 p-8 text-black">
      <p className="text-center text-xl font-bold leading-8 text-white">Log In</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <div className="mb-4 text-sm leading-5">
          <label htmlFor="email" className="block text-gray-400 mb-1">
            Email
          </label>
          <input
            type="text"
            id="email"
            {...register("email", { required: "Email is required" })}
            placeholder=""
            className="w-full rounded-md border p-3 text-black focus:outline-none"
          />
          {errors.email && (
            <p style={{ color: "red" }}>{errors.email.message}</p>
          )}
        </div>
        <div className="mb-4 text-sm leading-5">
          <label htmlFor="password" className="block text-gray-400 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
            placeholder=""
            className="w-full rounded-md border p-3 text-black focus:outline-none"
          />
          {errors.password && (
            <p style={{ color: "red" }}>{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-purple-400 p-3 text-center text-gray-900 font-semibold"
        >
          Log in
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-gray-400">
        Don't have an account?
        <a
          href="/signup"
          className="text-black hover:underline hover:text-purple-400"
        >
          Sign up
        </a>
      </p>
    </div>
  );
}

export default Login;
