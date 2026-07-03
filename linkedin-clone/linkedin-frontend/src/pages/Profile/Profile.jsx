import React, { useEffect, useState, useRef } from "react";
import Advertisement from "../../components/Advertisement/Advertisement";
import Card from "../../components/Card/Card";
import EditIcon from "@mui/icons-material/Edit";
import Post from "../../components/Post/Post";
import AddIcon from "@mui/icons-material/Add";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import Modal from "../../components/Modal/Modal";
import ImageModal from "../../components/ImageModal/ImageModal";
import EditInfoModal from "../../components/EditInfoModal/EditInfoModal";
import AboutModal from "../../components/AboutModal/AboutModal";
import ExpModal from "../../components/ExpModal/ExpModal";
import MessageModal from "../../components/MessageModal/MessageModal";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Profile = () => {
  const { id } = useParams();
  const { postId } = useParams();
  const navigate = useNavigate();

  const [imageModal, setImageModal] = useState(false);
  const [circularImage, setCircularImage] = useState(true);
  const [infoModal, setInfoModal] = useState(false);
  const [aboutModal, setAboutModal] = useState(false);
  const [expModal, setExpModal] = useState(false);
  const [messageModal, setMessageModal] = useState(false);

  const [userData, setUserData] = useState(null);
  const [postData, setPostData] = useState(null);
  const [ownerData, setOwnerData] = useState(null);

  const [updateExperience, setUpdateExperience] = useState({
    clicked: "",
    id: "",
    data: {},
  });

  const updateExperienceEdit = (id, data) => {
    setUpdateExperience({
      clicked: true,
      id: id,
      data: data,
    });
    setExpModal((prev) => !prev);
  };

  useEffect(() => {
    fetchDataOnLoad();
  }, [id]);

  const fetchDataOnLoad = async () => {
    try {
      const [userData, postData, ownerData] = await Promise.all([
        axios.get(`http://localhost:3000/api/auth/user/${id}`, {
          withCredentials: true,
        }),
        axios.get(`http://localhost:3000/api/post/getTop5Posts/${id}`, {
          withCredentials: true,
        }),
        axios.get(`http://localhost:3000/api/auth/self`, {
          withCredentials: true,
        }),
      ]);
      setUserData(userData?.data?.data);
      setPostData(postData?.data?.data);
      setOwnerData(ownerData?.data);
      localStorage.setItem("userInfo", JSON.stringify(ownerData?.data));
    } catch (error) {
      console.error("Error fetching data:", error);
      alert(
        "Something went wrong while fetching data. Please try again later.",
      );
    }
  };

  const handleAboutInfoModalOpenClose = () => {
    setAboutModal((prev) => !prev);
  };

  const handleInfoModalOpenClose = () => {
    setInfoModal((prev) => !prev);
  };
  const handleImageModalOpenClose = () => {
    setImageModal((prev) => !prev);
  };
  const handleonEditCover = () => {
    setCircularImage(false);
    setImageModal(true);
  };
  const handleCircularImage = (circular) => {
    setCircularImage(circular);
    setImageModal(true);
  };

  const handleExpModal = () => {
    if (expModal) {
      setUpdateExperience({
        clicked: "",
        id: "",
        data: {},
      });
    }
    setExpModal((prev) => !prev);
  };

  const handleMessageModal = () => {
    setMessageModal((prev) => !prev);
  };

  const handleEditButton = async (data) => {
    await axios
      .put(
        `http://localhost:3000/api/auth/update`,
        { user: data },
        {
          withCredentials: true,
        },
      )
      .then((res) => {
        window.location.reload();
        // setUserData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        alert("An error occurred while updating the profile.");
      });
  };

  const amIFriend = () => {
    let arr = userData?.friends?.filter(
      (friend) => friend === ownerData?.data?._id,
    );
    return arr?.length > 0;
  };

  const isInPendingList = () => {
    let arr = userData?.pending_friends?.filter(
      (friend) => friend === ownerData?.data?._id,
    );
    return arr?.length > 0;
  };

  const isInSelfPendingList = () => {
    let arr = ownerData?.data?.pending_friends?.filter(
      (friend) => friend === userData?._id,
    );
    return arr?.length > 0;
  };

  const checkFriendStatus = () => {
    if (amIFriend()) {
      return "Disconnect";
    } else if (isInPendingList()) {
      return "Request Sent";
    } else if (isInSelfPendingList()) {
      return "Approve Request";
    } else {
      return "Connect";
    }
  };

  const handleFriendRequest = async () => {
    if (checkFriendStatus() === "Request Sent") return;
    if (checkFriendStatus() === "Connect") {
      await axios
        .post(
          `http://localhost:3000/api/auth/sendFriendRequest`,
          { receiverId: userData?._id },
          {
            withCredentials: true,
          },
        )
        .then((res) => {
          toast.success(res.data.message);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err?.response?.data?.error);
        });
    } else if (checkFriendStatus() === "Approve Request") {
      await axios
        .post(
          `http://localhost:3000/api/auth/acceptFriendRequest`,
          { senderId: userData?._id },
          {
            withCredentials: true,
          },
        )
        .then((res) => {
          toast.success(res.data.message);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err?.response?.data?.error);
        });
    } else if (checkFriendStatus() === "Disconnect") {
      await axios
        .delete(
          `http://localhost:3000/api/auth/removeFriend/${userData?._id}`,
          {
            withCredentials: true,
          },
        )
        .then((res) => {
          toast.success(res.data.message);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err?.response?.data?.error);
        });
    }
  };

  const handleLogOut = async () => {
    await axios
      .post(
        `http://localhost:3000/api/auth/logout`,
        {},
        { withCredentials: true },
      )
      .then((res) => {
        localStorage.clear();
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        toast.error(err?.response?.data?.error);
      });
  };

  const copyToClipboard = async () => {
    const postUrl = `${window.location.origin}/profile/${id}/`;
    await navigator.clipboard.writeText(postUrl);
    toast.success("Profile link copied to clipboard!");
  };

  return (
    <div className="px-5 xl:px-50 py-9 flex flex-col gap-5 w-full mt-5 pt-12 bg-gray-100">
      <div className="flex justify-between">
        {/* Left side Main section  */}
        <div className="w-full md:w-[70%]">
          <div>
            <Card padding={0}>
              <div className="w-full h-fit">
                <div className="relative w-full h-50">
                  {userData?._id === ownerData?.data?._id && (
                    <div
                      className="absolute cursor-pointer top-3 right-3 z-20 w-8.75 flex justify-center items-center h-8.75 rounded-full p-3 bg-white"
                      onClick={handleonEditCover}
                    >
                      <EditIcon />
                    </div>
                  )}
                  <img
                    src={userData?.cover_pic}
                    className="w-full h-50 rounded-tr-lg rounded-tl-lg"
                  />
                  <div
                    className="absolute object-cover top-24 left-6 z-10"
                    onClick={() => handleCircularImage(true)}
                  >
                    <img
                      className="rounded-full border-2 border-white cursor-pointer w-35 h-35"
                      src={userData?.profilePic}
                    />
                  </div>
                </div>

                <div className="mt-10 relative px-8 py-2">
                  {userData?._id === ownerData?.data?._id && (
                    <div
                      className="absolute cursor-pointer top-0 right-3 z-20 w-8.75 flex justify-center items-center h-8.75 rounded-full p-3 bg-white "
                      onClick={handleInfoModalOpenClose}
                    >
                      <EditIcon />
                    </div>
                  )}
                  <div className="w-full">
                    <div className="text-2xl">{userData?.f_name}</div>
                    <div className="text-gray-700">{userData?.headline}</div>
                    <div className="text-gray-700">
                      {userData?.curr_company}
                    </div>
                    <div className="text-sm text-gray-500">
                      {userData?.curr_location}
                    </div>
                    <div className="text-md text-blue-800 w-fit cursor-pointer hover:underline">
                      {userData?.friends?.length} connections
                    </div>

                    <div className="md:flex w-full justify-between">
                      <div className="my-5 flex gap-5">
                        <div className="cursor-pointer p-2 border rounded-lg bg-blue-800 text-white font-semibold">
                          Open to
                        </div>
                        <div
                          onClick={copyToClipboard}
                          className="cursor-pointer p-2 border rounded-lg bg-blue-800 text-white font-semibold"
                        >
                          Share
                        </div>
                        {userData?._id === ownerData?.data?._id && (
                          <div
                            onClick={handleLogOut}
                            className="cursor-pointer p-2 border rounded-lg bg-blue-800 text-white font-semibold"
                          >
                            Logout
                          </div>
                        )}
                      </div>
                      <div className="my-5 flex gap-5">
                        {amIFriend() && (
                          <div
                            className="cursor-pointer p-2 border rounded-lg bg-blue-800 text-white font-semibold"
                            onClick={handleMessageModal}
                          >
                            Message
                          </div>
                        )}
                        {userData?._id !== ownerData?.data?._id && (
                          <div
                            onClick={handleFriendRequest}
                            className="cursor-pointer p-2 border rounded-lg bg-blue-800 text-white font-semibold"
                          >
                            <div>{checkFriendStatus()}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div className="mt-5">
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <div className="text-xl">About</div>
                {userData?._id === ownerData?.data?._id && (
                  <div
                    className="cursor-pointer"
                    onClick={handleAboutInfoModalOpenClose}
                  >
                    <EditIcon />
                  </div>
                )}
              </div>
              <div className="text-gray-700 text-md w-[80%]">
                {userData?.about}
              </div>
            </Card>
          </div>

          <div className="mt-5">
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <div className="text-xl">Skills</div>
              </div>
              <div className="txt-gray-700 text-md my-2 w-full flex gap-4 flex-wrap">
                {userData?.skills?.map((skill, index) => (
                  <div
                    key={index}
                    className="py-2 px-3 cursor-pointer bg-blue-800 text-white rounded-lg"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="mt-5">
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <div className="text-xl">Activity</div>
              </div>
              <div className="cursor-pointer px-3 py-1 w-fit border rounded-4xl bg-green-800 text-white font-semibold">
                Posts
              </div>
              {/* Parent div for Scrollable activities  */}
              <div className="overflow-x-auto my-2 flex gap-1 overflow-y-hidden w-full">
                {postData?.map((post, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      navigate(`/profile/${id}/activities/${post?._id}`)
                    }
                    className="cursor-pointer shrink-0 w-87 h-140"
                  >
                    <Post profile={1} item={post} personalData={ownerData} />
                  </div>
                ))}
              </div>
              {postData?.length > 5 && (
                <div className="w-full flex justify-center items-center">
                  <Link
                    to={`/profile/${id}/activities`}
                    className="p-2 rounded-xl cursor-pointer hover:bg-gray-300"
                  >
                    Show All Posts <ArrowRightAltIcon />
                  </Link>
                </div>
              )}
            </Card>
          </div>

          <div className="mt-5">
            <Card padding={1}>
              <div className="flex justify-between items-center">
                <div className="text-xl">Experience</div>
                {userData?._id === ownerData?.data?._id && (
                  <div className="cursor-pointer" onClick={handleExpModal}>
                    <AddIcon />
                  </div>
                )}
              </div>
              <div className="mt-5">
                {userData?.experience.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="p-2 border-t border-gray-300 flex justify-between"
                    >
                      <div>
                        <div className="text-lg">{item?.designation}</div>
                        <div className="text-sm">{item?.company_name}</div>
                        <div className="text-sm text-gray-500">
                          {item?.duration}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item?.location}
                        </div>
                      </div>
                      {userData?._id === ownerData?.data?._id && (
                        <div
                          onClick={() => updateExperienceEdit(item?._id, item)}
                          className="cursor-pointer"
                        >
                          <EditIcon />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* Advertisement tag  */}

        <div className="hidden md:flex  md:w-[28%]">
          <div className="sticky top-20">
            <Advertisement />
          </div>
        </div>
      </div>
      {imageModal && (
        <Modal title="Upload Image" closeModal={handleImageModalOpenClose}>
          <ImageModal
            handleEditButton={handleEditButton}
            selfData={ownerData?.data}
            isCircular={circularImage}
          />
        </Modal>
      )}
      {infoModal && (
        <Modal title="Edit Info" closeModal={handleInfoModalOpenClose}>
          <EditInfoModal
            handleEditButton={handleEditButton}
            selfData={ownerData?.data}
          />
        </Modal>
      )}

      {aboutModal && (
        <Modal title="Edit About" closeModal={handleAboutInfoModalOpenClose}>
          <AboutModal
            handleEditButton={handleEditButton}
            selfData={ownerData?.data}
          />
        </Modal>
      )}

      {expModal && (
        <Modal title="Experience" closeModal={handleExpModal}>
          <ExpModal
            handleEditButton={handleEditButton}
            selfData={ownerData?.data}
            updateExperience={updateExperience}
            updateExperienceEdit={updateExperienceEdit}
          />
        </Modal>
      )}

      {messageModal && (
        <Modal title="Send Message" closeModal={handleMessageModal}>
          <MessageModal selfData={ownerData?.data} userData={userData} />
        </Modal>
      )}
      <ToastContainer />
    </div>
  );
};

export default Profile;
