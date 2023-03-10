import React, { useState, useEffect, useRef } from "react";
import Explorer from "./Explorer";
import { useDispatch, useSelector } from "react-redux";
import Flip from "react-reveal/Fade";
import { toggleExplorer } from "../Utility/state/action";
import close from "../Assets/Images/closered.svg";
import { AiOutlineArrowLeft, AiOutlineSearch } from "react-icons/ai";
import photo from "../Assets/Theme/metransparent.svg";
import grass from "../Assets/Theme/grass.svg";
import projects from "../Assets/Theme/projects.svg";
import achievements from "../Assets/Theme/achievements.svg";
import Confetti from "react-confetti";
import cert1 from "../Assets/Theme/cert/1.svg";
import cert2 from "../Assets/Theme/cert/2.svg";
import cert3 from "../Assets/Theme/cert/3.svg";
import cert4 from "../Assets/Theme/cert/4.svg";
import cert5 from "../Assets/Theme/cert/5.svg";
import Matrix from "./Explorer/MatrixComp";
import skillsimg from "../Assets/Theme/skills.svg";
import axios from "axios";
import phone from "../Assets/Images/phone.svg";
import "atropos/css";
import Atropos from "atropos/react";
import socialbg from "../Assets/Images/socialbg.svg";
import contact from "../Assets/Images/contact.svg";
// import Lottie from "react-lottie";
import * as animationData from "../Assets/Lottie/social.json";
import lottie from "lottie-web";
import {
  MouseParallaxContainer,
  MouseParallaxChild,
} from "react-parallax-mouse";
import "./Explorer/Expanded.css";
import "./animate.css";
const ExpandedExplorer = ({
  setCert,
  setCertData,
  nowItem,
  journey,
  setJourney,
  certifications,
  skills,
  setGallery,
  setProject,
  setIndex,
  setShowGallery,
}) => {
  // const ref = useRef(null);
  const dispatch = useDispatch();
  const lottieRef = useRef(null);
  const state = useSelector((state) => state);
  const [explore, setItem] = React.useState();
  // const defaultOptions = {
  //   loop: false,
  //   autoplay: false,
  //   animationData: animationData,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice",
  //   },
  // };
  useEffect(() => {
    lottie.loadAnimation({
      container: lottieRef.current,
      renderer: "svg",
      loop: false,
      autoplay: false,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
        speed: 0.5,
      },
    });

    return () => {
      lottie.destroy();
    };
  }, []);
  useEffect(() => {
    if (nowItem) {
      setItem(nowItem);
    }
  }, [nowItem]);
  const confetti = document.getElementById("confetti");
  const [dimensions, setDimensions] = React.useState({ x: 500, y: 200 });
  console.log(explore);
  // const [refDim, setRefDim] = useState({ width: 0, height: 0 });
  // useEffect(() => {
  //   setRefDim({
  //     width: ref.current.offsetWidth,
  //     height: ref.current.offsetHeight,
  //   });
  // }, []);
  useEffect(() => {
    if (confetti) {
      setDimensions({
        x: confetti.clientWidth,
        y: confetti.clientHeight,
      });
    }
  }, [confetti && confetti.clientWidth]);
  // const [explore, setItem] = React.useState({
  //   item: "about",
  //   data: data["explorer"]["about"],
  // });

  const [ip, setIP] = useState("");

  //creating function to load ip address from the API
  const getData = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    console.log(res.data);
    setIP(res.data.IPv4);
  };

  useEffect(() => {
    //passing getData method to the lifecycle method
    getData();
  }, []);

  return (
    <>
      {explore !== undefined ? (
        <Explorer
          current={explore}
          setCurrent={setItem}
          ip={ip}
          setCert={setCert}
          setCertData={setCertData}
          journey={journey}
          setJourney={setJourney}
          certifications={certifications}
          skills={skills}
          setGallery={setGallery}
          setProject={setProject}
          setIndex={setIndex}
          setShowGallery={setShowGallery}
        /> // <Explorer explore={explore} setItem={setItem} />
      ) : (
        <div
          className="w-[100vw] h-[90vh] bg-[#0fffff02] absolute top-[10vh] left-0 z-[205] flex flex-row justify-center overflow-hidden"
          style={{
            backdropFilter: "blur(7px)",
          }}
        >
          {/* <Flip bottom opposite> */}
          <div
            id="explorer-exanded-main"
            className=" slide-in-bottom w-[70%] rounded-lg h-[85vh] flex flex-row justify-start text-white shadow-lg drop-shadow-xl"
          >
            <div
              className="w-[100%] h-full overflow-y-scroll bg-[#84838340] backdrop-blur-2xl rounded-l-lg py-6 px-4"
              id="exp-main"
            >
              <div className="flex flex-row px-5 relative">
                <span className="ml-3 absolute text-xl mt-2">
                  <AiOutlineArrowLeft></AiOutlineArrowLeft>
                </span>
                <span className="ml-12 absolute text-xl mt-2">
                  <AiOutlineSearch></AiOutlineSearch>
                </span>
                <input
                  className="w-[90%] h-[5vh] rounded-lg px-3 pl-24"
                  disabled
                  value={`user@${ip}:~$`}
                  style={{
                    //   border: "1px solid",
                    //   borderImage:
                    //     "linear-gradient(114.55deg, rgba(72, 72, 72, 0.9) 2.13%, rgba(150, 150, 150, 0) 98.14%), radial-gradient(97.09% 224.61% at 1.38% 96.94%, rgba(137, 137, 137, 0) 0%, #6B6B6B 100%), radial-gradient(97.57% 210.75% at 0.9% 2.98%, rgba(112, 112, 112, 0) 0%, #222222 100%)",
                    background:
                      "linear-gradient(114.55deg, rgba(72, 72, 72, 0.9) 2.13%, rgba(150, 150, 150, 0) 98.14%), radial-gradient(97.57% 210.75% at 0.9% 2.98%, rgba(112, 112, 112, 0) 0%, #333333 100%), radial-gradient(97.57% 210.75% at 0.9% 2.98%, rgba(134, 134, 134, 0.4) 0%, rgba(213, 213, 213, 0.4) 100%), radial-gradient(97.09% 224.61% at 1.38% 96.94%, rgba(137, 137, 137, 0) 0%, #6f6f6f 100%)",
                  }}
                ></input>
                <div
                  id="explorer-exit"
                  className="my-auto ml-auto"
                  onClick={() => {
                    const el = document.getElementById("explorer-exanded-main");
                    el.classList.remove("slide-in-bottom");
                    el.classList.add("slide-out-bck-bottom");
                    setTimeout(() => {
                      dispatch(toggleExplorer(false));
                    }, 500);
                  }}
                >
                  <img src={close} className="cursor-pointer" />
                </div>
              </div>
              <div className="mt-2 flex flex-row w-[100%] h-[90%] justify-center">
                <div
                  className="overflow-hidden flex flex-col basis-[24%] relative bg-[#A5CAF2] h-[88%] rounded-2xl py-4 my-auto group transition-all cursor-pointer"
                  onClick={() => {
                    setItem(
                      "about"
                      //   data: data["explorer"]["about"],
                    );
                  }}
                >
                  <div
                    className="w-[80%] duration-500 border-4 border-gray-300 h-[40%] bg-white text-[#1A89FF] font-bold transition-all group-hover:scale-[0.9] font-[Helvetica] drop-shadow-lg rounded-2xl shadow-xl px-3 py-3 mx-auto text-[2.5rem]"
                    style={{
                      textShadow: "0px 0px 10px #1A89FF",
                    }}
                  >
                    About Me
                  </div>

                  <img
                    src={photo}
                    className="z-10 duration-500 group-hover:scale-110 group-hover:-translate-y-5 transition-all absolute -bottom-3 right-0"
                  ></img>
                  <img
                    src={grass}
                    className="absolute bottom-0 w-full z-0 opacity-50"
                  ></img>
                </div>
                <div className="flex flex-col basis-[74%]  h-[90%] my-auto justify-around">
                  <div className="flex flex-row basis-[52%] w-[100%] justify-evenly">
                    <div
                      className="flex flex-row basis-[28%]  rounded-2xl cursor-pointer group overflow-hidden relative"
                      onMouseEnter={(e) => {
                        e.preventDefault();
                        document
                          .getElementById("skilldiv")
                          .classList.add("matrix");
                      }}
                      onMouseLeave={(e) => {
                        e.preventDefault();
                        document
                          .getElementById("skilldiv")
                          .classList.remove("matrix");
                      }}
                      style={{
                        background:
                          "linear-gradient(360deg, #B92910 -18.44%, #EB634A 100%)",
                      }}
                      onClick={() => {
                        setItem(
                          "skills"
                          //   data: data["explorer"]["projects"],
                        );
                      }}
                    >
                      <div className=" opacity-0 group-hover:opacity-100 transition-all duration-700">
                        <Matrix Sheight={300} Swidth={300} />
                      </div>
                      <div
                        className=" text-[#fff]font-bold transition-all font-[Helvetica] px-3 py-3 mx-auto text-[2.2rem] h-[4.2rem] group-hover:text-[#00ff41] mt-2"
                        style={{
                          textShadow: "0px 0px 2px #ffffff",
                        }}
                        id="skilldiv"
                        data-text="Skills"
                      >
                        Skills
                      </div>
                      <img
                        src={skillsimg}
                        className="w-full absolute bottom-0 group-hover:opacity-0 transition-all"
                      ></img>
                    </div>
                    <div
                      className="flex flex-row basis-[44%] rounded-2xl cursor-pointer group overflow-hidden transition-all"
                      style={{
                        background:
                          "linear-gradient(298.58deg, #2450B6 -14.35%, #0CC4C8 113.65%)",
                      }}
                      onClick={() => {
                        setItem(
                          "certifications"
                          //   data: data["explorer"]["projects"],
                        );
                      }}
                    >
                      <div className="flex flex-col flex-wrap">
                        <div
                          className=" text-[#fff]  ml-1 font-bold transition-all font-[Helvetica] px-3 pt-3 mx-auto text-[1.5rem] xl:text-[1.9rem] overflow-hidden mr-5"
                          style={{
                            textShadow: "0px 0px 2px #ffffff",
                          }}
                        >
                          Certifications <br />& Licenses
                        </div>
                        <div className="flex flex-row flex-wrap mx-auto mt-5 justify-center">
                          <Atropos
                            shadow={false}
                            innerClassName="flex flex-row flex-wrap mx-auto justify-center ml-2"
                            highlight={false}
                          >
                            <img
                              src={cert1}
                              alt="meta"
                              data-atropos-offset="-6"
                              className="w-16 h-16"
                            />

                            <img
                              src={cert2}
                              alt="meta"
                              className="w-16 h-16"
                              data-atropos-offset="-5"
                            />

                            <img
                              src={cert3}
                              alt="meta"
                              className="w-16 h-16"
                              data-atropos-offset="0"
                            />

                            <img
                              src={cert4}
                              alt="meta"
                              className="w-16 h-16"
                              data-atropos-offset="5"
                            />

                            <img
                              src={cert5}
                              alt="meta"
                              className="w-16 h-16"
                              data-atropos-offset="6"
                            />
                          </Atropos>
                        </div>
                      </div>
                      {/* <div className="relative overflow-hidden max-h-[32vh]">
                          <MouseParallaxContainer
                            globalFactorX={0.1}
                            globalFactorY={0.1}
                            className="justify-start flex flex-row flex-wrap max-h-[32vh] relative h-full w-full"
                          >
                            <div
                              className=" text-[#fff] font-bold transition-all font-[Helvetica] px-3 pt-3 mx-auto text-[1.9rem] overflow-hidden mr-5"
                              style={{
                                textShadow: "0px 0px 2px #ffffff",
                              }}
                            >
                              Certifications <br />& Licenses
                            </div>
                            <MouseParallaxChild
                              factorX={0.1}
                              factorY={0.5}
                              className=""
                            >
                              <img
                                src={cert1}
                                alt="meta"
                                className="w-[100px] h-[100px]"
                              />
                            </MouseParallaxChild>

                            <MouseParallaxChild
                              factorX={0.4}
                              factorY={0.2}
                              className=" w-[100px] h-[100px] absolute right-[8rem] -bottom-4"
                            >
                              <img src={cert5} alt="cs50" />
                            </MouseParallaxChild>
                            <MouseParallaxChild
                              factorX={0.2}
                              factorY={0.2}
                              className="w-[100px] h-[100px] flex flex-row justify-start absolute right-16 bottom-12"
                            >
                              <img src={cert2} alt="aws" />
                            </MouseParallaxChild>
                            <MouseParallaxChild
                              factorX={0.2}
                              factorY={0.2}
                              className="w-[100px] h-[100px] flex flex-row justify-start absolute -right-5 bottom-12 drop-shadow-lg"
                            >
                              <img src={cert3} alt="edx" />
                            </MouseParallaxChild>
                            <MouseParallaxChild
                              factorX={0.5}
                              factorY={0.4}
                              className=" w-[100px] h-[100px] absolute right-7 -bottom-4"
                            >
                              <img src={cert4} alt="nyu" className="pb-5" />
                            </MouseParallaxChild>
                          </MouseParallaxContainer>
                        </div> */}
                    </div>
                    <div
                      className="relative flex flex-col basis-[22%] rounded-2xl cursor-pointer group overflow-hidden drop-shadow-lg"
                      style={{
                        background:
                          "linear-gradient(180deg, #5317CB 0%, #B311EE 100%)",
                      }}
                      onClick={() => {
                        setItem(
                          "projects"
                          //   data: data["explorer"]["projects"],
                        );
                      }}
                    >
                      <div
                        className=" text-[#fff] font-bold transition-all group-hover:scale-[0.9] font-[Helvetica] px-3 py-3 mx-auto text-[2rem]"
                        style={{
                          textShadow: "0px 0px 10px #ffffff",
                        }}
                      >
                        Projects
                      </div>
                      <img
                        src={projects}
                        className="absolute bottom-0 right-0 group-hover:scale-105 transition-all group-hover:animate-[ping_0.4s_reverse_1] object-contain"
                      ></img>
                    </div>
                  </div>
                  <div className="flex flex-row basis-[44%]  w-[100%] justify-evenly">
                    <div
                      className="flex flex-row basis-[44%] w-full h-full relative bg-[#B7DBEF] rounded-2xl cursor-pointer group overflow-hidden"
                      id="confetti"
                      onClick={() => {
                        setItem(
                          "achievements"
                          //   data: data["explorer"]["projects"],
                        );
                      }}
                    >
                      <div
                        className=" text-[#000] font-bold transition-all group-hover:scale-[0.9] font-[Helvetica] px-3 py-3 mx-auto text-[2.2rem] z-10"
                        style={{
                          textShadow: "0px 0px 10px #ffffff",
                        }}
                      >
                        Achievements
                      </div>
                      <div className="group-hover:block hidden transition-all">
                        <Confetti
                          width={dimensions.x}
                          height={dimensions.y}
                          numberOfPieces={100}
                          opacity={0.5}
                        />
                      </div>
                      <img
                        src={achievements}
                        className="w-full h-full absolute z-0"
                      />
                    </div>
                    <div
                      className="flex group flex-row basis-[25%] backdrop-blur-md rounded-3xl relative cursor-pointer overflow-hidden
                        
                        "
                      ref={lottieRef}
                      style={{
                        // borderRadius: "0px 0px 0px 50px",
                        backgroundClip: "padding-box",
                        // backgroundImage: `url(${socialbg})`,

                        background:
                          "linear-gradient(124.44deg, #292929 -5.6%, rgba(63, 63, 63, 0) 105.08%), radial-gradient(50% 50% at 100% 100%, #ffffff40 0%, #ffffff05 100%), radial-gradient(50% 50% at 0% 100%, #ffffff40 0%, #ffffff05 100%)",
                        // "linear-gradient(124.44deg, #292929 -5.6%, rgba(63, 63, 63, 0) 105.08%), radial-gradient(100% 100% at 100% 100%, #ffffff40 0%, #ffffff05 100%), linear-gradient(180deg, #5317CB 0%, #B311EE 100%)",

                        filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
                      }}
                      onMouseEnter={() => {
                        lottie.setDirection(1);
                        lottie.play();
                      }}
                      onMouseLeave={() => {
                        lottie.setDirection(-1);
                        lottie.play();
                        lottie.stop();
                      }}
                      onClick={() => {
                        setItem(
                          "social"
                          //   data: data["explorer"]["projects"],
                        );
                      }}
                    >
                      {/* <img
                          src={phone}
                          className="mx-auto z-10 -mb-[12rem] max-w-[60%] group-hover:-mb-[10rem] group-hover:scale-[1.05] transition-all"
                        />
                        <div className="border-2 w-[50%] group-hover:animate-[spin_2s_infinite] h-[50%] absolute bottom-0 right-0 rounded-full border-white z-0"></div>
                        <div className="border-2 w-[50%] group-hover:animate-spin h-[50%] absolute rounded-full border-white z-0 -top-8 -left-8 "></div>
                        <div className="border-2 w-[50%] group-hover:animate-[spin_3s_infinite_reverse] h-[50%] absolute right-16 bottom-16 rounded-full border-white z-0"></div>
                         */}

                      {/* <lottie
                          options={defaultOptions}
                          height={200}
                          width={200}
                          ref={lottieRef} */}
                      {/* /> */}
                    </div>
                    <div
                      className="flex cursor-pointer flex-row basis-[25%] bg-[#CCEBFF] overflow-hidden rounded-2xl relative"
                      onClick={() => {
                        setItem(
                          "contact"
                          //   data: data["explorer"]["projects"],
                        );
                      }}
                    >
                      <Atropos
                        shadow={false}
                        // highlight={false}
                        innerClassName="relative z-10 w-full h-full"
                        className="w-full"
                      >
                        <img
                          src={contact}
                          data-atropos-offset="5"
                          className="  object-contain -mt-4 drop-shadow-2xl"
                        />
                        <div
                          className="w-[6rem] h-[6rem] rounded-full bg-[#e9bc7c] absolute -bottom-[15%] -left-[15%] z-0"
                          data-atropos-offset="-10"
                        ></div>
                        <div
                          className="w-[6rem] h-[6rem] rounded-full bg-[#d91353] absolute -top-[20%] -right-[20%] z-0"
                          data-atropos-offset="-10"
                        ></div>
                      </Atropos>
                      <div
                        className="text-[#d91353] z-20 absolute bottom-0 left-6 font-bold transition-all group-hover:scale-[0.9] font-[Helvetica] px-3 py-3 mx-auto text-[2rem]"
                        style={{
                          textShadow: "0px 0px 10px #ffffff",
                        }}
                        data-atropos-offset="0"
                      >
                        Contact
                      </div>
                      {/* <div className="w-[6rem] h-[6rem] rounded-full bg-[#e9bc7c] absolute -bottom-[15%] -left-[15%] z-0"></div>
                        <div className="w-[6rem] h-[6rem] rounded-full bg-[#d91353] absolute -top-[20%] -right-[20%] z-0"></div> */}
                    </div>

                    {/* <div
                        className="group flex flex-row basis-[25%] max-h-[29vh] bg-fuchsia-300 overflow-hidden"
                        ref={ref}
                      >
                        <div className=" opacity-0 group-hover:opacity-100 overflow-hidden transition-all duration-700">
                          <Triangle width={300} height={300}></Triangle>
                        </div>
                      </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* </Flip> */}
        </div>
      )}
    </>
  );
};

export default ExpandedExplorer;
