import React from "react";
import explorer from "../../../Assets/Icons/explorer.svg";
import { useDispatch } from "react-redux";
import { toggleExplorer } from "../../../Utility/state/action";
import close from "../../../Assets/Images/closered.svg";
import { useSelector } from "react-redux";
import { AiOutlineArrowLeft, AiOutlineSearch } from "react-icons/ai";
import noise from "../../../Assets/Theme/noise2.svg";
import info from "../../../Assets/Images/info.svg";
import glass1 from "../../../Assets/Theme/cert/glass1.svg";
import title from "../../../Assets/Theme/cert/title.svg";
import desc from "../../../Assets/Theme/cert/desc.svg";
import date from "../../../Assets/Theme/cert/date.svg";
import issuer from "../../../Assets/Theme/cert/issuer.svg";
const Explorer = ({ data, show, setShow }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  return (
    <div className="w-[100vw] h-[100vh]  font-[Helvetica] absolute top-[0] left-0 z-[210] flex flex-row justify-center overflow-hidden transition-all">
      <div className=" w-[100%] rounded-xl h-[85vh] flex flex-row justify-start text-white shadow-lg drop-shadow-xl">
        <div className="w-[75%] bg-[#292929] h-full rounded-xl flex-col flex py-6 px-4 overflow-hidden">
          <div className="flex flex-row px-5 relative">
            <span
              className="ml-3 absolute text-xl mt-2 cursor-pointer"
              onClick={() => {
                setShow(false);
              }}
            >
              <AiOutlineArrowLeft></AiOutlineArrowLeft>
            </span>
            <span className="ml-12 absolute text-xl mt-2">
              <AiOutlineSearch></AiOutlineSearch>
            </span>
            <input
              className="w-[90%] h-[5vh] rounded-lg px-3 pl-[9rem] text-gray-300"
              disabled
              value={`//file//drive:/user/ayushsharma/${data.name
                .split(" ")
                .join("-")
                .toLowerCase()}`}
              style={{
                //   border: "1px solid",
                //   borderImage:
                //     "linear-gradient(114.55deg, rgba(72, 72, 72, 0.9) 2.13%, rgba(150, 150, 150, 0) 98.14%), radial-gradient(97.09% 224.61% at 1.38% 96.94%, rgba(137, 137, 137, 0) 0%, #6B6B6B 100%), radial-gradient(97.57% 210.75% at 0.9% 2.98%, rgba(112, 112, 112, 0) 0%, #222222 100%)",
                background: `url(${data.issuer.image}), linear-gradient(114.55deg, rgba(72, 72, 72, 0.9) 2.13%, rgba(150, 150, 150, 0) 98.14%), radial-gradient(97.57% 210.75% at 0.9% 2.98%, rgba(112, 112, 112, 0) 0%, #333333 100%), radial-gradient(97.57% 210.75% at 0.9% 2.98%, rgba(134, 134, 134, 0.4) 0%, rgba(213, 213, 213, 0.4) 100%), radial-gradient(97.09% 224.61% at 1.38% 96.94%, rgba(137, 137, 137, 0) 0%, #6f6f6f 100%)`,
                backgroundPosition: "90px,center",
                backgroundSize: "30px, cover",
                backgroundRepeat: "no-repeat",
              }}
            ></input>
            <div
              className="my-auto ml-auto"
              onClick={() => {
                // setShow(false);
                dispatch(toggleExplorer(false));
              }}
            >
              <img src={close} className="cursor-pointer" />
            </div>
          </div>
          <div className="flex flex-row justify-between my-7 p-4 ">
            <div className="basis-2/3 h-[90%] overflow-y-scroll relative">
              <img
                src={data.image}
                className="z-0 object-contain h-[90%] bg-red-100 max-h-[90%] my-auto rounded-md mx-auto shadow-inner"
              ></img>
            </div>
            <div className="basis-1/3 h-[90%]">
              <div
                className="bg-[#ffffff20] backdrop-blur-md w-full h-[90%] rounded-[2.1rem] border-2 border-gray-400 flex flex-col p-3"
                style={{
                  backgroundImage: `url(${glass1})`,
                  //   backdropFilter: "brightness(0.1) saturate(0)",
                  backgroundSize: "cover",
                }}
              >
                <div className="flex flex-row py-2 px-2 place-items-center border-b-2 border-gray-500">
                  <img src={info} width={25} className="my-auto mt-1" />
                  <div className="my-auto ml-3 text-lg text-bold">Info</div>
                </div>
                <div className="flex flex-col">
                  <div className="flex flex-row py-2 px-2 mt-3 place-items-center">
                    <img src={title} width={20} className="my-auto mt-1" />
                    <div className="my-auto ml-3 text-md text-bold">Title</div>
                  </div>
                  <div className="px-10 text-gray-300">{data.name}</div>
                </div>
                <div className="flex flex-col">
                  <div className="flex flex-row py-2 px-2 mt-3 place-items-center">
                    <img src={issuer} width={20} className="my-auto mt-1" />
                    <div className="my-auto ml-3 text-md text-bold">
                      Issued By
                    </div>
                  </div>
                  <div className="px-10 text-gray-300">{data.issuer.name}</div>
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
                      Issued on
                    </div>
                  </div>
                  <div className="px-10 text-gray-300">{data.date}</div>
                </div>
                <div className="relative transition-all ml-4">
                  <a href={data.link} target="_blank">
                    <div
                      className={`mt-5 text-white rounded-3xl cursor-pointer py-2 px-4 w-[50%] text-center peer`}
                      style={{
                        background: "#ef6522",
                      }}
                    >
                      Visit Certificate
                    </div>
                    <div className="bg-[#ef6522] button flex flex-col justify-center items-center peer-hover:translate-x-1 hover:translate-x-1 hover:opacity-100 -translate-x-9 -z-10 peer-hover:z-10 duration-500 transition-all absolute top-5 left-[50%] h-10 w-10">
                      {">"}
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explorer;
