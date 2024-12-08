import { useForm, SubmitHandler } from "react-hook-form";
import { signupUser } from "../services/authService";

// Define the form data type
interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>();

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    try {
      const response = await signupUser(data);
      alert("Signup Successful!"); // Display success message
      console.log(response); // Handle the response
    } catch (error: any) {
      alert(`Signup Failed: ${error}`);
    }
  };

  return (
    <div className="w-80 rounded-lg bg-gray-900 p-8 text-gray-200">
      <p className="text-center text-xl font-bold leading-8">Sign Up</p>
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
          <label htmlFor="email" className="block text-gray-400 mb-1">
            Email
          </label>
          <input
            type="text"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email format",
              },
            })}
            placeholder=""
            className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-gray-200 focus:border-purple-400 focus:outline-none"
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
            className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-gray-200 focus:border-purple-400 focus:outline-none"
          />
          {errors.password && (
            <p style={{ color: "red" }}>{errors.password.message}</p>
          )}
        </div>
        <div className="mb-4 text-sm leading-5">
          <label
            htmlFor="conform-password"
            className="block text-gray-400 mb-1"
          >
            Conform Password
          </label>
          <input
            type="password"
            id="conform-password"
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
        <button
          type="submit"
          className="w-full rounded-md bg-purple-400 p-3 text-center text-gray-900 font-semibold"
        >
          Sign in
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-gray-400">
        Already have an account.
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

export default Signup;
