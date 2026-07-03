import React, { useState, useEffect } from "react";
import "./Navbar2.css";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import WorkIcon from "@mui/icons-material/Work";
import MessageIcon from "@mui/icons-material/Message";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Navbar2 = () => {
  const [dropdown, setDropdown] = React.useState(false);
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [notificationsCount, setNotificationsCount] = useState(0);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTerm(searchQuery);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedTerm) {
      searchAPICall();
    }
  }, [debouncedTerm]);

  const searchAPICall = async () => {
    try {
      await axios
        .get(`http://localhost:3000/api/auth/findUser?query=${debouncedTerm}`, {
          withCredentials: true,
        })
        .then((res) => {
          setSearchUser(res.data.users);
        });
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.error);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("userInfo");
    if (stored) {
      setUserData(JSON.parse(stored));
    }
    fetchSelf();
    fetchNotifications();
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [location.pathname]);

  const fetchSelf = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/auth/self", {
        withCredentials: true,
      });
      setUserData(res.data);
      localStorage.setItem("userInfo", JSON.stringify(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNotifications = async () => {
    try {
      await axios
        .get("http://localhost:3000/api/notification/activeNotifications", {
          withCredentials: true,
        })
        .then((res) => {
          setNotificationsCount(res.data.count);
        });
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.error);
    }
  };

  return (
    <div className="bg-white h-13 flex justify-between py-1 px-5 xl:px-50 fixed top-0 w-full z-1000">
      <div className="flex gap-2 items-center">
        <Link to="/feeds">
          <img
            src="/LinkedInLogo"
            alt="In"
            className="w-9 h-9 object-contain rounded-md"
          />
        </Link>
        <div className="relative">
          <input
            className="searchInput w-70 bg-gray-100 rounded-sm h-10 px-4"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          ></input>
          {searchUser?.length > 0 && debouncedTerm && (
            <div
              onClick={() => setSearchQuery("")}
              className="absolute w-88 left-0 bg-gray-200"
            >
              {searchUser?.map((item, index) => (
                <Link
                  to={`/profile/${item?._id}`}
                  key={item?._id || index}
                  onClick={() => setSearchQuery("")}
                  className="flex gap-2 mb-2  items-center cursor-pointer"
                >
                  <div>
                    <img
                      className="w-10 h-10 rounded-full"
                      src={item?.profilePic}
                    />
                  </div>
                  <div>{item?.f_name}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="hidden gap-10 md:flex">
        <Link to="/feeds" className="flex flex-col items-center cursor-pointer">
          <HomeIcon
            sx={{ color: location.pathname === "/feeds" ? "black" : "gray" }}
          />
          <div
            className={`text-sm text-gray-500 ${location.pathname === "/feeds" ? "border-b-3" : ""}`}
          >
            Home
          </div>
        </Link>
        <Link
          to="/mynetwork"
          className="flex flex-col items-center cursor-pointer"
        >
          <GroupIcon
            sx={{
              color: location.pathname === "/mynetwork" ? "black" : "gray",
            }}
          />
          <div
            className={`text-sm text-gray-500 ${location.pathname === "/mynetwork" ? "border-b-3" : ""}`}
          >
            My network
          </div>
        </Link>
        <Link
          to="/resume"
          className="flex flex-col items-center cursor-pointer"
        >
          <WorkIcon
            sx={{ color: location.pathname === "/resume" ? "black" : "gray" }}
          />
          <div
            className={`text-sm text-gray-500 ${location.pathname === "/resume" ? "border-b-3" : ""}`}
          >
            Resume
          </div>
        </Link>
        <Link
          to="/messages"
          className="flex flex-col items-center cursor-pointer"
        >
          <MessageIcon
            sx={{ color: location.pathname === "/messages" ? "black" : "gray" }}
          />
          <div
            className={`text-sm text-gray-500 ${location.pathname === "/messages" ? "border-b-3" : ""}`}
          >
            Message
          </div>
        </Link>
        <Link
          to="/notifications"
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="relative">
            <NotificationsIcon
              sx={{
                color:
                  location.pathname === "/notifications" ? "black" : "gray",
              }}
            />
            {notificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-bold shadow-md">
                {notificationsCount}
              </span>
            )}
          </div>
          <div
            className={`text-sm text-gray-500 ${location.pathname === "/notifications" ? "border-b-3" : ""}`}
          >
            Notification
          </div>
        </Link>
        <Link
          to={userData?.data?._id ? `/profile/${userData.data._id}` : "#"}
          className="flex flex-col items-center cursor-pointer"
        >
          <img
            className="w-6 h-6 rounded-full"
            src={userData?.data?.profilePic}
            alt="description"
          />
          <div className="text-sm text-gray-500">Me</div>
        </Link>
      </div>
    </div>
  );
};

export default Navbar2;
