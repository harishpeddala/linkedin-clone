import React from "react";
import Card from "../Card/Card";
import { Link } from "react-router-dom";

const ProfileCard = (props) => {
  return (
    <Card padding={0}>
      <Link to={`/profile/${props.data?._id}`} className="relative">
        <div className="relative w-full h-22 rounded-md">
          <img
            src={props.data?.cover_pic}
            alt="Profile"
            className="w-full h-full rounded-t-md"
          />
        </div>
        <div className="absolute top-14 left-6 z-10">
          <img
            src={props.data?.profilePic}
            alt="Profile"
            className="w-16 h-16 rounded-full border-2 border-white"
          />
        </div>
        <div className="py-7 px-5">
          <div className="font-bold text-xl">{props.data?.f_name}</div>
          <div className="text-sm my-1 ">{props.data?.headline}</div>
          <div className="text-sm my-1 ">{props.data?.curr_location}</div>
          <div className="text-sm my-1 ">{props.data?.curr_company}</div>
        </div>
      </Link>
    </Card>
  );
};

export default ProfileCard;
