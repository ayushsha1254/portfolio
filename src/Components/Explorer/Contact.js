import React from "react";
import { ParallaxHover } from "react-parallax-hover";
import image from "../../Assets/Images/apple.jpg";
import cubes from "../../Assets/Theme/cubes.svg";
import guitboard from "../../Assets/Theme/guitboard.svg";
import noise from "../../Assets/Theme/noise.svg";
import qr from "../../Assets/Theme/qr.svg";
const Contact = () => {
  return (
    <div className="">
      <ParallaxHover
        borderRadius={15}
        height={300}
        rotation={3}
        scale={1.2}
        shadow={3}
        shine={1}
        width={500}
      >
        <div className="w-full h-full">
          <div
            className="w-full h-full bg-[#2a2a2a] relative flex flex-row place-items-center"
            style={{
              backgroundImage: `url(${cubes})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="h-full w-4 bg-[#F67700] absolute left-0 top-0"></div>
            <img src={guitboard} className="z-20 max-h-full absolute right-0" />
            <img
              src={qr}
              className="w-[90px] absolute right-40 z-20 top-8 mix-blend-difference"
            ></img>
            <div
              className="font-[Helvetica] z-10 rounded-[15px] backdrop-blur-sm bg-[#ffffff20] w-[350px] h-[280px] ml-8 my-auto flex flex-col p-4"
              style={{
                background: `url(${noise})`,
              }}
            >
              <div className="flex flex-row ">
                <div className="font-[Helvetica] text-4xl basis-2/3">
                  Rishit Shivesh
                </div>
                <div className=""></div>
              </div>
              <div className="mt-2">rishitshivesh@gmail.com</div>
              <div className="mt-2">+91 96675 16345</div>
              <div className="mt-4 text-[0.8rem] italic w-[85%]">
                “When the son of the deposed king of Nigeria emails you
                directly, asking for help, you help! His father ran the freaking
                country! Okay?”
              </div>
              <div className="text-right mt-2 text-sm mr-16 italic">
                ~ Michael Scott
              </div>
            </div>
          </div>
        </div>
      </ParallaxHover>
    </div>
  );
};

export default Contact;
