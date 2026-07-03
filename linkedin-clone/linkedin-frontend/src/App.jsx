import { useState, useEffect, use } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import Navbar1 from "./components/Navbar/Navbar1";
import Navbar2 from "./components/Navbar/Navbar2";
import LandingPage from "./pages/LandingPage/LandingPage";
import Footer from "./components/Footer/Footer";
import SignUp from "./pages/SignUpPage/SignUp";
import Login from "./pages/LoginPage/Login";
import { Route, Routes, Navigate } from "react-router-dom";
import Feeds from "./pages/Feeds/Feeds";
import MyNetwork from "./pages/MyNetwork/MyNetwork";
import Resume from "./pages/Resume/Resume";
import Messages from "./pages/Messages/Messages";
import Profile from "./pages/Profile/Profile";
import Activities from "./pages/Activities/Activities";
import SingleActivity from "./pages/SingleActivity/SingleActivity";
import Notifications from "./pages/Notifications/Notifications";
import axios from "axios";

function App() {
  const [isLogin, setIsLogin] = useState(localStorage.getItem("isLogin"));

  const changeLoginStatus = (status) => {
    setIsLogin(status);
  };
  // useEffect(() => {
  //   fetchData();
  // }, []);
  return (
    <div className="bg-gray-100 w-full h-full box-border">
      {isLogin ? <Navbar2 /> : <Navbar1 />}
      <Routes>
        <Route
          path="/"
          element={
            isLogin ? (
              <Navigate to="/feeds" />
            ) : (
              <LandingPage changeLoginStatus={changeLoginStatus} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isLogin ? (
              <Navigate to="/feeds" />
            ) : (
              <SignUp changeLoginStatus={changeLoginStatus} />
            )
          }
        />

        <Route
          path="/login"
          element={
            isLogin ? (
              <Navigate to="/feeds" />
            ) : (
              <Login changeLoginStatus={changeLoginStatus} />
            )
          }
        />

        <Route
          path="/feeds"
          element={isLogin ? <Feeds /> : <Navigate to="/login" />}
        />
        <Route
          path="/mynetwork"
          element={isLogin ? <MyNetwork /> : <Navigate to="/login" />}
        />
        <Route
          path="/resume"
          element={isLogin ? <Resume /> : <Navigate to="/login" />}
        />
        <Route
          path="/messages"
          element={isLogin ? <Messages /> : <Navigate to="/login" />}
        />
        <Route
          path="/notifications"
          element={isLogin ? <Notifications /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:id"
          element={isLogin ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:id/activities"
          element={isLogin ? <Activities /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:id/activities/:postId"
          element={isLogin ? <SingleActivity /> : <Navigate to="/login" />}
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
