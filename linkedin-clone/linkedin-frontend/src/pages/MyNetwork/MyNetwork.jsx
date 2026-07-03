import React, { useEffect } from "react";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import axios from "axios";

const MyNetwork = () => {
  const [text, setText] = React.useState("Catch Up with friends");
  const [data, setData] = React.useState([]);
  const fetchFriendList = async () => {
    try {
      await axios
        .get("http://localhost:3000/api/auth/getFriendsList", {
          withCredentials: true,
        })
        .then((res) => {
          setData(res.data?.friends);
        });
    } catch (error) {
      alert("Error fetching friend list:", error);
    }
  };

  const fetchPendingRequest = async () => {
    try {
      await axios
        .get("http://localhost:3000/api/auth/getPendingFriendsList", {
          withCredentials: true,
        })
        .then((res) => {
          setData(res.data?.pendingFriends);
        });
    } catch (error) {
      alert("Error fetching pending requests:", error);
    }
  };

  useEffect(() => {
    if (text === "Catch Up with friends") {
      fetchFriendList();
    } else if (text === "Pending Request") {
      fetchPendingRequest();
    }
  }, [text]);

  return (
    <div className="px-5 xl:px-50 py-9 flex flex-col gap-5 w-full mt-5 bg-gray-100">
      <div className="py-4 px-10 border border-gray-400 w-full flex justify-between my-5 text-xl bg-white rounded-xl">
        <div>{text}</div>
        <div className=" flex gap-3">
          <button
            className={`p-1 border rounded-lg cursor-pointer border-gray-300 ${text === "Catch Up with friends" ? "bg-blue-800 text-white" : ""}`}
            onClick={() => setText("Catch Up with friends")}
          >
            Friends
          </button>
          <button
            className={`p-1 border rounded-lg cursor-pointer border-gray-300 ${text === "Pending Request" ? "bg-blue-800 text-white" : ""}`}
            onClick={() => setText("Pending Request")}
          >
            Pending Request
          </button>
        </div>
      </div>
      <div className="flex h-[80vh] w-full gap-7 flex-wrap items-start justify-center">
        {data.map((friend, index) => {
          return (
            <div key={friend.id} className="md:w-[23%] h-67.5 sm:w-full">
              <ProfileCard data={friend} />
            </div>
          );
        })}
        {data.length === 0 ? (
          text === "Catch Up with friends" ? (
            <div>No Friends Found</div>
          ) : (
            <div>No Pending Request Found</div>
          )
        ) : null}
      </div>
    </div>
  );
};

export default MyNetwork;
