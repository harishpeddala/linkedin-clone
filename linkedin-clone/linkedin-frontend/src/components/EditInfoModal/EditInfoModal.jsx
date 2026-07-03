import React, { useState } from "react";

const EditInfoModal = ({ handleEditButton, selfData }) => {
  const [fullName, setFullName] = useState(selfData?.f_name || "");
  const [headline, setHeadline] = useState(selfData?.headline || "");
  const [currentCompany, setCurrentCompany] = useState(
    selfData?.curr_company || "",
  );
  const [currentLocation, setCurrentLocation] = useState(
    selfData?.curr_location || "",
  );

  const handleSaveBtn = () => {
    const updatedData = {
      ...selfData,
      f_name: fullName,
      headline,
      curr_company: currentCompany,
      curr_location: currentLocation,
    };
    handleEditButton(updatedData);
  };

  return (
    <div className="mt-8 w-full h-87.5 overflow-auto">
      <div className="w-full mb-4">
        <label>Full Name*</label>
        <br />
        <input
          type="text"
          className="p-2 mt-1 w-full border rounded-md"
          placeholder="Enter Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div className="w-full mb-4">
        <label>Headline*</label>
        <br />
        <textarea
          className="p-2 mt-1 w-full border rounded-md"
          cols={10}
          rows={3}
          placeholder="Enter Headline"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
        ></textarea>
      </div>
      <div className="w-full mb-4">
        <label>Current Company*</label>
        <br />
        <input
          type="text"
          className="p-2 mt-1 w-full border rounded-md"
          placeholder="Enter Current Company"
          value={currentCompany}
          onChange={(e) => setCurrentCompany(e.target.value)}
        />
      </div>
      <div className="w-full mb-4">
        <label>Current Location*</label>
        <br />
        <input
          type="text"
          className="p-2 mt-1 w-full border rounded-md"
          placeholder="Enter Current Location"
          value={currentLocation}
          onChange={(e) => setCurrentLocation(e.target.value)}
        />
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

export default EditInfoModal;
