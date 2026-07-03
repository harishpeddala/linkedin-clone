import React, { useState, useEffect } from "react";
import axios from "axios";
import Advertisement from "../../components/Advertisement/Advertisement";

const Resume = () => {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/self", {
          withCredentials: true,
        });
        setUserData(res.data?.data);
        localStorage.setItem("userInfo", JSON.stringify(res.data?.data));
      } catch (error) {
        console.error("Error fetching user data:", error);
        const cached = localStorage.getItem("userInfo");
        setUserData(cached ? JSON.parse(cached) : null);
      }
    };
    fetchUser();
  }, []);
  return (
    <div className="px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100">
      {/* Resume Section  */}
      <div className="w-full py-5 sm:w-[74%]">
        <img
          className="w-[90%] h-full object-cover rounded-lg"
          src={userData?.resume}
          alt="Resume"
        />
      </div>
      {/* Advertisement  */}
      <div className="w-[26%] py-5 hidden md:block">
        <div className="sticky top-20">
          <Advertisement />
        </div>
      </div>
    </div>
  );
};

export default Resume;
