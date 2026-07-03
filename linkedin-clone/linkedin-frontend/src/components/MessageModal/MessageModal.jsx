import React, { useState } from "react";
import axios from "axios";

const MessageModal = ({ selfData, userData }) => {
  const [message, setMessage] = useState("");
  const handleSendBtn = async () => {
    try {
      await axios
        .post(
          "http://localhost:3000/api/conversation/addConversation",
          {
            recipientId: userData?._id,
            message,
          },
          { withCredentials: true },
        )
        .then((res) => {
          window.location.reload();
        });
    } catch (error) {
      console.error(error.response?.data?.error);
    }
  };
  return (
    <div className="my-5">
      <div className="w-full mb-4">
        <textarea
          className="p-2 mt-1 w-full border rounded-md"
          placeholder="Enter Message"
          cols={10}
          rows={10}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
      </div>
      <div
        onClick={handleSendBtn}
        className="bg-blue-950 text-white w-fit py-1 px-3 cursor-pointer rounded-2xl"
      >
        Send
      </div>
    </div>
  );
};

export default MessageModal;
