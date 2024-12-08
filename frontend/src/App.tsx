import { useEffect } from "react"
import Navigation from "./component/Navigation";
import Manager from "./component/Manager";
import Login from "./component/Login"
import Signup from "./component/Signup"


function App() {

  useEffect(() => {
    const token = localStorage.getItem("token");
  },[])

  return (
    <div className='h-screen w-screen bg-light dark:bg-dark '>
      <Navigation />
      <Manager />
      

      {/* <Login /> */}
      {/* <Signup /> */}
    </div>
  )
}

export default App
