import { useForm, SubmitHandler } from "react-hook-form";
import { useContext } from "react";
import { TaskContext } from "../context/taskContext"; // import your Tasks context
import { addTask as addTaskService } from "../services/taskServices";
import { toast } from "react-toastify"; // Import toast

// Define the form data type
interface TaskFormData {
  userId: string;
  title: string;
  description: string;
  deadline: string;
}

interface AddProps {
  closeAdd: () => void;
}

function AddTask({ closeAdd }: AddProps) {
  const { addTask } = useContext(TaskContext); // Access the context

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>();

  const userId = localStorage.getItem("userId");

  const onSubmit: SubmitHandler<TaskFormData> = async (data) => {
    try {
      if (!userId) {
        toast.error("User ID not found. Please log in to add tasks."); // Show error toast
        return;
      }

      const taskData = { ...data, userId };
      const response = await addTaskService(taskData);
      toast.success("Task Added Successfully!"); // Show success toast
      console.log(response);

      // Update the context with the new task
      addTask(response.task);

      closeAdd();
    } catch (error: any) {
      toast.error(`Failed to add task: ${error}`); // Show error toast
      closeAdd();
    }
  };

  return (
    <div className="w-screen h-2/4 md:h-1/3 md:w-1/3 rounded-lg bg-light-1 bg-gray-900 text-gray-200 p-4">
      <p className="text-center text-xl text-white font-bold leading-8">Add Task</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        {/* Task Input Field */}
        <div className="mb-4 text-sm leading-5">
          <label htmlFor="title" className="block text-gray-400 mb-1">
            Task's Title
          </label>
          <input
            type="text"
            id="title"
            {...register("title", { required: "title is required" })}
            placeholder="Enter your title"
            className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-gray-200 focus:border-purple-400 focus:outline-none"
          />
          {errors.title && <p style={{ color: "red" }}>{errors.title.message}</p>}
        </div>

        {/* Description Field */}
        <div className="mb-4 text-sm leading-5">
          <label htmlFor="description" className="block text-gray-400 mb-1">
            Description
          </label>
          <textarea
            id="description"
            {...register("description", { required: "description is required" })}
            placeholder="Enter your description"
            className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-gray-200 focus:border-purple-400 focus:outline-none"
          />
          {errors.description && (
            <p style={{ color: "red" }}>{errors.description.message}</p>
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
        <div className="w-full text-right">
          <button
            type="submit"
            onClick={closeAdd}
            className="rounded-md bg-purple-400 p-3 text-center text-gray-900 font-semibold m-4"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-purple-400 p-3 text-center text-gray-900 font-semibold"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTask;
