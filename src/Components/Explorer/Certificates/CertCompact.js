import React from "react";
import { useEffect } from "react";
import cubes from "../../../Assets/Theme/cubes.svg";
import Display from "./Display";
const CertCompact = ({ data, setCert, setCertData, idx }) => {
  const [display, setDisplay] = React.useState((e) => {
    if (data["name"].length > 35) return data["name"].substring(0, 35) + "...";
    else return data["name"];
  });
  const [show, setShow] = React.useState(false);
  console.log(show);
  return (
    <div className="">
      {/* <div className={show ? `block` : "hidden"}>
        <Display data={data} setShow={setShow} />
      </div> */}
      <div
        className="bg-[#424242] hover:bg-[#42424290] relative min-w-[100%] rounded-xl flex flex-row overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all px-5 py-3"
        style={
          {
            //   backgroundImage: `url(${cubes})`,
            //   backgroundSize: "contain",
          }
        }
        onClick={() => {
          setShow(true);
          setCert(true);
          setCertData(data);
        }}
      >
        {idx + 1}. {display} | {data["issuer"].name} | {data["date"]}
      </div>
    </div>
  );
};

export default CertCompact;
