import React, { useState, useEffect } from "react";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import Advertisement from "../../components/Advertisement/Advertisement";
import { useParams } from "react-router-dom";
import Card from "../../components/Card/Card";
import Post from "../../components/Post/Post";
import axios from "axios";

const Activities = () => {
  const { id } = useParams();
  const [postData, setPostData] = useState([]);
  const [ownData, setOwnData] = useState(null);

  const fetchDataOnLoad = async () => {
    try {
      const response = await axios
        .get(`http://localhost:3000/api/post/getUserPosts/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data.data);
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
  }, [id]);

  return (
    <div className="px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100">
      {/* Left Side */}
      <div className="w-[21%] sm:block sm:w-[23%] hidden py-5">
        <div className="h-fit">
          <ProfileCard data={postData[0]?.user} />
        </div>
      </div>
      {/* Middle */}
      <div className="w-full py-5 sm:w-[50%]">
        <div>
          <Card padding={1}>
            <div className="text-xl">All Activity</div>
            <div className="cursor-pointer w-fit p-2 border rounded-4xl bg-green-800 my-2 text-white font-semibold">
              Posts
            </div>

            <div className="my-2 flex flex-col gap-2">
              {postData?.length > 0 ? (
                postData?.map((item) => (
                  <Post key={item?._id} item={item} personalData={ownData} />
                ))
              ) : (
                <div>No posts available</div>
              )}
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

export default Activities;
