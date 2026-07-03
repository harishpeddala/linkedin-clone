import React, { useState, useEffect } from "react";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import Advertisement from "../../components/Advertisement/Advertisement";
import Card from "../../components/Card/Card";
import Post from "../../components/Post/Post";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [ownData, setOwnData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const fetchNotifications = async () => {
    try {
      const response = await axios
        .get("http://localhost:3000/api/notification", {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data.notifications);
          setNotifications(res.data.notifications);
        });
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      await axios
        .put(
          "http://localhost:3000/api/notification/markAsRead",
          {
            notificationId: notification._id,
          },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          if (notification?.type === "comment") {
            navigate(
              `/profile/${ownData?.data?._id}/activities/${notification?.postId}`,
            );
          } else {
            navigate(`/mynetwork`);
          }
        });
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.error);
    }
  };

  useEffect(() => {
    let userData = localStorage.getItem("userInfo");
    setOwnData(userData ? JSON.parse(userData) : null);
    fetchNotifications();
  }, []);
  return (
    <div className="px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100">
      {/* Left Side */}
      <div className="w-[21%] sm:block sm:w-[23%] hidden py-5">
        <div className="h-fit">
          <ProfileCard data={ownData?.data} />
        </div>
      </div>
      {/* Middle */}
      <div className="w-full py-5 sm:w-[50%]">
        <div>
          <Card padding={0}>
            <div className="w-full">
              {/* Particular Notification  */}
              {notifications.map((notification, index) => (
                <div
                  onClick={() => handleNotificationClick(notification)}
                  key={index}
                  className={`border-b cursor-pointer flex gap-4 items-center border-gray-300 p-3 ${notification?.isRead ? "bg-gray-200" : "bg-blue-100"}`}
                >
                  <img
                    src={notification?.sender?.profilePic}
                    className="w-15 h-15 rounded-full cursor-pointer"
                    alt="description"
                  />
                  <div> {notification.content}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      {/* Right Side */}
      <div className="w-[26%] py-5 hidden md:block ">
        <div className="my-5 sticky top-19">
          <Advertisement />
        </div>
      </div>
    </div>
  );
};

export default Notifications;
