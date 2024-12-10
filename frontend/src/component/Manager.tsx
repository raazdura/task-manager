import { useState, useEffect, useContext, ChangeEvent } from "react";
import { searchTasks } from "../services/taskServices";
import AddTask from "./AddTask";
import IconComponent from "./IconComponent";
import { useForm, SubmitHandler } from "react-hook-form";
import TaskList from "./TaskList";
import { FaSearch } from "react-icons/fa";
import { userTasks } from "../services/authService";
import { TaskContext } from "../context/taskContext"; // Import TaskContext
import { toast } from "react-toastify"; // Import toast for notifications
import { ToastContainer } from "react-toastify"; // Import ToastContainer

interface SearchFormData {
  title: string;
}

function Manager() {
  const userId = localStorage.getItem("userId");

  const taskContext = useContext(TaskContext);
  if (!taskContext) {
    throw new Error("TaskContext must be used within a TaskProvider");
  }
  const { saveTask } = taskContext;

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [tasksPerPage, setTasksPerPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  type FilterType = "all" | "completed" | "deadline";
  const [filter, setFilter] = useState<FilterType>("all");

  const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value as FilterType);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>();

  const onSubmit: SubmitHandler<SearchFormData> = async (data) => {
    try {
      const searchData = { ...data, userId };
      const response = await searchTasks(searchData);
      saveTask(response.tasks);
      console.log(response);
      toast.success("Tasks fetched successfully!");
    } catch (error: any) {
      toast.error(`Failed to search tasks: ${error.message}`);
    }
  };

  const fetchTasks = async (page: number) => {
    if (!userId) {
      setError("User ID not found. Please log in.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const offset = (page - 1) * tasksPerPage;
      const limit = tasksPerPage;
      const response = await userTasks(limit, offset, userId, filter);
      const { tasks: fetchedTasks, totalCount } = response;
      saveTask(fetchedTasks);
      console.log(response);
      setTotalPages(Math.ceil(response.totalTasks / tasksPerPage));
      // toast.success("Tasks loaded successfully!");
    } catch (err: any) {
      setError(err || "Failed to fetch tasks.");
      // toast.error("Error fetching tasks: " + (err || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(currentPage);
  }, [currentPage, filter]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const [isAddOpen, setIsAddOpen] = useState(false);
  const openAddModel = () => setIsAddOpen(true);
  const closeAdd = () => setIsAddOpen(false);

  
  console.log("Total Pages:", totalPages);

  return (
    <div className="w-screen h-screen p-16 flex justify-center items-center">
      <div className="w-full bg-gray-900 p-6 shadow-lg rounded-lg text-center">
        <h1 className="text-xl text-white font-bold mb-4">Manage Tasks</h1>
        <div className="w-full text-right font-semibold text-lg m-4">
          <button
            onClick={openAddModel}
            className="bg-blue-500 text-white py-1 px-3 rounded-md mr-4"
          >
            Add Task
          </button>
        </div>
        <div className="flex justify-between items-center w-full">
          <div className="filter bg-gray-900">
            <select
              name="filter"
              id="filter"
              className="bg-gray-800 text-white"
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="deadline">On due</option>
            </select>
          </div>
          <form
            id="search"
            className="relative outline-none border-gray-700"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="text"
              placeholder="Search task title..."
              className="h-8 px-2 rounded-md border bg-gray-800 text-white"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            <button type="submit" className="absolute right-0 h-full pr-2">
              <IconComponent icon={FaSearch} />
            </button>
          </form>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? <p className="text-gray-200">Loading tasks...</p> : <TaskList />}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md mr-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-200">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 text-gray-200 rounded-md ml-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <AddTask closeAdd={closeAdd} />
        </div>
      )}

      <ToastContainer /> {/* Make sure this is inside your component tree */}
    </div>
  );
}

export default Manager;
