import React from "react";
import hand from "../../Assets/Images/hand.svg";
import hat from "../../Assets/Images/hat.svg";
import hs from "../../Assets/Images/hs.svg";
import education from "../../Assets/Images/education.svg";
import handshake from "../../Assets/Images/handshake.svg";
const About = ({ data }) => {
  return (
    <div className="flex flex-col h-[100%] gap-y-4 overflow-y-scroll min-h-[300px]">
      <div className="w-[99%] mx-auto bg-[#ffffff20] rounded-xl min-h-[200px] h-[46%] p-4">
        <div className="flex flex-row gap-x-5 text-xl">
          <img src={hand} />
          Introduction
        </div>
        <div className="flex flex-row mt-3 gap-x-5 place-items-center">
          <div className="basis-[24%]">
            <img src={data.image} className="object-contain w-full" />
          </div>
          <div className="basis-[75%] text-justify text-md pb-2">
            {data.description}
          </div>
        </div>
      </div>
      <div className="w-[100%] mx-auto min-h-[200px] rounded-xl flex flex-row gap-x-3 ml-1">
        <div className="w-[62%] h-full bg-[#ffffff20] rounded-xl flex flex-col p-4">
          <div className="flex flex-row gap-x-5 text-xl mb-3">
            <img src={hat} />
            Education
          </div>
          <div className="flex flex-col gap-y-4 overflow-y-scroll">
            {data.education.map((item) => {
              return (
                <div className="flex flex-col">
                  <div className="font-bold text-lg">{item.degree}</div>
                  <div className="">{item.name}</div>
                  <div className="">{item.year}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className=" w-[37%] bg-[#ffffff20] rounded-xl flex flex-col p-4">
          <div className="flex flex-row gap-x-5 text-xl mb-3">
            <img src={hs} />
            About the project
          </div>
          <div className="overflow-y-scroll">{data.about}</div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default About;
