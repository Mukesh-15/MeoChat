// import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import VerifyOtp from './components/VerifyOtp';
import AddFriends from './components/AddFriends';



function App() {
  return (
      <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Home/>}></Route>
          <Route exact path="/login" element={<Login/>}></Route>
          <Route exact path="/Signup" element={<SignUp/>}></Route>
          <Route exact path="/VerifyOtp" element={<VerifyOtp/>}></Route>
          <Route exact path="/addFriends" element={<AddFriends/>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
