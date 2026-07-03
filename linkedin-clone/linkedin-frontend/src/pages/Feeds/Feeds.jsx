import React, { useState, useEffect } from "react";
import Card from "../../components/Card/Card";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import ArticleIcon from "@mui/icons-material/Article";
import Advertisement from "../../components/Advertisement/Advertisement";
import Post from "../../components/Post/Post";
import Modal from "../../components/Modal/Modal";
import AddModal from "../../components/AddModal/AddModal";
import Loader from "../../components/Loader/Loader";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Feeds = () => {
  const [personalData, setPersonalData] = useState(null);
  const [post, setPost] = useState([]);
  const [addPostModal, setAddPostModal] = React.useState(false);
  const handleOpenPostModal = () => {
    setAddPostModal((prev) => !prev);
  };
  const fetchData = async () => {
    try {
      const [userData, postData] = await Promise.all([
        axios.get("http://localhost:3000/api/auth/self", {
          withCredentials: true,
        }),
        axios.get("http://localhost:3000/api/post/getAllPosts"),
      ]);
      setPersonalData(userData.data);
      localStorage.setItem("userInfo", JSON.stringify(userData.data));
      setPost(postData.data);
      localStorage.setItem("postInfo", JSON.stringify(postData.data));
    } catch (err) {
      console.error("API Error:", err);
      toast.error(err?.response?.data?.error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100">
      {/* Left Side */}
      <div className="w-[21%] sm:block sm:w-[23%] hidden py-5">
        <div className="h-fit">
          <ProfileCard data={personalData?.data} />
        </div>
        <div className="w-full my-5">
          <Card padding={1}>
            <div className="w-full flex justify-between">
              <div>Profile Viewers</div>
              <div className="text-blue-900">30</div>
            </div>
            <div className="w-full flex justify-between">
              <div>Post Impressions</div>
              <div className="text-blue-900">90</div>
            </div>
          </Card>
        </div>
      </div>
      {/* Middle */}
      <div className="w-full py-5 sm:w-[50%]">
        {/* Post Section  */}
        <div>
          <Card padding={1}>
            <div className=" flex gap-2 items-center ">
              <img
                src={personalData?.data?.profilePic}
                alt="User"
                className="w-13 h-13 rounded-4xl border-2 border-white cursor-pointer"
              />
              <div
                onClick={() => setAddPostModal(true)}
                className="w-full border py-3 px-3 rounded-3xl cursor-pointer hover:bg-gray-100"
              >
                Start a post
              </div>
            </div>
            <div className="w-full flex mt-3">
              <div
                onClick={() => setAddPostModal(true)}
                className="flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100 "
              >
                <VideoCallIcon sx={{ color: "green" }} />
                Video
              </div>
              <div
                onClick={() => setAddPostModal(true)}
                className="flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100 "
              >
                <InsertPhotoIcon sx={{ color: "blue" }} />
                Photo
              </div>
              <div
                onClick={() => setAddPostModal(true)}
                className="flex gap-2 p-2 cursor-pointer justify-center rounded-lg w-[33%] hover:bg-gray-100 "
              >
                <ArticleIcon sx={{ color: "orange" }} />
                Article
              </div>
            </div>
          </Card>
        </div>

        <div className="border-b border-gray-400 w-full my-5" />

        <div className="w-full flex flex-col gap-5">
          {post?.data?.map((item, index) => (
            <Post
              key={index}
              postId={index}
              item={item}
              personalData={personalData}
            />
          ))}
        </div>
      </div>
      {/* Right Side */}
      <div className="w-[26%] py-5 hidden md:block ">
        <div>
          <Card padding={1}>
            <div className="font-bold text-xl">LinkedIn News</div>
            <div className="text-gray-600">Top Stories</div>
            <div className="my-1">
              <div className="text-md"> Buffet to remain Berkshire chair</div>
              <div className="text-xs text-gray-400">
                2h ago • 1,234 readers
              </div>
            </div>
            <div className="my-1">
              <div className="text-md"> Foreign Investments surge again</div>
              <div className="text-xs text-gray-400">3h ago • 234 readers</div>
            </div>
          </Card>
        </div>

        <div className="my-5 sticky top-19">
          <Advertisement />
        </div>
      </div>

      {addPostModal && (
        <Modal title={"Add Post"} closeModal={handleOpenPostModal}>
          <AddModal personalData={personalData} />
        </Modal>
      )}
    </div>
  );
};

export default Feeds;
