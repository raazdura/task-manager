import { useForm, SubmitHandler } from "react-hook-form";
import { signupUser } from "../services/authService";
import { toast } from "react-toastify"; 
import { useNavigate } from "react-router-dom"; 

// Define the form data type
interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function Signup() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>();

  // Watch password value for confirm password validation
  const password = watch("password");

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    try {
      const response = await signupUser(data);
      console.log(response);
      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("userId", response.user?._id);
        toast.success("Signup Successful!"); 
        navigate('/');
      } else {
        toast.error("Signup Failed: No token received."); // Error toast
      }
    } catch (error: any) {
      toast.error(`Signup Failed: ${error.message}`); // Error toast
    }
  };

  return (
    <div className="w-80 mt-14 rounded-lg bg-gray-900 p-8 text-black">
      <p className="text-center text-xl font-bold leading-8 text-white">Sign Up</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        {/* Username Field */}
        <div className="mb-4 text-sm leading-5">
          <label htmlFor="username" className="block text-gray-400 mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            {...register("username", { required: "Username is required" })}
            placeholder=""
            className={`w-full rounded-md border p-3 text-black focus:outline-none ${
              errors.username ? "border-red-500" : "border-gray-700"
            }`}
          />
          {errors.username && (
            <p style={{ color: "red" }} className="mt-1 text-sm">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Email Field */}
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
            className={`w-full rounded-md border p-3 text-black focus:outline-none ${
              errors.email ? "border-red-500" : "border-gray-700"
            }`}
          />
          {errors.email && (
            <p style={{ color: "red" }} className="mt-1 text-sm">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
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
            className={`w-full rounded-md border p-3 text-black focus:outline-none ${
              errors.password ? "border-red-500" : "border-gray-700"
            }`}
          />
          {errors.password && (
            <p style={{ color: "red" }} className="mt-1 text-sm">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="mb-4 text-sm leading-5">
          <label htmlFor="confirm-password" className="block text-gray-400 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm-password"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value) =>
                value === password || "Passwords do not match", // Custom validation to check if passwords match
            })}
            placeholder=""
            className={`w-full rounded-md border p-3 text-black focus:outline-none ${
              errors.confirmPassword ? "border-red-500" : "border-gray-700"
            }`}
          />
          {errors.confirmPassword && (
            <p style={{ color: "red" }} className="mt-1 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-md bg-purple-400 p-3 mt-4 text-center text-gray-900 font-semibold"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-400">
        Already have an account?
        <a
          href="/login"
          className="text-gray-400 hover:underline hover:text-purple-400"
        >
          Log in
        </a>
      </p>
    </div>
  );
}

export default Signup;
