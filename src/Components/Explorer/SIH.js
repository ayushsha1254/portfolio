import React, { useEffect, useRef } from "react";

import Fade from "react-reveal/Fade";
import Zoom from "react-reveal/Zoom";
import Slide from "react-reveal/Slide";
import mainbg from "../../Assets/sih/mainbg.svg";
import mainbgdark from "../../Assets/sih/maindarkbg.svg";
import * as animationData from "../../Assets/Lottie/loading.json";
import lottie from "lottie-web";
import main from "../../Assets/sih/main.svg";
import { useParallax, Parallax } from "react-scroll-parallax";
import team from "../../Assets/sih/team.svg";
import ea from "../../Assets/sih/envisionalpha.svg";
import { useSelector } from "react-redux";
import Matrix from "../Matrix";
import media from "../../Assets/sih/media.svg";
import cert from "../../Assets/sih/cert.png";
import rishit from "../../Assets/sih/rishit.svg";
import ayush from "../../Assets/sih/ayush.svg";
import divyanshu from "../../Assets/sih/divyanshu.svg";
import abhishek from "../../Assets/sih/abhishek.svg";
import shrishti from "../../Assets/sih/shrishti.svg";
import chull from "../../Assets/sih/chull.svg";

import media1 from "../../Assets/sih/media1.svg";
import media2 from "../../Assets/sih/media2.svg";

const amount = 6;
const offA = -20;
const offB = 5;
const unit = "%";
const elements = new Array(amount).fill(null).map((x, i) => i);

const SIH = ({ show, setShow }) => {
  function getRndInteger(min, max) {
    return Math.random() * (max - min) + min;
  }
  const [loaded, setLoaded] = React.useState(false);
  const state = useSelector((state) => state);
  const [time, setTime] = React.useState(1000);
  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, getRndInteger(1000, 3000));
  }, []);
  const lottieRef = useRef(null);

  const arr = [
    {
      name: "Ayush Sharma",
      img: rishit,
    },
    {
      name: "Ayush Sharma",
      img: ayush,
    },
    {
      name: "Divyanshu Kaushik",
      img: divyanshu,
    },
    {
      name: "Abhishek Dubey",
      img: abhishek,
    },
    {
      name: "Shrishti Gupta",
      img: shrishti,
    },
    {
      name: "Sahaj Ghatiya",
      img: chull,
    },
  ];
  function getRandomElements(arr) {
    const numElements = Math.floor(Math.random() * 2) + 5; // generates a random number between 5 and 6
    // const shuffled = arr.sort(() => 0.5 - Math.random()); // shuffles the array randomly
    return arr.slice(0, numElements); // returns the first numElements elements
  }

  useEffect(() => {
    lottie.loadAnimation({
      container: lottieRef.current,
      renderer: "svg",
      loop: false,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
        speed: 0.2,
      },
    });

    return () => {
      lottie.destroy();
    };
  }, []);
  return (
    <>
      {!loaded ? (
        <div className="bg-black w-full h-[100vh] absolute top-0 left-0 z-[300] flex flex-row justify-center place-items-center">
          <Matrix width={window.innerWidth} height={window.innerHeight} />
          <div className="w-[30vw] h-[20vh] " ref={lottieRef}></div>
        </div>
      ) : null}
      <div
        className="p-10 pt-14 w-[100vw] overflow-hidden font-[Helvetica] min-h-[100vh] absolute top-0 left-0 dark:bg-[#222222] bg-[#f7f7f7] z-[300] text-black dark:text-white"
        style={{
          backgroundImage: state.theme
            ? `url(${mainbgdark})`
            : `url(${mainbg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "0% 13%",
          display: loaded ? "block" : "none",
        }}
      >
        <div className="px-4 w-full h-[4vh] bg-[#444444] dark:bg-[#646464] fixed z-[400] top-0 right-0 flex flex-row justify-between place-items-center">
          <div className="text-white ">
            user://file//Smart India Hackathon 22 Story.exe
          </div>
          <div
            className="w-[1rem] h-[1rem] rounded-full bg-[#ff0000] cursor-pointer z-[300]"
            onClick={() => {
              setShow(false);
            }}
          ></div>
        </div>
        <div className="min-h-[90vh] relative">
          <Fade top delay={300}>
            <div className="w-[100%] text-3xl">Team Envision Alpha wins</div>
          </Fade>
          <Zoom bottom delay={0}>
            <div className="w-[100%] text-[5vw] font-bold">
              Smart <span className="text-[#ef6522]">India</span> Hackathon
            </div>
          </Zoom>
          <div className="relative w-[80%] mx-auto mt-10">
            <Fade bottom delay={100}>
              <div className="max-w-[80%] mx-auto z-10">
                <img src={main} className="max-w-[100%] mx-auto z-10"></img>
              </div>
            </Fade>
            <Fade top delay={200}>
              <div className="absolute rounded-[4000px] w-[100%] dark:bg-[#fff] bg-black h-[5vh] mx-auto z-[100] -mt-[15vh] animate-[ping_0.5s_linear_1]"></div>
            </Fade>
          </div>
        </div>
        <div className=" flex flex-row justify-evenly place-items-center min-h-[90vh] pb-10">
          <div className="relative mt-20">
            <div className="w-[17vw]  h-[55vh] z-[100] rounded-[4000px] bg-[white] flex flex-row justify-center place-items-center px-10 spinner">
              <img src={ea} className="object-contain" />
            </div>
            <Parallax
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                zIndex: -1,
              }}
              rotate={[0, -10]}
            >
              <div
                rotateY={45}
                style={{
                  zIndex: 100,
                }}
                className="absolute top-0 left-0 z-[105] w-[17vw] h-[55vh] rounded-[4000px] bg-[#ef6522] flex flex-row justify-center place-items-center px-10"
              ></div>
            </Parallax>
          </div>
          <div className="flex flex-col w-[50%] gap-y-5">
            <div className="relative w-full pb-20">
              <span className="font-black absolute right-0 top-0 text-[#ef6522] text-[2.5rem] text-right">
                Problem Statement
              </span>
              <Parallax
                opacity={[2, -2]}
                className="absolute right-0 top-0 font-black text-black dark:text-white text-[2.5rem] text-right"
                speed={0.5}
              >
                Problem Statement
              </Parallax>
            </div>

            <div className="relative">
              <p className="text-justify">
                Currently in AICTE Event/Activity Management happens manually.
                Such examples of activities that happen manually are Booking of
                meeting room/auditorium, communication to all the
                bureaus/members regarding meetings through email and SMS alerts,
                intimate canteen for refreshment/Lunch/dinner arrangements,
                update the information on AICTE social media like Facebook &
                Twitter page, Report generation, activity log checking etc. This
                manual process generally takes a lot of time to implement and
                can cause delay to the actual work. With the fast growing
                network of AICTE, it needs to automate its process to provide
                ease to manual work. This can highly increase in economic growth
                of AICTE and manage all events very smoothly with all
                information to have directed to one single portal.
              </p>
              <Parallax
                className="text-justify absolute top-0 left-0 text-[#ef6522]"
                opacity={[2, -2]}
                speed={0.5}
              >
                Currently in AICTE Event/Activity Management happens manually.
                Such examples of activities that happen manually are Booking of
                meeting room/auditorium, communication to all the
                bureaus/members regarding meetings through email and SMS alerts,
                intimate canteen for refreshment/Lunch/dinner arrangements,
                update the information on AICTE social media like Facebook &
                Twitter page, Report generation, activity log checking etc. This
                manual process generally takes a lot of time to implement and
                can cause delay to the actual work. With the fast growing
                network of AICTE, it needs to automate its process to provide
                ease to manual work. This can highly increase in economic growth
                of AICTE and manage all events very smoothly with all
                information to have directed to one single portal.
              </Parallax>
            </div>
          </div>
        </div>
        <div>
          <div className="text-[2.5rem] font-bold">Meet the Team</div>
          <div className="flex flex-row justify-evenly place-items-center mt-10">
            {/* <div className="w-44 h-44 bg-red-100 rounded-lg"></div> */}
            <div className={`flex flex-row justify-evenly w-[100%] mb-4`}>
              {/* {elements.map((_, i) => {
                const n = i - amount;
                return (
                  <Parallax
                    key={n}
                    className={""}
                    translateX={[`${offA * n}${unit}`, `${offB * n}${unit}`]}
                  >
                    <img src={team}></img>
                    
                  </Parallax>
                );
              })} */}

              {arr.map((item, idx) => {
                const n = idx - arr.length;
                return (
                  <Parallax
                    key={n}
                    className={"flex flex-col items-center"}
                    translateX={[`${offA * n}${unit}`, `${offB * n}${unit}`]}
                  >
                    <img src={item.img} className="z-10"></img>
                    <div className="z-0 px-6 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full -mt-2 font-[Helvetica] font-bold">
                      {item.name}
                    </div>
                  </Parallax>
                );
              })}
            </div>
          </div>
        </div>
        <div className=" pb-20">
          <div className="text-[2.5rem] font-bold">Media Coverage</div>
          {/* <Parallax scale={[0, 1]} className="flex flex-row justify-center">
            <img src={media} />
          </Parallax>
          <div className="flex flex-row justify-evenly my-10">
            <Parallax speed={10} scale={[0.7, 1.1]}>
              <img src={media} />
            </Parallax>
            <Parallax translateY={[40, -40]}>
              <img src={media} />
            </Parallax>
          </div>
          <Parallax>
            <div className="flex flex-row justify-evenly mt-30 pb-20">
              <img src={media} />
              <img src={media} />
            </div>
          </Parallax> */}
          <Parallax
            scale={[0.7, 1.0]}
            className="mt-4 flex flex-row justify-evenly"
          >
            <img src={media1} />
            <img src={media2} />
          </Parallax>
        </div>
        <div className="text-[2.5rem] font-bold my-4 mb-8">Certificate</div>

        <img src={cert} />
        <div className="px-4 w-full h-[2vh] bg-[#444444] dark:bg-[#646464] fixed z-[400] bottom-0 right-0 flex flex-row justify-between place-items-center"></div>
        <div className=" w-[0.5vw] h-[100vh] bg-[#444444] dark:bg-[#646464] fixed z-[400] top-0 right-0 flex flex-row justify-between place-items-center"></div>
        <div className=" w-[0.5vw] h-[100vh] bg-[#444444] dark:bg-[#646464] fixed z-[400] top-0 left-0 flex flex-row justify-between place-items-center"></div>
      </div>
    </>
  );
};

export default SIH;
