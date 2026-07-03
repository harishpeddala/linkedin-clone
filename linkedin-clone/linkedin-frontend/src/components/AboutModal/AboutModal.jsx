import React, { useState } from "react";
import axios from "axios";

const AboutModal = ({ handleEditButton, selfData }) => {
  const [data, setData] = useState({
    about: selfData?.about || "",
    skills: Array.isArray(selfData?.skills)
      ? selfData.skills.join(", ")
      : selfData?.skills || "",
    resume: selfData?.resume || "",
  });

  const [loading, setLoading] = useState(false);
  const [imageLink, setImageLink] = useState("");

  const handleUploadImage = async (e) => {
    const file = e.target.files;
    const formData = new FormData();
    formData.append("file", file[0]);
    formData.append("upload_preset", "linkedinclone");
    formData.append("cloud_name", "linkedinclone");
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/linkedinclone/image/upload",
        formData,
      );
      const imageUrl = response.data.url;
      setData((prev) => ({ ...prev, resume: imageUrl }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBtn = async () => {
    let arr = data.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");
    let newData = { ...data, skills: arr };
    handleEditButton(newData);
  };
  return (
    <div className="my-8">
      <div className="w-full mb-4">
        <label>About*</label>
        <br />
        <textarea
          className="p-2 mt-1 w-full border rounded-md"
          cols={10}
          rows={3}
          value={data.about}
          onChange={(e) => setData({ ...data, about: e.target.value })}
        ></textarea>
      </div>
      <div className="w-full mb-4">
        <label>Skills*(Add by separating comma)</label>
        <br />
        <textarea
          className="p-2 mt-1 w-full border rounded-md"
          cols={10}
          rows={3}
          value={data.skills}
          onChange={(e) => setData({ ...data, skills: e.target.value })}
        ></textarea>
      </div>
      <div className="w-full mb-4">
        <label
          htmlFor="resumeUpload"
          className="p-2 bg-blue-800 text-white rounded-lg cursor-pointer"
        >
          Resume Upload
        </label>
        <input
          onChange={handleUploadImage}
          type="file"
          id="resumeUpload"
          className="hidden"
        />
        {data.resume && <div className="my-2">{data.resume}</div>}
      </div>
      <div
        onClick={handleSaveBtn}
        className="bg-blue-950 text-white w-fit py-1 px-3 cursor-pointer rounded-2xl"
      >
        Save
      </div>
    </div>
  );
};

export default AboutModal;
