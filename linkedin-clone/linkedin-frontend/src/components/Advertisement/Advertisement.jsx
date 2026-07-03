import React, { useState, useEffect } from "react";
import Card from "../Card/Card";
const Advertisement = () => {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    let userData = localStorage.getItem("userInfo");
    setUserData(userData ? JSON.parse(userData) : null);
  }, []);
  return (
    <div className="sticky top-18">
      <Card padding={0}>
        <div className="relative">
          <div className="relative w-full h-22 rounded-md">
            <img
              src="/Landscape.jfif"
              alt="Profile"
              className="w-full h-full rounded-t-md"
            />
          </div>
          <div className="absolute top-14 left-[40%] z-10">
            <img
              src={userData?.data?.profilePic}
              alt="Profile"
              className="w-14 h-14 rounded-full border-2 border-white"
            />
          </div>
        </div>
        <div className="px-5 my-5 mx-auto">
          <div className="text-sm font-semibold text-center">
            {userData?.data?.f_name}
          </div>
          <div className="text-sm my-3 text-center">
            Get the latest jobs and industry news
          </div>
          <div className="text-sm my-1 border text-center p-2 rounded-2xl font-bold border-blue-950 text-white bg-blue-800 cursor-pointer hover:bg-blue-900">
            Explore{" "}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Advertisement;
