import React from "react";
import { Link } from "react-router-dom";

const Navbar1 = () => {
  return (
    <nav className="w-full bg-gray-100 md:px-25 px-5  flex justify-between py-4 box-border">
      <div className="flex justify-between">
        <Link to="/" className="flex gap-1 items-center cursor-pointer">
          <h3 className="text-[#0A66C2] font-bold text-2xl tracking-tight">
            Linked
          </h3>
          <img
            src="/LinkedInLogo"
            alt="In"
            className="w-7 h-7 object-contain rounded-md"
          />
        </Link>
      </div>
      <div className="flex box-border md:gap-4 gap-2 justify-center items-center">
        <Link
          to="/signup"
          className="md:px-4 md:py-2 box-border text-black rounded-3xl text-xl hover:bg-blue-200 cursor-pointer"
        >
          Join Now
        </Link>
        <Link
          to="/login"
          className="px-4 py-2 box-border border-red-100 text-blue-800 rounded-3xl text-xl hover:bg-blue-200 cursor-pointer"
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
};

export default Navbar1;
