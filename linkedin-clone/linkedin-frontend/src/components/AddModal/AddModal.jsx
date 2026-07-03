import React, { useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const AddModal = (props) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [desc, setDesc] = useState("");
  const handlePost = async () => {
    if (desc.trim().length === 0 && !imageUrl) {
      return toast.error("Please add a description or an image.");
    }
    await axios
      .post(
        "http://localhost:3000/api/post",
        {
          desc: desc,
          imageLink: imageUrl,
        },
        { withCredentials: true },
      )
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        toast.error("An error occurred while uploading the post.");
      });
    setDesc("");
    setImageUrl(null);
    props.setOpenModal(false);
  };

  //CloudName : linkedinclone
  //preset : linkedinclone
  const handleUploadImage = async (e) => {
    const file = e.target.files;
    const data = new FormData();
    data.append("file", file[0]);
    data.append("upload_preset", "linkedinclone");
    data.append("cloud_name", "linkedinclone");
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/linkedinclone/image/upload",
        data,
      );
      const imageUrl = response.data.url;
      setImageUrl(imageUrl);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="flex gap-4 items-center">
        <div className="relative">
          <img
            src={props.personalData?.data?.profilePic}
            alt="User"
            className="w-13 h-13 rounded-4xl border-2 border-white cursor-pointer"
          />
        </div>
        <div className="text-2xl">{props.personalData?.data?.f_name}</div>
      </div>
      <div>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          cols={50}
          rows={5}
          placeholder="What do you want to talk about?"
          className="my-3 outline-0 text-xl p-2"
        ></textarea>
      </div>
      {imageUrl && (
        <div>
          <img className="w-20 h-20 rounded-4xl" src={imageUrl} alt="User" />
        </div>
      )}
      <div className="flex justify-between items-center">
        <div className="my-6">
          <label className="cursor-pointer" htmlFor="inputFile">
            <ImageIcon />
          </label>
          <input
            onChange={handleUploadImage}
            type="file"
            id="inputFile"
            className="hidden"
          />
        </div>
        <div
          className="bg-blue-950 text-white py-1 px-3 cursor-pointer rounded-2xl h-fit"
          onClick={handlePost}
        >
          Post
        </div>
      </div>
    </div>
  );
};

export default AddModal;
