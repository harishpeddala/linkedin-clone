import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GoogleLoginComp = (props) => {
  const navigate = useNavigate();
  const handleonSuccess = async (response) => {
    const token = response.credential;
    const res = await axios.post(
      "http://localhost:3000/api/auth/google",
      { token },
      { withCredentials: true },
    );
    console.log(res);
    localStorage.setItem("user", JSON.stringify(res.data));
    localStorage.setItem("isLogin", true);
    props.changeLoginStatus(true);
    navigate("/feeds");
  };
  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={(response) => handleonSuccess(response)}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
};

export default GoogleLoginComp;
