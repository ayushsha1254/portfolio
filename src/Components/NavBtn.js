import React from "react";

const NavBtn = ({ icon, text, select }) => {
  return (
    <div className="flex flex-col flex-wrap w-full gap-y-2 transition-all">
      <div
        className="flex flex-row justify-center place-items-center rounded-lg text-black py-2 transition-all"
        style={{
          background: select ? "#000" : "rgba(255, 255, 255, 0.7)",
          color: select ? "#fff" : "#000",
        }}
      >
        {icon}
      </div>
      <div
        className="flex flex-row justify-center text-white w-full text-sm"
        style={{
          textDecoration: select ? "underline" : "none",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default NavBtn;
