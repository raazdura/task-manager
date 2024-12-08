import { useForm, SubmitHandler } from "react-hook-form";
import { loginUser } from "../services/authService";

// Define the form data type
interface LoginFormData {
  username: string;
  password: string;
}

function Login() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const response = await loginUser(data);
      alert("Signup Successful!"); // Display success message
      console.log(response); // Handle the response
    } catch (error: any) {
      alert(`Signup Failed: ${error}`);
    }
  };

  return (
    <div className="w-80 rounded-lg bg-gray-900 p-8 text-gray-200">
      <p className="text-center text-xl font-bold leading-8">Log In</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <div className="mb-4 text-sm leading-5">
          <label htmlFor="username" className="block text-gray-400 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            {...register("username", { required: "Username is required" })}
            placeholder=""
            className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-gray-200 focus:border-purple-400 focus:outline-none"
          />
          {errors.username && (
            <p style={{ color: "red" }}>{errors.username.message}</p>
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
            className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-gray-200 focus:border-purple-400 focus:outline-none"
          />
          {errors.password && (
            <p style={{ color: "red" }}>{errors.password.message}</p>
          )}
        </div>
        <button type="submit" className="w-full rounded-md bg-purple-400 p-3 text-center text-gray-900 font-semibold">
          Log in
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-gray-400">
        Don't have an account?
        <a
          href="#"
          className="text-gray-200 hover:underline hover:text-purple-400"
        >
          Sign up
        </a>
      </p>
    </div>
  );
}

export default Login;
