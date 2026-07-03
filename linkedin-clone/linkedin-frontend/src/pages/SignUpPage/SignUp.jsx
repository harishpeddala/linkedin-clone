import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleLoginComp from "../../components/GoogleLogin/GoogleLoginComp";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const SignUp = (props) => {
  const navigate = useNavigate();
  const [signUpField, setSignUpField] = useState({
    email: "",
    password: "",
    f_name: "",
  });

  const handleInputChange = (event, key) => {
    setSignUpField({
      ...signUpField,
      [key]: event.target.value,
    });
  };

  const handleRegister = async () => {
    if (
      signUpField.email === "" ||
      signUpField.password === "" ||
      signUpField.f_name === ""
    ) {
      return toast.error("Please fill in all credentials");
    }
    await axios
      .post("http://localhost:3000/api/auth/register", signUpField)
      .then((res) => {
        toast.success("Registration successful");
        setSignUpField({
          email: "",
          password: "",
          f_name: "",
        });
        navigate("/login");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error);
      });
  };

  return (
    <div className="2-full flex flex-col items-center justify-center ">
      <div className="text-4xl mb-5">
        Make the most of your professional life
      </div>
      <div className="w-[85%] md:w-[28%] shadow-xl rounded-sm box p-10">
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={signUpField.email}
              onChange={(e) => handleInputChange(e, "email")}
              className="w-full border-2 rounded-md p-2 mt-1"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={signUpField.password}
              onChange={(e) => handleInputChange(e, "password")}
              className="w-full border-2 rounded-md p-2 mt-1"
              placeholder="Enter your password"
            />
          </div>
          <div>
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              value={signUpField.f_name}
              onChange={(e) => handleInputChange(e, "f_name")}
              className="w-full border-2 rounded-md p-2 mt-1"
              placeholder="Enter your full name"
            />
          </div>
          <div
            onClick={handleRegister}
            className="w-full hover:bg-blue-900 bg-blue-800 text-white py-3 px-4 text-center text-xl cursor-pointer my-2 rounded-md "
          >
            Register
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="border-b border-gray-400 w-[45%] " /> <div> or </div>{" "}
          <div className="border-b border-gray-400 w-[45%] my-6"></div>
        </div>
        <GoogleLoginComp changeLoginStatus={props.changeLoginStatus} />
      </div>

      <div className="mt-4 mb-10">
        {" "}
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-800 cursor-pointer hover:underline"
        >
          Sign in
        </Link>{" "}
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
