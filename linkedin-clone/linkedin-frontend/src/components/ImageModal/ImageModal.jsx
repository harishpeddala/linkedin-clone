import React, { useState } from "react";
import axios from "axios";

const ImageModal = ({ selfData, isCircular, handleEditButton }) => {
  const [imgLink, setImageLink] = useState(
    isCircular ? selfData?.profilePic : selfData?.cover_pic,
  );

  const [loading, setLoading] = useState(false);

  //CloudName : linkedinclone
  //preset : linkedinclone
  const handleUploadImage = async (e) => {
    const file = e.target.files;
    const data = new FormData();
    data.append("file", file[0]);
    data.append("upload_preset", "linkedinclone");
    data.append("cloud_name", "linkedinclone");
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/linkedinclone/image/upload",
        data,
      );
      const imageUrl = response.data.url;
      setImageLink(imageUrl);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBtn = async () => {
    const data = { ...selfData };
    if (isCircular) {
      data.profilePic = imgLink;
    } else {
      data.cover_pic = imgLink;
    }
    handleEditButton(data);
  };

  return (
    <div className="p-5 relative flex items-center flex-col h-full">
      {isCircular ? (
        <img
          className="rounded-full w-37.5 h-37.5"
          src={imgLink}
          alt="User Logo"
        />
      ) : (
        <img
          className="rounded-xl w-full h-50 object-cover"
          src={imgLink}
          alt="Landscape"
        />
      )}
      <label
        htmlFor="btn-submit"
        className="absolute bottom-10 left-0 p-3 bg-blue-900 text-white rounded-2xl cursor-pointer"
      >
        Upload
      </label>
      <input
        onChange={handleUploadImage}
        id="btn-submit"
        type="file"
        className="hidden"
      />
      {loading ? (
        <div className="absolute bottom-10 right-0 p-3 bg-blue-900 text-white rounded-2xl cursor-pointer">
          Loading...
        </div>
      ) : (
        <div
          onClick={handleSubmitBtn}
          className="absolute bottom-10 right-0 p-3 bg-blue-900 text-white rounded-2xl cursor-pointer"
        >
          Submit
        </div>
      )}
    </div>
  );
};

export default ImageModal;
