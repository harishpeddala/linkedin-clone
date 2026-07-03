import React, { useState, useEffect } from "react";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import Advertisement from "../../components/Advertisement/Advertisement";
import Card from "../../components/Card/Card";
import Post from "../../components/Post/Post";
import axios from "axios";
import { useParams } from "react-router-dom";

const SingleActivity = () => {
  const { id, postId } = useParams();
  const [ownData, setOwnData] = useState(null);
  const [postData, setPostData] = useState(null);

  const fetchDataOnLoad = async () => {
    try {
      const response = await axios
        .get(`http://localhost:3000/api/post/getPostById/${postId}`, {
          withCredentials: true,
        })
        .then((res) => {
          setPostData(res.data.data);
        });
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.error);
    }
  };

  useEffect(() => {
    fetchDataOnLoad();
    let userData = localStorage.getItem("userInfo");
    setOwnData(userData ? JSON.parse(userData) : null);
  }, []);
  return (
    <div className="px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100">
      {/* Left Side */}
      <div className="w-[21%] sm:block sm:w-[23%] hidden py-5">
        <div className="h-fit">
          <ProfileCard data={postData?.user} />
        </div>
      </div>
      {/* Middle */}
      <div className="w-full py-5 sm:w-[50%]">
        <div>
          <Post personalData={ownData} item={postData} />
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

export default SingleActivity;
