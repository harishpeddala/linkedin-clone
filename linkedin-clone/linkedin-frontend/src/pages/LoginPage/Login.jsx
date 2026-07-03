import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleLoginComp from "../../components/GoogleLogin/GoogleLoginComp";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const Login = (props) => {
  const navigate = useNavigate();
  const [loginField, setLoginField] = useState({
    email: "",
    password: "",
  });

  const onChangeInput = (event, key) => {
    setLoginField({
      ...loginField,
      [key]: event.target.value,
    });
  };

  const onSubmit = async () => {
    if (loginField.email === "" || loginField.password === "") {
      return toast.error("Please fill in all credentials");
    }
    await axios
      .post("http://localhost:3000/api/auth/login", loginField, {
        withCredentials: true,
      })
      .then((res) => {
        props.changeLoginStatus(true);
        localStorage.setItem("user", JSON.stringify(res.data));
        localStorage.setItem("isLogin", true);
        toast.success("Login successful");
        navigate("/feeds");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error);
      });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center ">
      <div className="w-[85%] md:w-[28%] shadow-xl rounded-sm box p-10">
        <div className="text-3xl">Sign In</div>
        <GoogleLoginComp changeLoginStatus={props.changeLoginStatus} />
        <div className="flex items-center gap-2">
          <div className="border-b border-gray-400 w-[45%] " /> <div> or </div>{" "}
          <div className="border-b border-gray-400 w-[45%] my-6"></div>
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={loginField.email}
            onChange={(e) => onChangeInput(e, "email")}
            className="w-full border-2 rounded-md p-2 mt-1"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={loginField.password}
            onChange={(e) => onChangeInput(e, "password")}
            className="w-full border-2 rounded-md p-2 mt-1"
            placeholder="Enter your password"
          />
        </div>
        <div
          onClick={onSubmit}
          className="mt-5 w-full hover:bg-blue-900 bg-blue-800 text-white py-3 px-4 text-center text-xl cursor-pointer my-2 rounded-md "
        >
          Sign In
        </div>
      </div>
      <div className="mt-4 mb-15">
        {" "}
        New to LinkedIn?{" "}
        <Link
          to="/signup"
          className="text-blue-800 cursor-pointer hover:underline"
        >
          Join now
        </Link>{" "}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
