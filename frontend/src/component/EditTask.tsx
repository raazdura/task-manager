import { useEffect } from "react";
import { useContext } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { editTask } from "../services/taskServices";
import { TaskContext } from "../context/taskContext"; // import your Tasks context
import { toast } from "react-toastify"; // Import toast

// Define the form data type
interface EditTaskFormData {
  _id: string;
  title: string;
  description: string;
  deadline: string;
  status: string;
}

interface EditProps {
  task: {
    _id: string;
    title: string;
    description: string;
    deadline: string;
    status: string;
  };
  closeEdit: () => void;
}

function EditTask({ task, closeEdit }: EditProps) {
  const { updateEditedTask } = useContext(TaskContext); // Access the context

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditTaskFormData>();

  useEffect(() => {
    reset({
      title: task.title,
      description: task.description,
      deadline: task.deadline.slice(0, 16),
      status: task.status,
    });
  }, [task, reset]);

  const onSubmit: SubmitHandler<EditTaskFormData> = async (data) => {
    try {
      const taskId = task._id;
      const taskData = { ...data, taskId };
      const response = await editTask(taskData);
      toast.success("Task Edited Successfully!"); // Show success toast
      console.log(response);

      // Update the context with the edited task
      updateEditedTask(response.task);

      closeEdit();
    } catch (error: any) {
      toast.error(`Failed to edit task: ${error}`); // Show error toast
      closeEdit();
    }
  };

  return (
    <div className="rounded-lg w-1/3 bg-gray-900 text-gray-200 p-4">
      <p className="text-center text-xl font-bold leading-8">Edit Task</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 text-left">
        {/* Task Title Field */}
        <div className="mb-4 text-sm leading-5">
          <label htmlFor="title" className="block text-gray-400 mb-1">
            Task's Title
          </label>
          <input
            type="text"
            id="title"
            {...register("title", { required: "Title is required" })}
            placeholder="Enter your title"
            className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-gray-200 focus:border-purple-400 focus:outline-none"
          />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </div>

        {/* Description Field */}
        <div className="mb-4 text-sm leading-5">
          <label htmlFor="description" className="block text-gray-400 mb-1">
            Description
          </label>
          <textarea
            id="description"
            {...register("description", { required: "Description is required" })}
            placeholder="Enter description"
            className="w-full rounded-md border border-gray-700 bg-gray-900 p-3 text-gray-200 focus:border-purple-400 focus:outline-none"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Deadline Field */}
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
            <p className="text-red-500">{errors.deadline.message}</p>
          )}
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="w-full text-right">
          <button
            type="button"
            onClick={closeEdit}
            className="rounded-md bg-gray-600 p-3 text-center text-gray-200 font-semibold m-4"
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

export default EditTask;
