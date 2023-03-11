import React from "react";
import { useState, useEffect, CSSProperties } from "react";
import Stack from "./Stack";
import "./stack.css";
import { contrastColor } from "contrast-color";
import { Swiper, SwiperSlide } from "swiper/react";
import { useParallax, Parallax } from "react-scroll-parallax";
import "../animate.css";
// Import Swiper styles
import "swiper/css";
import gal from "../../Assets/Icons/gal.svg";
import gh from "../../Assets/Icons/gh.svg";
import { FaHourglassStart } from "react-icons/fa";
import { MdOutlineDescription } from "react-icons/md";
import { HiOutlineCode } from "react-icons/hi";
const DisplayPanel = ({
  data,
  setDisplay,
  setGallery,
  setProject,
  setIndex,
  setShowGallery,
}) => {
  const [photo, setPhoto] = useState(null);
  const [contrast, setContrast] = useState("#ffffff");
  const [info, setInfo] = useState("");
  console.log(contrastColor({ bgColor: "#ef6522" }));
  useEffect(() => {
    // if (data?.description.length > 100) {
    //   setInfo(data.description.substring(0, 100) + "...");
    // }
    setInfo(data.description);
  }, [data]);
  useEffect(() => {
    if (data?.color) {
      setContrast(contrastColor({ bgColor: data.color }));
    }
  }, [data]);
  console.log(info.length);
  useEffect(() => {
    if (data?.logourl) {
      setPhoto(data.logourl);
    } else if (data?.logo) {
      const temp = require("../../Assets/Projects/" + data.logo);
      setPhoto(temp);
    }
  }, [data]);
  // const currRef = React.useRef(null);
  const [scrolled, setScrolled] = useState(false);
  function scrollCheck(obj) {
    if (obj) {
      // console.log(obj.scrollTop, obj.scrollHeight - obj.offsetHeight);
      const calc = obj.scrollTop / (obj.scrollHeight - obj.offsetHeight);
      console.log(parseInt(calc) == 1);
      // if (obj.scrollTop === obj.scrollHeight - obj.offsetHeight) {
      if (parseInt(calc) == 1) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    } else {
      setScrolled(false);
    }
  }
  // console.log(scrolled);
  // scrollCheck(currRef?.current);
  // function isInViewport(element) {
  //   const rect = element?.getBoundingClientRect();
  //   if (rect)
  //     return (
  //       rect.top >= 0 &&
  //       rect.left >= 0 &&
  //       rect.bottom <=
  //         (window.innerHeight || document.documentElement.clientHeight) &&
  //       rect.right <=
  //         (window.innerWidth || document.documentElement.clientWidth)
  //     );
  //   return undefined;
  // }
  // console.log(isInViewport(currRef?.current));
  //   console.log(data.font);
  return (
    <div
      className="flex flex-col min-w-[90%] min-h-[70vh] max-h-[70vh] px-4 transition-all"
      // ref={currRef}
    >
      {data ? (
        <div
          className="transition-all dark:bg-[#66666675] dark:text-[white] text-black bg-[white] min-h-[65vh] mt-5 p-4 rounded-3xl border-[1px] border-gray-500 overflow-y-scroll relative"
          style={{
            // background: "rgba(126, 126, 126, 0.25)",
            boxShadow:
              "0px 2px 1px rgba(0, 0, 0, 0.05), inset 0px 1px 4px rgba(255, 255, 255, 0.1)",
          }}
          onScroll={(e) => scrollCheck(e.target)}
        >
          <div
            className="absolute top-0 right-0 text-[2rem] mr-5 hover:text-[#ff0000] z-30 cursor-pointer"
            onClick={() => setDisplay(false)}
          >
            -
          </div>
          {/* {data ? <div>{JSON.stringify(data)}</div> : null} */}
          <div className="flex flex-row gap-x-2 my-auto relative">
            {photo ? (
              <img
                src={photo}
                alt="logo"
                className="w-[100px] h-[100px] rounded-lg p-2 z-10 object-contain"
                style={{
                  background:
                    "linear-gradient(147.37deg, #363636 -20.04%, #000000 135.5%)",
                }}
              />
            ) : null}
            <div
              className="absolute bottom-0 w-full h-[50%] z-0 rounded-lg"
              style={{
                background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, ${data.color}20 100%)`,
              }}
            ></div>
            <div className="my-auto z-10">
              <div
                className="text-xl"
                style={{
                  fontFamily: data.font !== undefined ? data.font : "Helvetica",
                }}
              >
                {data.name}
              </div>
              <div>{data?.tagline}</div>
            </div>
          </div>
          <div className="transition-all mt-3">
            <div>
              <p className="font-bold text-lg mt-2 font-[Helvetica] flex flex-row py-2 items-center gap-x-2">
                <div className="text-2xl">
                  <MdOutlineDescription />
                </div>{" "}
                Description
              </p>

              {data.description}
              {/* {info.length <= 103 ? (
                <span
                  className="font-bold cursor-pointer"
                  onClick={() => setInfo(data.description)}
                >
                  Read More
                </span>
              ) : null} */}
            </div>
            <div>
              <p className="font-bold text-lg mt-2 font-[Helvetica] flex flex-row py-2 items-center gap-x-2">
                <div className="text-2xl">
                  <FaHourglassStart />
                </div>{" "}
                Timeline
              </p>
              Project Started : {data.timeline.start}
              <br />
              Project Ended : {data.timeline.end}
            </div>
          </div>
          <div>
            <p className="font-bold text-lg mt-2 font-[Helvetica] flex flex-row py-2 items-center gap-x-2">
              <div className="text-2xl">
                <HiOutlineCode />
              </div>{" "}
              Tech Stack
            </p>
            <div className="flex flex-row flex-wrap gap-y-2 gap-x-2">
              {data.stack.map((item, index) => {
                return <Stack name={item} />;
              })}
            </div>
            {/* <div>
              {data?.gallery ? (
                <div className="flex flex-col gap-y-2">
                  <p
                    className="font-bold text-lg mt-2 font-[Helvetica]"
                    onClick={() => {
                      setShowGallery(true);
                      setGallery(data.gallery);
                      setProject(data);
                      setIndex(0);
                    }}
                  >
                    View all Gallery
                  </p>
                </div>
              ) : null}
              {data?.gallery?.map((item, index) => {
                return (
                  <div className="flex flex-col">
                    <div>
                      {index} - {item}
                    </div>
                  </div>
                );
              })}
            </div> */}
            <div className="relative transition-all w-full bg-[#ffffff20] backdrop-blur-md rounded-xl p-2 flex flex-row justify-evenly items-center mt-5">
              <div
                className={`button flex flex-col justify-center items-center transition-all h-10 w-10 ${
                  scrolled ? "slide-in-right" : ""
                }`}
                style={{
                  "--color": data.color,
                }}
                onClick={() => {
                  setShowGallery(true);
                  setGallery(data.gallery);
                  setProject(data);
                  setIndex(0);
                }}
              >
                <img src={gal} className="object-contain" />
              </div>
              {data.link ? (
                <a href={data.link} target="_blank">
                  <div
                    className={` text-white rounded-3xl cursor-pointer py-2 px-6 w-max text-center peer mx-auto`}
                    style={{
                      background: data.color,
                      "--color": data.color,
                    }}
                    // ref={currRef}
                  >
                    Visit Project
                  </div>
                  {/* <div
                  className="button flex flex-col justify-center items-center peer-hover:translate-x-1 hover:translate-x-1 hover:opacity-100 -translate-x-9 -z-10 peer-hover:z-10 duration-500 transition-all absolute top-0 left-[50%] h-10 w-10"
                  style={{
                    "--color": data.color,
                  }}
                >
                  {">"}
                </div> */}
                </a>
              ) : (
                <div
                  onClick={() => {
                    window.alert("Project is not Hosted Live at the moment!");
                  }}
                  target="_blank"
                  onE
                >
                  <div
                    className={` text-white rounded-3xl cursor-pointer py-2 px-6 w-max text-center peer mx-auto`}
                    style={{
                      background: data.color,
                      "--color": data.color,
                    }}
                    // ref={currRef}
                  >
                    Visit Project
                  </div>
                  {/* <div
                  className="button flex flex-col justify-center items-center peer-hover:translate-x-1 hover:translate-x-1 hover:opacity-100 -translate-x-9 -z-10 peer-hover:z-10 duration-500 transition-all absolute top-0 left-[50%] h-10 w-10"
                  style={{
                    "--color": data.color,
                  }}
                >
                  {">"}
                </div> */}
                </div>
              )}
              {data.github ? (
                <a
                  href={data.github}
                  target="_blank"
                  className={`button flex flex-col justify-center items-center transition-all h-10 w-10 ${
                    scrolled ? "slide-in-left" : ""
                  }`}
                  style={{
                    "--color": data.color,
                  }}
                >
                  <img src={gh} className="object-contain" />
                </a>
              ) : (
                <div
                  onClick={() => {
                    window.alert("Project Github Repository Unavailable");
                  }}
                  className={`button flex flex-col justify-center items-center transition-all h-10 w-10 ${
                    scrolled ? "slide-in-left" : ""
                  }`}
                  style={{
                    "--color": data.color,
                  }}
                >
                  <img src={gh} className="object-contain" />
                </div>
              )}
            </div>
            {/* <div className="relative transition-all ">
              <a href={data.link} target="_blank">
                <div
                  className={`mt-5 text-white rounded-3xl cursor-pointer py-2 px-4 w-[50%] text-center peer`}
                  style={{
                    background: data.color,
                    "--color": data.color,
                  }}
                >
                  Visit Project
                </div>
                <div
                  className="button flex flex-col justify-center items-center peer-hover:translate-x-1 hover:translate-x-1 hover:opacity-100 -translate-x-9 -z-10 peer-hover:z-10 duration-500 transition-all absolute top-0 left-[50%] h-10 w-10"
                  style={{
                    "--color": data.color,
                  }}
                >
                  {">"}
                </div>
              </a>
            </div> */}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DisplayPanel;
