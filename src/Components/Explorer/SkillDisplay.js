import { color } from "@mui/system";
import React, { CSSProperties } from "react";
import "./Skill.css";
// import "../../Utility/circle";
const SkillDisplay = ({ data, key }) => {
  // const icon = require("../../Assets/Skills/" + data.icon);
  const icon = data.img;
  return (
    <a
      href={data.link}
      target="_blank"
      className="skillblock relative group overflow-hidden bg-[#414141] transition-all max-w-[90%] gap-x-4 rounded-xl border-2 border-gray-400 shadow-inner hover:shadow-xl flex flex-row px-3 py-2"
      style={{
        "--color": data.color + "20",
        "--icon": `url(${icon})`,
        // background: `url(${icon}) no-repeat center/contain, linear-gradient(90deg, var(--color) 0%, var(--color) 100%)`,
        // background: `linear-gradient(90deg, var(--color) 0%, var(--color) 100%), linear-gradient(90deg, var(--color) 0%, var(--color) 100%)`,
        // background: `linear-gradient(90deg, var(--color) 0%, var(--color) 100%)`,
      }}
    >
      {/* <img
        src={icon}
        className="h-32 group-hover:block hidden group-hover:opacity-50 opacity-0 absolute right-0 -top-5 my-auto z-0"
      ></img> */}
      {/* <div
        className="absolute  right-0 top-0 w-16 h-16 rounded-full transition-all bg-white circle"
        style={{
          backfaceVisibility: "hidden",
          margin: "-0.2rem 0 0 -0.2rem",
        }}
        data-key={key}
        id={`circle-${key}`}
      ></div> */}
      <div className="basis-[20%] z-20 ">
        <img
          src={icon}
          alt={data.name}
          className="w-16 h-16 object-contain my-auto bg-white rounded-xl p-2"
        />
      </div>
      <div className="basis-[75%] text-lg font-bold my-auto">{data.name}</div>
    </a>
  );
};

export default SkillDisplay;
