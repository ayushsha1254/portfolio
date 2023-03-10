import React, { useState, CSSProperties } from "react";
import { useEffect } from "react";
import "./folder.css";
const Folders = ({ name, color, logo, display, logourl }) => {
  const [photo, setPhoto] = useState(null);
  useEffect(() => {
    if (logourl) {
      setPhoto(logourl);
    } else if (logo) {
      const temp = require("../../Assets/Projects/" + logo);
      setPhoto(temp);
    }
  }, [logo]);
  console.log(display, name);
  return (
    <div className="font-[Helvetica] cursor-pointer transition-all">
      <div
        className={`relative flex flex-col text-white text-xl mb-2 folder transition-all mx-auto`}
        data-color={color}
        style={{
          "--color": color,
          background: `linear-gradient(147.37deg, #363636 -20.04%, #1E1E1E 135.5%),
            linear-gradient(360deg, #E2E2E2 -114.56%, rgba(0, 0, 0, 0) 138.2%)`,
          boxShadow: display == name ? `0px 0px 10px 0px ${color}75` : null,
        }}
      >
        {photo ? (
          <img
            src={photo}
            alt="logo"
            className="w-[80%] h-[80%] absolute bottom-0 right-0 opacity-30"
          />
        ) : null}
      </div>
      <div className="text-center ">{name}</div>
    </div>
  );
};

export default Folders;
