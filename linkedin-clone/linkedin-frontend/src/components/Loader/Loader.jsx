import React from "react";
import "./Loader.css";
const Loader = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-100 h-full bg-gray-200 flex justify-center items-center">
      <span class="loader"></span>
    </div>
  );
};

export default Loader;
