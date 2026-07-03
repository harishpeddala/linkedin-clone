import React, { useState, useEffect, useRef } from "react";
import Card from "../../components/Card/Card";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Conversation from "../../components/Conversation/Conversation";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ImageIcon from "@mui/icons-material/Image";
import Advertisement from "../../components/Advertisement/Advertisement";
import axios from "axios";
import socket from "../../../socket";

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [ownData, setOwnData] = useState(() => {
    const stored = localStorage.getItem("userInfo");
    return stored ? JSON.parse(stored) : null;
  });
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [selectedConversationDetail, setSelectedConversationDetail] =
    useState(null);
  const [messages, setMessages] = useState([]);
  const [imageLink, setImageLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageText, setMessageText] = useState("");

  const ref = useRef(null);

  const handleConversationClick = async (id, userData) => {
    setActiveConversationId(id);
    socket.emit("joinConversation", id);
    setSelectedConversationDetail(userData);
  };

  const fetchMessages = async () => {
    if (!activeConversationId) return;
    try {
      await axios
        .get(`http://localhost:3000/api/message/${activeConversationId}`, {
          withCredentials: true,
        })
        .then((response) => {
          setMessages(response.data || []);
        });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [activeConversationId]);

  useEffect(() => {
    fetchConversationOnLoad();
  }, []);

  useEffect(() => {
    socket.on("receiveMessage", (messageDetail) => {
      if (messageDetail?.conversation === activeConversationId) {
        setMessages((prevMessages) => [...prevMessages, messageDetail]);
      }
    });
    return () => {
      socket.off("receiveMessage");
    };
  }, [activeConversationId]);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

  const fetchConversationOnLoad = async () => {
    try {
      await axios
        .get("http://localhost:3000/api/conversation/getConversations", {
          withCredentials: true,
        })
        .then(async (response) => {
          setConversations(response.data.conversations);
          setActiveConversationId(response.data?.conversations[0]?._id);
          socket.emit("joinConversation", response.data?.conversations[0]?._id);
          const self = await axios.get("http://localhost:3000/api/auth/self", {
            withCredentials: true,
          });
          let ownId = self.data?.data?._id || self.data?._id;
          let arr = response.data?.conversations[0]?.members?.filter(
            (member) => member?._id !== ownId,
          );
          setSelectedConversationDetail(arr?.[0] || null);
        });
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

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

  const handleSendMessage = async () => {
    if (!messageText.trim() && !imageLink) return;
    try {
      await axios
        .post(
          "http://localhost:3000/api/message",
          {
            conversationId: activeConversationId,
            message: messageText,
            picture: imageLink,
          },
          { withCredentials: true },
        )
        .then((response) => {
          socket.emit("sendMessage", activeConversationId, response.data);
          setMessageText("");
          setImageLink("");
          fetchMessages();
        });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="px-5 xl:px-50 py-9 flex gap-5 w-full mt-5 bg-gray-100">
      <div className="w-full justify-between flex pt-5">
        {/* Left Side --> Message Section  */}
        <div className="w-full md:w-[70%]">
          <Card padding={0}>
            <div className="border-b border-gray-300 px-5 py-2 font-semibold text-lg">
              Messaging
            </div>
            <div className="border-b border-gray-300 px-5 py-2">
              <div className="py-1 px-3 cursor-pointer hover:bg-green-900 bg-green-800 font-semibold flex gap-2 w-fit rounded-2xl text-white">
                Focused <ArrowDropDownIcon />
              </div>
            </div>
            {/* Chat Section  */}
            <div className="w-full md:flex">
              <div className="h-147.5 overflow-auto w-full md:w-[40%] border-r border-gray-400">
                {/* Chat 1 */}
                {conversations.map((conversation, index) => {
                  return (
                    <Conversation
                      handleConversationClick={handleConversationClick}
                      key={index}
                      conversation={conversation}
                      ownData={ownData}
                      activeConversationId={activeConversationId}
                    />
                  );
                })}
              </div>
              <div className="w-full md:w-[60%] border-gray-400">
                <div className="border-gray-300 py-2 px-4 border-b-2 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold">
                      {selectedConversationDetail?.f_name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {selectedConversationDetail?.headline}
                    </p>
                  </div>
                  <div>
                    <MoreHorizIcon />
                  </div>
                </div>

                <div
                  ref={ref}
                  className="h-90 w-full overflow-auto border-b border-gray-300"
                >
                  <div className="w-full border-b border-gray-300 gap-3 p-4">
                    <img
                      src={selectedConversationDetail?.profilePic}
                      alt="User"
                      className="w-15 h-15 rounded-4xl border-2 border-white cursor-pointer"
                    />
                    <div className="my-2">
                      <div className="text-md">
                        {selectedConversationDetail?.f_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {selectedConversationDetail?.headline}
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    {/* Each Message  */}
                    {messages.map((message, index) => {
                      const ownId = ownData?.data?._id || ownData?._id;
                      const isOwn = message?.sender?._id === ownId;
                      return (
                        <div
                          key={message?._id || index}
                          className={`flex w-full border-gray-300 gap-3 p-4 ${isOwn ? "flex-row-reverse" : ""}`}
                        >
                          <div className="shrink-0">
                            <img
                              src={message?.sender?.profilePic}
                              alt="User"
                              className="w-8 h-8 rounded-4xl border-2 border-white"
                            />
                          </div>
                          <div className="mb-2">
                            <div className="text-md">
                              {message?.sender?.f_name}
                            </div>
                            {message?.message && (
                              <div className="text-sm mt-1">
                                {message.message}
                              </div>
                            )}
                            {message?.picture && (
                              <div className="my-2">
                                <img
                                  src={message.picture}
                                  alt="Message"
                                  className="w-60 h-45 rounded-md"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Message Typing section  */}

                <div className="p-2 w-full overflow-auto border-b border-gray-200">
                  <textarea
                    rows={4}
                    className="bg-gray-200 outline-0 rounded-xl text-sm w-full p-3"
                    placeholder="Write a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                </div>

                <div className="p-3 flex justify-between">
                  <div>
                    <label htmlFor="messageImage" className="cursor-pointer">
                      <ImageIcon />
                    </label>
                    <input
                      type="file"
                      id="messageImage"
                      className="hidden"
                      onChange={handleUploadImage}
                    />
                  </div>
                  {loading ? (
                    <div className="bg-blue-900 text-white px-4 py-2 rounded-full font-medium shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all duration-200">
                      Loading...
                    </div>
                  ) : (
                    <div
                      onClick={handleSendMessage}
                      className="bg-blue-900 text-white px-4 py-2 rounded-full font-medium shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all duration-200"
                    >
                      Send
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side --> Advertisement  */}
        <div className="hidden md:flex md:w-[25%]">
          <div className="sticky top-20">
            <Advertisement />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
