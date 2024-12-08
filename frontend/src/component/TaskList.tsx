import React, { useState } from "react";

interface Task {
  id: string;
  name: string;
  status: string;
}

const tasks: Task[] = [
  { id: "1", name: "Task 1", status: "Pending" },
  { id: "2", name: "Task 2", status: "Completed" },
  { id: "3", name: "Task 3", status: "Pending" },
  { id: "4", name: "Task 4", status: "Completed" },
  { id: "5", name: "Task 5", status: "Pending" },
  { id: "6", name: "Task 6", status: "Completed" },
  { id: "7", name: "Task 7", status: "Pending" },
  { id: "8", name: "Task 8", status: "Completed" },
  { id: "9", name: "Task 9", status: "Pending" },
  { id: "10", name: "Task 10", status: "Completed" },
];

const tasksPerPage = 5;

function TaskList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupAction, setPopupAction] = useState<"edit" | "delete" | "complete" | null>(null);

  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setPopupAction("edit");
    setIsPopupOpen(true);
  };

  const handleDelete = (task: Task) => {
    setSelectedTask(task);
    setPopupAction("delete");
    setIsPopupOpen(true);
  };

  const handleComplete = (task: Task) => {
    setSelectedTask(task);
    setPopupAction("complete");
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedTask(null);
    setPopupAction(null);
  };

  const handleSubmitPopup = () => {
    if (!selectedTask) return;

    if (popupAction === "edit") {
      // Perform the edit action (e.g., update task name)
      console.log(`Editing task: ${selectedTask.name}`);
      // Example: update task name logic here
    } else if (popupAction === "delete") {
      // Perform the delete action
      console.log(`Deleting task: ${selectedTask.name}`);
      // Example: delete task logic here
    } else if (popupAction === "complete") {
      // Perform the complete action (toggle task status)
      const updatedStatus = selectedTask.status === "Completed" ? "Pending" : "Completed";
      console.log(`Task completed: ${selectedTask.name}, status: ${updatedStatus}`);
      // Example: update task status logic here
    }

    handleClosePopup(); // Close popup after action
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const currentTasks = tasks.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );

  return (
    <div className="overflow-x-auto bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-200 mb-4">Task List</h2>
      <table className="min-w-full bg-gray-800 text-gray-200 border border-gray-700">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b border-gray-600 text-left">Task</th>
            <th className="px-4 py-2 border-b border-gray-600 text-left">Status</th>
            <th className="px-4 py-2 border-b border-gray-600 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-700">
              <td className="px-4 py-2 border-b border-gray-600">{task.name}</td>
              <td className="px-4 py-2 border-b border-gray-600">{task.status}</td>
              <td className="px-4 py-2 border-b border-gray-600">
                <button
                  onClick={() => handleEdit(task)}
                  className="bg-blue-500 text-white py-1 px-3 rounded-md mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task)}
                  className="bg-red-500 text-white py-1 px-3 rounded-md mr-2"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleComplete(task)}
                  className="bg-green-500 text-white py-1 px-3 rounded-md"
                >
                  {task.status === "Completed" ? "Undo" : "Complete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md mr-2"
        >
          Previous
        </button>
        <span className="text-gray-200">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md ml-2"
        >
          Next
        </button>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-third p-6 rounded-lg w-1/3">
            <h3 className="text-xl text-gray-200 mb-4">
              {popupAction === "edit"
                ? "Edit Task"
                : popupAction === "delete"
                ? "Delete Task"
                : "Complete Task"}
            </h3>
            {popupAction === "edit" && selectedTask && (
              <div>
                <input
                  type="text"
                  defaultValue={selectedTask.name}
                  className="w-full bg-gray-800 text-gray-200 p-2 rounded-md mb-4"
                />
                <button
                  onClick={handleSubmitPopup}
                  className="w-full bg-blue-500 text-gray-900 p-3 rounded-md"
                >
                  Save Changes
                </button>
              </div>
            )}
            {popupAction === "delete" && selectedTask && (
              <div>
                <p className="text-gray-200 mb-4">Are you sure you want to delete the task "{selectedTask.name}"?</p>
                <button
                  onClick={handleSubmitPopup}
                  className="w-full bg-red-500 text-gray-900 p-3 rounded-md"
                >
                  Yes, Delete
                </button>
              </div>
            )}
            {popupAction === "complete" && selectedTask && (
              <div>
                <p className="text-gray-200 mb-4">
                  Are you sure you want to mark the task "{selectedTask.name}" as{" "}
                  {selectedTask.status === "Completed" ? "Pending" : "Completed"}?
                </p>
                <button
                  onClick={handleSubmitPopup}
                  className="w-full bg-green-500 text-gray-900 p-3 rounded-md"
                >
                  Yes, Complete
                </button>
              </div>
            )}

            <button
              onClick={handleClosePopup}
              className="w-full bg-gray-700 text-gray-200 p-3 rounded-md mt-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskList;
