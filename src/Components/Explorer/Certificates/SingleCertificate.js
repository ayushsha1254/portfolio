import React from "react";
import { useEffect } from "react";
import cubes from "../../../Assets/Theme/cubes.svg";
import Display from "./Display";
const SingleCertificate = ({ data, setCert, setCertData }) => {
  const [display, setDisplay] = React.useState((e) => {
    if (data["name"].length > 25) return data["name"].substring(0, 25) + "...";
    else return data["name"];
  });
  const [show, setShow] = React.useState(false);
  // useEffect(() => {
  //   if (show) document.querySelector("#explorer").style.opacity = "0";
  //   else document.querySelector("#explorer").style.opacity = "1";
  // }, [show]);
  console.log(show);
  return (
    <div className="">
      {/* <div className={show ? `block` : "hidden"}>
        <Display data={data} setShow={setShow} />
      </div> */}
      <div
        className="bg-[#424242] relative h-[230px] w-[300px] rounded-xl flex flex-col overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all"
        style={{
          backgroundImage: `url(${cubes})`,
          backgroundSize: "contain",
        }}
        onClick={() => {
          setShow(true);
          setCert(true);
          setCertData(data);
        }}
      >
        <img src={data.image} className="p-4 z-0"></img>
        <div className="absolute z-10 bg-[#1e1e1e] w-full h-[110px] bottom-0 px-4 py-2 font-[Helvetica] flex flex-row justify-between">
          <div className="flex flex-col basis-2/3 text-lg">
            {display}
            <div className="bg-[#3e3e3e] text-[0.65rem] px-4 rounded-[500px] w-max mt-2">
              {data.date}
            </div>
          </div>
          <div className="basis-1/3 flex flex-row justify-center max-w-[50px] max-h-[50px]">
            <img
              src={data.issuer.image}
              className=" object-contain bg-white rounded-xl drop-shadow-lg shadow-inner"
            ></img>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCertificate;
