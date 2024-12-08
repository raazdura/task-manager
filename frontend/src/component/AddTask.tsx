import { useForm, SubmitHandler } from "react-hook-form";
import { addTask } from "../services/taskServices";

// Define the form data type
interface TaskFormData {
  task: string;
  deadline: string;
}

function AddTask() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>();

  const onSubmit: SubmitHandler<TaskFormData> = async (data) => {
    try {
      const response = await addTask(data); // Update this with actual service
      alert("Task Added Successfully!"); // Display success message
      console.log(response); // Handle the response
    } catch (error: any) {
      alert(`Failed to add task: ${error}`);
    }
  };

  return (
    <div className="w-80 rounded-lg bg-light-1 dark:bg-dark-1p-8 text-gray-200 p-4" >
      <p className="text-center text-xl font-bold leading-8">Add Task</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        {/* Task Input Field */}
        <div className="mb-4 text-sm leading-5">
          <label htmlFor="task" className="block text-gray-400 mb-1">
            Task
          </label>
          <input
            type="text"
            id="task"
            {...register("task", { required: "Task is required" })}
            placeholder="Enter your task"
            className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-gray-200 focus:border-purple-400 focus:outline-none"
          />
          {errors.task && (
            <p style={{ color: "red" }}>{errors.task.message}</p>
          )}
        </div>

        {/* Deadline Input Field */}
        <div className="mb-4 text-sm leading-5">
          <label htmlFor="deadline" className="block text-gray-400 mb-1">
            Deadline
          </label>
          <input
            type="datetime-local"
            id="deadline"
            {...register("deadline", { required: "Deadline is required" })}
            className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-gray-200 focus:border-purple-400 focus:outline-none"
          />
          {errors.deadline && (
            <p style={{ color: "red" }}>{errors.deadline.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-md bg-purple-400 p-3 text-center text-gray-900 font-semibold"
        >
          Add Task
        </button>
      </form>
    </div>
  );
}

export default AddTask;
