

function Navigation() {

  return (
    <div className=" fixed w-screen h-16 dark:bg-dark">
      <nav className="mx-4 flex justify-between items-center text-white" >
        <h1>Task Manager</h1>
        <div className="flex gap-4">
            <h1>Dark/Light</h1>
            <h1>Notification</h1>
            <h1>Profile</h1>
        </div>

      </nav>
    </div>
  );
}

export default Navigation;
