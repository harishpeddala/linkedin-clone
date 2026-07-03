import React, { useState } from "react";

const ExpModal = ({
  handleEditButton,
  selfData,
  updateExperience,
  updateExperienceEdit,
}) => {
  const [data, setData] = useState({
    designation: updateExperience?.clicked
      ? updateExperience?.data?.designation
      : "",
    company_name: updateExperience.clicked
      ? updateExperience.data.company_name
      : "",
    duration: updateExperience.clicked ? updateExperience.data.duration : "",
    location: updateExperience.clicked ? updateExperience.data.location : "",
  });

  const handleUpdateExperience = () => {
    let updatedExperience = selfData?.experience.map((item) =>
      item._id === updateExperience?.id ? { ...item, ...data } : item,
    );
    let newData = {
      ...selfData,
      experience: updatedExperience,
    };
    handleEditButton(newData);
  };

  const handleSaveBtn = () => {
    if (updateExperience?.clicked) return handleUpdateExperience();
    let expArr = [...(selfData?.experience || []), data];
    let newData = { ...selfData, experience: expArr };
    handleEditButton(newData);
  };

  const handleDeleteBtn = () => {
    let newFilteredData = selfData?.experience.filter(
      (item) => item._id !== updateExperience?.id,
    );
    let newData = { ...selfData, experience: newFilteredData };
    handleEditButton(newData);
  };

  return (
    <div className="mt-8 w-full h-87.5 overflow-auto">
      <div className="w-full mb-4">
        <label>Role*</label>
        <br />
        <input
          type="text"
          className="p-2 mt-1 w-full border rounded-md"
          placeholder="Enter Role"
          value={data.designation}
          onChange={(e) => setData({ ...data, designation: e.target.value })}
        />
      </div>
      <div className="w-full mb-4">
        <label>Company*</label>
        <br />
        <input
          type="text"
          className="p-2 mt-1 w-full border rounded-md"
          placeholder="Enter Company Name"
          value={data.company_name}
          onChange={(e) => setData({ ...data, company_name: e.target.value })}
        />
      </div>
      <div className="w-full mb-4">
        <label>Duration*</label>
        <br />
        <input
          type="text"
          className="p-2 mt-1 w-full border rounded-md"
          placeholder="Enter Duration"
          value={data.duration}
          onChange={(e) => setData({ ...data, duration: e.target.value })}
        />
      </div>
      <div className="w-full mb-4">
        <label>Location*</label>
        <br />
        <input
          type="text"
          className="p-2 mt-1 w-full border rounded-md"
          placeholder="Enter Location"
          value={data.location}
          onChange={(e) => setData({ ...data, location: e.target.value })}
        />
      </div>
      <div className="flex justify-between">
        <div
          onClick={handleSaveBtn}
          className="bg-blue-950 text-white w-fit py-1 px-3 cursor-pointer rounded-2xl"
        >
          Save
        </div>
        {updateExperience?.clicked && (
          <div
            onClick={handleDeleteBtn}
            className="bg-blue-950 text-white w-fit py-1 px-3 cursor-pointer rounded-2xl"
          >
            Delete
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpModal;
