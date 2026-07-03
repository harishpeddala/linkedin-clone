import React, { useState, useEffect, use } from "react";
import Card from "../Card/Card";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentIcon from "@mui/icons-material/Comment";
import SendIcon from "@mui/icons-material/Send";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";

const Post = ({ profile, postId, item, personalData }) => {
  const [seeMore, setSeeMore] = useState(false);
  const [comment, setComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [noOfLikes, setNoOfLikes] = useState(item?.likes?.length || 0);
  const [noOfComments, setNoOfComments] = useState(item?.comments || 0);
  const [commentText, setCommentText] = useState("");

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (commentText.trim().length === 0)
      return toast.error("Comment cannot be empty.");
    await axios
      .post(
        "http://localhost:3000/api/comment",
        { postId: item?._id, comment: commentText },
        { withCredentials: true },
      )
      .then((res) => {
        toast.success("Comment added successfully.");
        setComments((prev) => [res.data.comment, ...prev]);
        setNoOfComments((prev) => prev + 1);
      })
      .catch((err) => {
        console.log(err);
        toast.error("An error occurred while sending the comment.");
      });
    setCommentText("");
  };
  useEffect(() => {
    const userId = personalData?.data?._id;
    if (item?.likes?.includes(userId)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
    setNoOfLikes(item?.likes?.length || 0);
    setNoOfComments(item?.comments || 0);
  }, [item, personalData]);

  const handleLike = async () => {
    await axios
      .post(
        "http://localhost:3000/api/post/likeDislike",
        { postId: item?._id },
        { withCredentials: true },
      )
      .then((res) => {
        setLiked((prev) => !prev);
        setNoOfLikes((prev) => (liked ? prev - 1 : prev + 1));
      })
      .catch((err) => {
        alert("An error occurred while liking the post.");
      });
  };

  const handleCommentsOpenClose = async () => {
    setComment(true);
    await axios
      .get(`http://localhost:3000/api/comment/${item?._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        const sorted = [...res.data.comments].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setComments(sorted);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const copyToClipboard = async () => {
    const postUrl = `${window.location.origin}/profile/${item?.user?._id}/activities/${item?._id}`;
    await navigator.clipboard.writeText(postUrl);
    toast.success("Post link copied to clipboard!");
  };

  const desc = `${item?.desc}`;
  return (
    <Card padding={0}>
      <div className="flex gap-3 p-4">
        <Link
          to={`/profile/${item?.user?._id}`}
          className="w-12 h-12 rounded-4xl"
        >
          <img
            src={item?.user?.profilePic}
            alt="User"
            className="w-12 h-12 rounded-4xl border-2 border-white cursor-pointer"
          />
        </Link>
        <div>
          <div className="text-lg font-semibold">{item?.user?.f_name}</div>
          <div className="text-xs text-gray-500">{item?.user?.headline}</div>
        </div>
      </div>

      {
        <div className="text-md p-4 my-3 whitespace-pre-line grow">
          {seeMore
            ? desc
            : desc?.length > 50
              ? `${desc.slice(0, 50)}...`
              : desc}
          {desc.length > 150 && (
            <span
              onClick={() => setSeeMore((prev) => !prev)}
              className="cursor-pointer text-gray-500"
            >
              {seeMore ? "See Less" : "See More"}
            </span>
          )}
        </div>
      }

      {item?.imageLink && (
        <div className="w-full h-75">
          <img
            src={item?.imageLink}
            alt="Post"
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      )}

      <div className="my-2 p-4 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <ThumbUpIcon sx={{ color: "blue", fontSize: 15 }} />
          <div className="text-sm text-gray-600">{`${noOfLikes} Likes`}</div>
        </div>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-600">{`${noOfComments} Comments`}</div>
        </div>
      </div>

      {!profile && (
        <div className="flex p-1">
          <div
            onClick={handleLike}
            className="w-[33%] justify-center flex gap-2 items-center border-r border-gray-100 p-2 cursor-pointer hover:bg-gray-100"
          >
            {liked ? (
              <ThumbUpIcon sx={{ color: "blue", fontSize: 15 }} />
            ) : (
              <ThumbUpOutlinedIcon sx={{ fontSize: 15 }} />
            )}{" "}
            <span>Like</span>
          </div>
          <div
            onClick={() => handleCommentsOpenClose()}
            className="w-[33%] justify-center flex gap-2 items-center border-r border-gray-100 p-2 cursor-pointer hover:bg-gray-100"
          >
            <CommentIcon sx={{ fontSize: 15 }} /> <span>Comment</span>
          </div>
          <div
            onClick={copyToClipboard}
            className="w-[33%] justify-center flex gap-2 items-center border-r border-gray-100 p-2 cursor-pointer hover:bg-gray-100"
          >
            <SendIcon sx={{ fontSize: 15 }} /> <span>Share</span>
          </div>
        </div>
      )}
      {/* Comment Section */}
      {comment && (
        <div className="p-4 w-full">
          <div className="flex gap-2 items-center">
            <img
              src={personalData?.data?.profilePic}
              alt="User"
              className="w-13 h-13 rounded-4xl border-2 border-white cursor-pointer"
            />
            <form className="w-full flex gap-2" onSubmit={handleSendComment}>
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full border py-3 px-5 rounded-3xl hover:bg-gray-100"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium 
               shadow-md hover:bg-blue-700 hover:shadow-lg 
               active:scale-95 transition-all duration-200"
              >
                Send
              </button>
            </form>
          </div>

          {/* Other's Comments */}
          <div className="w-full p-4">
            {comments.map((item, index) => {
              return (
                <div className="my-4" key={item?._id || index}>
                  <Link
                    to={`/profile/${item?.user?._id}`}
                    className="flex gap-3 "
                  >
                    <img
                      src={item?.user?.profilePic}
                      alt="User"
                      className="w-10 h-10 rounded-4xl border-2 border-white cursor-pointer"
                    />
                    <div className="cursor-pointer">
                      <div className="text-sm font-semibold">
                        {item?.user?.f_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item?.user?.headline}
                      </div>
                    </div>
                  </Link>

                  <div className="px-11 my-2">{item?.comment}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <ToastContainer />
    </Card>
  );
};

export default Post;
