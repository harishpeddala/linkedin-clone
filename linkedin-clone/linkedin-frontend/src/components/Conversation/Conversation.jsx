import React, { useState, useEffect } from "react";

const Conversation = ({
  conversation,
  ownData,
  handleConversationClick,
  activeConversationId,
}) => {
  const [memberData, setMemberData] = useState(null);
  useEffect(() => {
    let ownId = ownData?.data?._id || ownData?._id;
    let arr = conversation?.members?.filter((member) => member?._id !== ownId);
    setMemberData(arr?.[0] || null);
  }, [conversation, ownData]);

  const handleClick = () => {
    handleConversationClick(conversation._id, memberData);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center w-full cursor-pointer border-b border-gray-300 gap-3 p-4 hover:bg-gray-200 ${activeConversationId === conversation._id ? "bg-gray-200" : ""}`}
    >
      <div className="shrink-0">
        <img
          src={memberData?.profilePic}
          alt="User"
          className="w-12 h-12 rounded-4xl border-2 border-white cursor-pointer"
        />
      </div>
      <div>
        <div className="text-md">{memberData?.f_name}</div>
        <div className="text-sm text-gray-500">{memberData?.headline}</div>
      </div>
    </div>
  );
};

export default Conversation;
