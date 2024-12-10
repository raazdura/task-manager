import { useState, useContext } from "react";
import { TaskContext } from "../context/taskContext"; // Import TaskContext
import EditTask from "./EditTask";
import axiosInstance from "../utils/axiosConfig";
import { convertToLocalTime } from "../services/convertToLocalTime";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import the Toast styles

interface Task {
  _id: string;
  title: string;
  description: string;
  deadline: string;
  status: string;
}

function TaskList() {
  const { tasks, deleteTask, updateTaskStatus } = useContext(TaskContext); // Use TaskContext

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleDelete = async (taskId: string) => {
    try {
      const response = await axiosInstance.delete(`/tasks/${taskId}`);
      deleteTask(response.data.task); // Remove the task from context
      setIsModalOpen(false); // Close modal
      setTaskToDelete(null); // Clear taskToDelete
      toast.success("Task deleted successfully!"); // Show success toast
    } catch (error) {
      console.error("Error deleting task", error);
      toast.error("Failed to delete task!"); // Show error toast
    }
  };

  const openDeleteModal = (task: Task) => {
    setTaskToDelete(task); // Store the task to be deleted
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal without deleting
    setTaskToDelete(null); // Clear taskToDelete
  };

  const openEditModel = (task: Task) => {
    setTaskToEdit(task); // Store the task to be edited
    setIsEditOpen(true); // Open the modal
  };

  const closeEdit = () => {
    setIsEditOpen(false); // Close the modal without editing
    setTaskToEdit(null); // Clear taskToEdit
  };

  const handleComplete = async (task: Task) => {
    try {
      const taskId = task._id;
      const response = await axiosInstance.put(`/tasks/${taskId}/status`);
      const updatedTask = response.data.task;

      // Update the task status in the context
      updateTaskStatus(updatedTask);
      toast.success("Task status updated to completed!"); // Show success toast
    } catch (error) {
      console.error("Failed to update task status", error);
      toast.error("Failed to update task status!"); // Show error toast
    }
  };

  return (
    <div className="overflow-x-auto mt-4 bg-gray-900 rounded-lg">
      <table className="min-w-full bg-gray-800 text-gray-200 border border-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b border-gray-600 text-left">Task Title</th>
            <th className="px-4 py-2 border-b border-gray-600 text-left">Description</th>
            <th className="px-4 py-2 border-b border-gray-600 text-left">Deadline</th>
            <th className="px-4 py-2 border-b border-gray-600 text-left">Status</th>
            <th className="px-4 py-2 border-b border-gray-600 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className="hover:bg-gray-700">
              <td className="px-4 py-2 border-b border-gray-600">{task.title}</td>
              <td className="px-4 py-2 border-b border-gray-600">{task.description}</td>
              <td className="px-4 py-2 border-b border-gray-600">{convertToLocalTime(task.deadline)}</td>
              <td className="px-4 py-2 border-b border-gray-600">
                <span className={`py-1 px-3 rounded-md text-semibold ${task.status === "completed" ? "bg-green-500" : "bg-yellow-500"}`}>
                  {task.status}
                </span>
              </td>
              <td className="px-4 py-2 border-b border-gray-600">
                <button onClick={() => openEditModel(task)} className="bg-blue-500 text-white py-1 px-3 rounded-md mr-2">Edit</button>
                <button onClick={() => openDeleteModal(task)} className="bg-red-500 text-white py-1 px-3 rounded-md mr-2">Delete</button>
                <button onClick={() => handleComplete(task)} className="bg-green-500 text-white py-1 px-3 rounded-md">Complete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {isModalOpen && taskToDelete && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-gray-700 text-gray-200 p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete the task "{taskToDelete.title}"?</p>
            <div className="mt-4 flex justify-end">
              <button onClick={closeModal} className="bg-gray-500 text-white py-1 px-3 rounded-md mr-2">Cancel</button>
              <button onClick={() => handleDelete(taskToDelete._id)} className="bg-red-500 text-white py-1 px-3 rounded-md">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {isEditOpen && taskToEdit && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <EditTask task={taskToEdit} closeEdit={closeEdit} />
        </div>
      )}  
    </div>
  );
}

export default TaskList;
