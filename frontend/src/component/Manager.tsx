import AddTask from "./AddTask";
import TaskList from "./TaskList";

function Manager() {
  return (
    <div className="w-screen h-screen flex justify-center items-center gap-4">

      <AddTask />
      <div className="w-2/3 bg-light-1 dark:bg-dark-1 p-4 shadow-lg rounded-lg text-center">
        <h1 className="text-xl font-bold mb-4">Manage Tasks</h1>
        <TaskList />
      </div>
    </div>
  );
}

export default Manager;
