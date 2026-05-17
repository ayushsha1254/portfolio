import React, { useEffect, useState } from "react";
import explorer from "../../Assets/Icons/explorer.svg";
import { useDispatch } from "react-redux";
import { toggleExplorer } from "../../Utility/state/action";
import close from "../../Assets/Images/closered.svg";
import { useSelector } from "react-redux";
import { AiOutlineArrowLeft, AiOutlineSearch } from "react-icons/ai";
import noise from "../../Assets/Theme/noise2.svg";
import info from "../../Assets/Images/info.svg";
import glass1 from "../../Assets/Theme/cert/glass1.svg";
import title from "../../Assets/Theme/cert/title.svg";
import desc from "../../Assets/Theme/cert/desc.svg";
import date from "../../Assets/Theme/cert/date.svg";
import issuer from "../../Assets/Theme/cert/issuer.svg";
import logo from "../../Assets/Icons/exp.svg";
import { useSpringCarousel } from "react-spring-carousel";
import { BsArrowLeftSquare, BsArrowRightSquare } from "react-icons/bs";

const Viewer = ({
  data,
  show,
  setShow,
  setKeepExplorer,
  setGallery,
  setIndex,
  index,
  project,
  gallery,
}) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  useEffect(() => {
    if (!state.explorer && state.lock) {
      setShow(false);
    }
  }, []);
  const [photo, setPhoto] = useState(null);
  useEffect(() => {
    if (project?.logourl) {
      setPhoto(project.logourl);
    } else if (project?.logo) {
      const temp = require("../../Assets/Projects/" + project.logo);
      setPhoto(temp);
    }
  }, [project]);
  console.log(project);
  const images = () => {
    return gallery.map((item, index) => {
      return {
        id: index,
        renderItem: (
          <div className="relative mx-auto">
            <div className="w-full text-center bg-[#00000150]">
              Image : {index + 1} / {gallery.length}
            </div>
            <img
              src={item}
              className="object-contain h-[90%] max-h-[90%] my-auto rounded-md shadow-inner"
            />
          </div>
        ),
      };
    });
  };

  console.log(images());
  const { carouselFragment, slideToPrevItem, slideToNextItem } =
    useSpringCarousel({
      items: images(),
    });

  return (
    <div className="w-[100vw] h-[100vh] bg-[#ffffff05] backdrop-blur font-[Helvetica] absolute top-[0] left-0 z-[210] flex flex-row justify-center place-items-center overflow-hidden transition-all">
      <div className=" w-[75%] rounded-xl h-[85vh] bg-[#ffffff10] backdrop-blur-3xl mx-auto flex flex-row justify-center text-white shadow-lg drop-shadow-xl">
        <div className="mx-auto w-[100%] h-[100%] bg-[#fffff20] backdrop-blur-3xl rounded-xl flex-col flex py-6 px-4 overflow-hidden">
          <div className="flex flex-row px-5 relative">
            <span
              className="ml-3 absolute text-xl mt-2 cursor-pointer"
              onClick={() => {
                setShow(false);
                setKeepExplorer(true);
              }}
            >
              <AiOutlineArrowLeft></AiOutlineArrowLeft>
            </span>
            <span className="ml-12 absolute text-xl mt-2">
              <AiOutlineSearch></AiOutlineSearch>
            </span>
            <input
              className="w-[90%] h-[5vh] rounded-lg px-3 pl-[9rem] text-gray-300 lowercase"
              disabled
              value={`//photo//drive:/user/ayushsharma/${project?.name
                ?.split(" ")
                .join("-")}/${index + 1}.bmp `}
              style={{
                //   border: "1px solid",
                //   borderImage:
                //     "linear-gradient(114.55deg, rgba(72, 72, 72, 0.9) 2.13%, rgba(150, 150, 150, 0) 98.14%), radial-gradient(97.09% 224.61% at 1.38% 96.94%, rgba(137, 137, 137, 0) 0%, #6B6B6B 100%), radial-gradient(97.57% 210.75% at 0.9% 2.98%, rgba(112, 112, 112, 0) 0%, #222222 100%)",
                background: `url(${logo}), linear-gradient(114.55deg, rgba(72, 72, 72, 0.9) 2.13%, rgba(150, 150, 150, 0) 98.14%), radial-gradient(97.57% 210.75% at 0.9% 2.98%, rgba(112, 112, 112, 0) 0%, #333333 100%), radial-gradient(97.57% 210.75% at 0.9% 2.98%, rgba(134, 134, 134, 0.4) 0%, rgba(213, 213, 213, 0.4) 100%), radial-gradient(97.09% 224.61% at 1.38% 96.94%, rgba(137, 137, 137, 0) 0%, #6f6f6f 100%)`,
                backgroundPosition: "90px,center",
                backgroundSize: "30px, cover",
                backgroundRepeat: "no-repeat",
              }}
            ></input>
            <div
              className="my-auto ml-auto"
              onClick={() => {
                // setShow(false);
                setShow(false);
                dispatch(toggleExplorer(false));
                setKeepExplorer(false);
              }}
            >
              <img src={close} className="cursor-pointer" />
            </div>
          </div>

          <div className="flex flex-row justify-between my-7 px-4 h-full relative py-4">
            <div className="basis-2/3 h-[100%] overflow-y-scroll relative my-auto overflow-x-hidden">
              <div>{carouselFragment}</div>
              <div className="flex flex-row justify-between absolute my-auto w-full h-full top-0 left-0 text-3xl ">
                <button onClick={slideToPrevItem}>
                  <BsArrowLeftSquare />
                </button>
                <button
                  onClick={slideToNextItem}
                  className="hover:text-[#555555] transition-all"
                >
                  <BsArrowRightSquare />
                </button>
              </div>
            </div>
            <div className="basis-1/3 h-[100%]">
              <div
                className="bg-[#00000140] backdrop-blur-xl w-full h-[100%] rounded-[2.1rem] border-2 border-gray-400 flex flex-col p-3"
                style={{
                  // backgroundImage: `url(${glass1})`,
                  //   backdropFilter: "brightness(0.1) saturate(0)",
                  backgroundSize: "cover",
                }}
              >
                <div className="flex flex-row py-2 px-2 place-items-center border-b-2 border-gray-500">
                  <img src={info} width={25} className="my-auto mt-1" />
                  <div className="my-auto ml-3 text-lg text-bold">Info</div>
                </div>
                <div className="flex flex-col">
                  <img src={photo} className="w-[20%] mx-auto" />
                  <div className="flex flex-row py-2 px-2 mt-3 place-items-center">
                    <img src={title} width={20} className="my-auto mt-1" />
                    <div className="my-auto ml-3 text-md text-bold">
                      Project Title
                    </div>
                  </div>
                  <div className="px-10 text-gray-300">{project?.name}</div>
                </div>
                <div className="flex flex-col">
                  <div className="flex flex-row py-2 px-2 mt-3 place-items-center">
                    <img src={issuer} width={20} className="my-auto mt-1" />
                    <div className="my-auto ml-3 text-md text-bold">
                      Made Using
                    </div>
                  </div>
                  <div className="px-10 text-gray-300 capitalize flex flex-row flex-wrap">
                    {project.stack.map((item) => {
                      return (
                        <span className="mr-2">
                          {item}
                          {project.stack.indexOf(item) !==
                          project.stack.length - 1
                            ? ","
                            : ""}
                        </span>
                      );
                    })}
                  </div>
                </div>
                {/* <div className="flex flex-col">
                  <div className="flex flex-row py-2 px-2 mt-3 place-items-center">
                    <img src={desc} width={20} className="my-auto mt-1" />
                    <div className="my-auto ml-3 text-md text-bold">
                      Description
                    </div>
                  </div>
                  <div className="px-10 text-gray-300">{data.name}</div>
                </div> */}
                <div className="flex flex-col">
                  <div className="flex flex-row py-2 px-2 mt-3 place-items-center">
                    <img src={date} width={20} className="my-auto mt-1" />
                    <div className="my-auto ml-3 text-md text-bold">
                      Timeline
                    </div>
                  </div>
                  <div className="px-10 text-gray-300">
                    {project?.timeline.start} - {project?.timeline.end}
                  </div>
                  {/* <div className="px-10 text-gray-300">{data.date}</div> */}
                </div>
                <div className="relative transition-all ml-4">
                  <div>
                    <div
                      className={`mt-5 text-white rounded-3xl cursor-pointer py-2 px-4 w-[50%] text-center peer`}
                      style={{
                        background: "#ef6522",
                      }}
                      onClick={() => {
                        setShow(false);
                        setKeepExplorer(true);
                      }}
                    >
                      Go Back
                    </div>
                    <div className="bg-[#ef6522] button flex flex-col justify-center items-center peer-hover:translate-x-1 hover:translate-x-1 hover:opacity-100 -translate-x-9 -z-10 peer-hover:z-10 duration-500 transition-all absolute top-5 left-[50%] h-10 w-10">
                      {"<"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewer;
