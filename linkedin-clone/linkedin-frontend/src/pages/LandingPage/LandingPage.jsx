import React from "react";
import { Link } from "react-router-dom";
import GoogleLoginComp from "../../components/GoogleLogin/GoogleLoginComp";

const LandingPage = (props) => {
  return (
    <div className="my-4 py-12.5 md:pl-30 px-5 md:flex justify-between">
      <div className="md:w-[40%]">
        <div className="text-4xl mx-auto text-gray-500">
          Welcome To Your Professional Community
        </div>
        <div className="mx-24 mt-6 py-1 rounded-2xl">
          <GoogleLoginComp changeLoginStatus={props.changeLoginStatus} />
        </div>
        <Link
          to="/login"
          className="flex mx-auto mt-5 py-2 px-2 bg-white gap-2 rounded-3xl items-center w-[70%] justify-center text-black hover:bg-blue-50 border-2 cursor-pointer"
        >
          Sign in with Email
        </Link>
        <div className="mx-auto mb-4 text-sm w-[70%] ,mt-6">
          By clicking continue to join or sign in, you agree to{" "}
          <span className="text-blue-800 cursor-pointer hover:underline">
            LinkedIn's User Agreement
          </span>
          ,{" "}
          <span className="text-blue-800 cursor-pointer hover:underline">
            Privacy Policy
          </span>
          , and{" "}
          <span className="text-blue-800 cursor-pointer hover:underline">
            Cookie Policy
          </span>
          .
        </div>
        <div className="mx-auto text-center mb-4 text-lg w-[70%] ,mt-4">
          New to LinkedIn?{" "}
          <Link
            to="/signup"
            className="text-blue-800 cursor-pointer hover:underline"
          >
            Join now
          </Link>
        </div>
      </div>
      <div className="md:w-[50%] h-120">
        <img
          src="/linkedin-banner.png"
          alt="Hero"
          className="w-full h-full object-contain rounded-md"
        />
      </div>
    </div>
  );
};

export default LandingPage;
