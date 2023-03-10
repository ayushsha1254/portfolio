import React from "react";
import helpimg from "../Assets/Images/help.svg";
import close from "../Assets/Images/closered.svg";
import "./animate.css";
const Help = ({ help, setHelp }) => {
  return (
    <div className=" transition-all w-[100vw] h-[100vh] p-4 top-0 absolute left-0 bg-[#ffffff10] backdrop-blur-lg z-[500] flex flex-row justify-center place-items-center">
      {/* <div
        className="text-white"
        onClick={() => {
          setHelp(false);
        }}
      >
        Close Help
      </div> */}
      <img
        src={helpimg}
        className="slide-in-blurred-tr object-contain max-h-[90vh]"
      ></img>
      <img
        src={close}
        className="absolute top-5 right-5 cursor-pointer"
        onClick={() => {
          setHelp(false);
        }}
      ></img>
    </div>
  );
};

export default Help;
