import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import VerifyOtp from './components/VerifyOtp';
import AddFriends from './components/AddFriends';
import Notifications from './components/Notifications';
import Settings from './components/Settings';
import Logout from './components/Logout';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="App">
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Routes>
          <Route exact path="/" element={<Home/>}></Route>
          <Route exact path="/login" element={<Login/>}></Route>
          <Route exact path="/logout" element={<Logout/>}></Route>
          <Route exact path="/Signup" element={<SignUp/>}></Route>
          <Route exact path="/VerifyOtp" element={<VerifyOtp/>}></Route>
          <Route exact path="/contact" element={<AddFriends/>}></Route>
          <Route exact path="/addFriends" element={<AddFriends/>}></Route>
          <Route exact path="/notifications" element={<Notifications/>}></Route>
          <Route exact path="/settings" element={<Settings/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
