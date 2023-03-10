import React, { useEffect, useState } from "react";
import data from "../Data/main.json";
import { Link } from "react-router-dom";
import DateTime from "../Components/datetime";
import wallpaper from "../Assets/Images/lock.svg";
import MusicTaskbar from "../Components/MusicTaskbar";
// import "../Utility/handleMouse";
const Lock = ({ lock, setLock, playing, nowPlaying }) => {
  // Import Lockscreen Background
  console.log(data.name);
  const bg = require(`../Assets/Theme/${data.lock_screen}`);
  const profile = require(`../Assets/Theme/${data.lockprofile}`);
  console.log(bg);
  // The datetime methods

  // Mouse Function
  //   let myDiv = document.getElementById("mouse");
  //   // console.log(myDiv);
  //   //Detect touch device

  //   const move = (e) => {
  //     //Try, catch to avoid any errors for touch screens (Error thrown when user doesn't move his finger)
  //     try {
  //       //PageX and PageY return the position of client's cursor from top left of screen
  //       var x = e.pageX;
  //       var y = e.pageY;
  //     } catch (e) {}
  //     //set left and top of div based on mouse position
  //     // console.log(myDiv);
  //     myDiv.style.left = x - 50 + "px";
  //     myDiv.style.top = y - 50 + "px";
  //   };
  //   //For mouse
  //   document.addEventListener("mousemove", (e) => {
  //     move(e);
  //   });
  const handleOut = () => {
    if (lock) {
      const doc = document.querySelector("#main-lock");
      localStorage.setItem("lastlogin", new Date().getTime());

      doc.style.transform = "translateY(-100vh)";
      const main = document.querySelector("#main-div-lock");
      console.log(doc);
      setTimeout(() => {
        setLock(false);
        main.style.display = "none";
        // localStorage.setItem("lastlogin", new Date().getTime());
      }, 1000);
    } else {
      return;
    }
  };

  document.body.onkeyup = function (e) {
    if (lock) {
      if (e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
        localStorage.setItem("lastlogin", new Date().getTime());

        //   console.log(e.keyCode);
        handleOut();
      }
    } else return;
  };

  return (
    <div id="main-div-lock overflow-hidden">
      {lock ? (
        <div
          className=" w-[100vw] h-[100vh] bg-cover bg-center bg-no-repeat backdrop-filter z-[100] backdrop-blur-lg transition duration-1000"
          id="main-lock"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundColor: "black",
          }}
        >
          <div className="w-[100vw] h-[100vh] bg-cover bg-center bg-no-repeat bg-[#ffffff10] backdrop-blur-xl pt-8 backdrop-brightness-75">
            <div className="w-screen flex-row justify-center flex">
              <DateTime />
            </div>
            <div
              className={`
        rounded-full
        bg-[#ff000050]
        
        absolute
        blur-xl
        -translate-x-1/2
        -translate-y-1/2
        shadow-lg
        ease-in-out
        
        `}
              id="mouse"
              style={{
                width: "8em",
                height: "8em",
                //   onMouseOver={(e) => {
                //     console.log(e.target);
              }}
            ></div>
            <div className="flex flex-col justify-center align-middle place-items-center mt-20 gap-y-10">
              <img
                src={profile}
                className="w-[10vw] mx-auto rounded-full border-2 border-white  "
              />
              <div className="font-[Monoton] text-[4rem] text-white">
                {data.name}
              </div>
              <Link onClick={handleOut}>
                <div className="flex flex-row gap-x-2">
                  <div className="px-6 py-2 text-lg bg-white rounded-3xl font-[Helvetica] cursor-pointer">
                    Unlock Device
                  </div>
                  <div className="px-4 aspect-square py-2 my-auto text-lg bg-white rounded-[50%] font-[Helvetica] cursor-pointer">
                    &gt;
                  </div>
                </div>
              </Link>
              <div>
                {playing && nowPlaying ? (
                  <MusicTaskbar playing={playing} nowPlaying={nowPlaying} />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Lock;
