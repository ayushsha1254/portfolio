import React from "react";
import explorer from "../Assets/Icons/exp.svg";
import { useDispatch } from "react-redux";
import { toggleExplorer } from "../Utility/state/action";
import close from "../Assets/Images/closered.svg";
import { useSelector } from "react-redux";
import { AiOutlineArrowLeft, AiOutlineSearch } from "react-icons/ai";
import Flip from "react-reveal/Fade";
import { useEffect } from "react";
import data from "../Data/main.json";
import ExplorerDisplay from "./Explorer/ExplorerDisplay";

import aboutmeicon from "../Assets/Icons/explorer/about.svg";
import achievementsicon from "../Assets/Icons/explorer/achievements.svg";
import certificationsicon from "../Assets/Icons/explorer/certifications.svg";
import contacticon from "../Assets/Icons/explorer/contact.svg";
import projectsicon from "../Assets/Icons/explorer/projects.svg";
import skillsicon from "../Assets/Icons/explorer/skills.svg";
import socialicon from "../Assets/Icons/explorer/socials.svg";

const Explorer = ({
  current,
  setCurrent,
  ip,
  setCert,
  setCertData,
  journey,
  setJourney,
  certifications,
  skills,
  setGallery,
  setProject,
  setIndex,
  setShowGallery,
}) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const [explore, setItem] = React.useState({
    item: current,
    data: data["explorer"][current],
  });
  // const [explore, setItem] = React.useState(undefined);
  const menuItems = [
    {
      name: "About Me",
      icon: aboutmeicon,
      action: "about",
    },
    {
      name: "Skills",
      icon: skillsicon,

      action: "skills",
    },
    {
      name: "Certifications",
      icon: certificationsicon,

      action: "certifications",
    },
    {
      name: "Achievements",
      icon: achievementsicon,
      action: "achievements",
    },
    {
      name: "Projects",
      icon: projectsicon,

      action: "projects",
    },
    {
      name: "Contacts",
      icon: contacticon,

      action: "contact",
    },
    {
      name: "Socials",
      icon: socialicon,

      action: "social",
    },
  ];
  // console.log(explore);
  return (
    <div
      className="w-[100vw] h-[90vh] bg-[#0fffff02] absolute top-[10vh] left-0 z-[205] flex flex-row justify-center overflow-hidden transition-all"
      style={{
        backdropFilter: "blur(7px)",
      }}
      id="explorer"
    >
      <div className=" w-[70%] rounded-lg h-[85vh] flex flex-row justify-start text-white shadow-lg drop-shadow-xl">
        <div></div>
        <div
          className="w-[25%] h-full overflow-y-scroll bg-[#84838340] backdrop-blur-2xl rounded-l-lg py-6 px-4"
          id="exp-main"
        >
          <div className="overflow-y-scroll font-[Helvetica] flex flex-row place-items-center text-xl gap-x-4 pb-4 border-b-2 border-opacity-50 border-[#6D6D6D]">
            <img src={explorer} />
            Explorer
          </div>
          <div className="flex flex-col gap-y-6 mt-10 overflow-y-scroll">
            {menuItems.map((item) => (
              <div
                className="flex flex-row gap-x-4 items-center cursor-pointer transition-all"
                onClick={() => {
                  setItem({
                    item: item.action,
                    data: data["explorer"][item.action],
                  });
                  // console.log(explore);
                  // dispatch(toggleExplorer(item.action));
                }}
                style={{
                  color: explore.item === item.action ? "#ef6522" : "#fff",
                  textShadow:
                    explore.item === item.action ? "0 0 2px #ef6522" : "",
                }}
              >
                <img
                  src={item.icon}
                  className="transition-all bg-[#fffff30] backdrop-blur-md w-[30px] h-[30px] object-contain aspect-square p-1 rounded-lg"
                  style={{
                    filter:
                      explore.item === item.action
                        ? "invert(47%) sepia(96%) saturate(2134%) hue-rotate(348deg) brightness(97%) contrast(93%)"
                        : "none",
                  }}
                />
                {item.name}
              </div>
            ))}
          </div>
        </div>
        <div className="w-[75%]  bg-[#aaaaaa60] dark:bg-[#292929] h-full rounded-r-lg flex-col flex py-6 px-4 ">
          <div className="flex flex-row px-5 relative">
            <span
              className="ml-3 absolute text-xl mt-2 cursor-pointer"
              onClick={() => {
                setCurrent(undefined);
              }}
            >
              <AiOutlineArrowLeft></AiOutlineArrowLeft>
            </span>
            <span className="ml-12 absolute text-xl mt-2">
              <AiOutlineSearch></AiOutlineSearch>
            </span>
            <input
              className="w-[90%] h-[5vh] rounded-lg px-3 pl-24 text-gray-300"
              disabled
              value={`user@${ip}:~$ //drive:/` + explore.item}
              style={{
                //   border: "1px solid",
                //   borderImage:
                //     "linear-gradient(114.55deg, rgba(72, 72, 72, 0.9) 2.13%, rgba(150, 150, 150, 0) 98.14%), radial-gradient(97.09% 224.61% at 1.38% 96.94%, rgba(137, 137, 137, 0) 0%, #6B6B6B 100%), radial-gradient(97.57% 210.75% at 0.9% 2.98%, rgba(112, 112, 112, 0) 0%, #222222 100%)",
                background:
                  "linear-gradient(114.55deg, rgba(72, 72, 72, 0.9) 2.13%, rgba(150, 150, 150, 0) 98.14%), radial-gradient(97.57% 210.75% at 0.9% 2.98%, rgba(112, 112, 112, 0) 0%, #333333 100%), radial-gradient(97.57% 210.75% at 0.9% 2.98%, rgba(134, 134, 134, 0.4) 0%, rgba(213, 213, 213, 0.4) 100%), radial-gradient(97.09% 224.61% at 1.38% 96.94%, rgba(137, 137, 137, 0) 0%, #6f6f6f 100%)",
              }}
            ></input>
            <div
              className="my-auto ml-auto"
              onClick={() => {
                dispatch(toggleExplorer(false));
              }}
            >
              <img src={close} className="cursor-pointer" />
            </div>
          </div>
          <div className=" w-[95%] h-[95%] mt-6 mx-auto overflow-hidden ">
            {explore === undefined ? null : (
              <ExplorerDisplay
                data={explore.data}
                item={explore.item}
                setCert={setCert}
                setCertData={setCertData}
                journey={journey}
                setJourney={setJourney}
                certifications={certifications}
                skills={skills}
                setProject={setProject}
                setGallery={setGallery}
                setShowGallery={setShowGallery}
                setIndex={setIndex}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explorer;
