import React from "react";

const Footer = () => {
  return (
    <div className="w-full bg-gray-200 flex justify-center">
      <div className="md:p-3 w-full flex flex-col items-center py-4">
        <div className="flex gap-1 items-center cursor-pointer">
          <h3 className="text-[#0A66C2] font-bold text-2xl tracking-tight">
            Linked
          </h3>
          <img
            src="/LinkedInLogo"
            alt="In"
            className="w-7 h-7 object-contain rounded-md"
          />
        </div>
        <div className="text-sm">@Copyright 2026</div>
      </div>
    </div>
  );
};

export default Footer;
