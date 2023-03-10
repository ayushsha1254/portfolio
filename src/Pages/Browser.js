import React from "react";
import Explorer from "../Components/Explorer";
import { AiOutlineArrowLeft, AiOutlineSearch } from "react-icons/ai";
import explorer from "../Assets/Icons/explorer.svg";
import close from "../Assets/Images/closered.svg";
import { useState } from "react";
import { useEffect } from "react";

const Browser = () => {
  const [url, setUrl] = useState("");
  console.log(url);

  //   if (url) {
  //     var browserFrame =
  //       document.getElementById("browserIframe").contentWindow.location.href;
  //   }

  //   var browserFrame =
  //     document.getElementById("browserIframe").contentWindow.location.href;

  //   useEffect(() => {
  //     if (browserFrame) setUrl(browserFrame);
  //   }, [browserFrame]);
  const isValidUrl = (urlString) => {
    try {
      return Boolean(new URL(urlString));
    } catch (e) {
      return false;
    }
  };
  return (
    <div className="bg-black w-screen h-screen">
      Browser
      <div
        className="w-[100vw] h-[850vh] bg-[#0fffff02] absolute top-[10vh] left-0 z-[205] flex flex-row justify-center"
        style={{
          backdropFilter: "blur(7px)",
        }}
      >
        <div className=" w-[70%] rounded-lg h-[85vh] flex flex-row justify-start text-white shadow-lg drop-shadow-xl">
          <div
            className="w-[30%] h-full bg-[#84838340] backdrop-blur-2xl rounded-l-lg py-6 px-4"
            id="exp-main"
          >
            <div className=" font-[Helvetica] flex flex-row place-items-center text-xl gap-x-4 pb-4 border-b-2 border-opacity-50 border-[#6D6D6D]">
              <img src={explorer} />
              Browser
            </div>
          </div>
          <div className="w-[70%] bg-[#292929] h-full rounded-r-lg flex-col flex py-6 px-4 ">
            <div className="flex flex-row px-5 relative">
              <span className="ml-3 absolute text-xl mt-2">
                <AiOutlineArrowLeft></AiOutlineArrowLeft>
              </span>
              <span
                className="ml-12 absolute text-xl mt-2"
                onClick={() => {
                  const val = document.getElementById("urlSearchBar").value;
                  isValidUrl(val)
                    ? setUrl(val)
                    : setUrl("https://google.com?q=" + val);
                  //   setUrl(val);
                }}
              >
                <AiOutlineSearch></AiOutlineSearch>
              </span>
              <input
                className="w-[90%] h-[5vh] rounded-lg px-3 pl-24"
                id="urlSearchBar"
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
                  //   dispatch(toggleExplorer(false));
                }}
              >
                <img src={close} className="cursor-pointer" />
              </div>
            </div>
            <iframe
              className=" w-[95%] h-[80vh] mt-5 mx-auto"
              id="browserIframe"
              src={url}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browser;
