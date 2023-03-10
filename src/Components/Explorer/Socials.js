import React from "react";
import { useEffect, useState } from "react";
import data from "../../Data/main.json";
const Socials = () => {
  const [socials, setSocials] = useState(data.explorer.social);
  useEffect(() => {
    setSocials(data.explorer.social);
  }, [data]);
  //   console.log(data, data.explorer.socials);
  console.log(socials);
  return (
    <div className="flex flex-row gap-x-5 flex-wrap transition-all gap-y-5">
      {/* <div>Socials</div> */}
      {socials
        ? Object.keys(socials).map((key) => {
            const pic = require("../../Assets/Socials/" + key + ".svg");
            return (
              <a
                href={socials[key]}
                target={"blank"}
                className="w-[100px] flex flex-col justify-center place-items-center cursor-pointer"
              >
                <img src={pic} className="w-[90px]"></img>
                <div className="capitalize text-sm">{key}.exe</div>
              </a>
            );
          })
        : null}
    </div>
  );
};

export default Socials;
