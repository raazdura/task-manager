import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 
import Navigation from "./component/Navigation";
import Manager from "./component/Manager";
import Login from "./component/Login";
import Signup from "./component/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./component/ProtectedRoute";  // Import your ProtectedRoute component

function App() {
  return (
    <div className="min-h-screen w-screen flex justify-center items-center bg-gray-800">
      <ToastContainer />
      <Router>
        <Navigation />

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Manager /></ProtectedRoute>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
