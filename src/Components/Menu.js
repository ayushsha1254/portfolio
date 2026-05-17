import useContextMenu from "./useContextMenu";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme, toggleLock } from "../Utility/state/action";
import NavBtn from "./NavBtn";
import { BsMoonFill, BsSun } from "react-icons/bs";
import React, { useEffect } from "react";

const Menu = ({ theme, setTheme }) => {
  const { anchorPoint, show } = useContextMenu();
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [invert, setInvert] = React.useState(
    localStorage.getItem("color-theme") == "dark"
  );
  if (show) {
    return (
      <ul
        className="menu
      absolute bg-[#ffffff50] backdrop-blur-lg p-5 gap-y-4 rounded-xl z-[2000] w-[300px] transition-all
      "
        style={{ top: anchorPoint.y, left: anchorPoint.x }}
      >
        <div className="flex flex-row">
          <div
            onClick={(e) => {
              if (!invert) {
                setInvert((invert) => !invert);
                localStorage.setItem("color-theme", invert ? "light" : "dark");
                setTheme((theme) => !theme);
                dispatch(toggleTheme(!theme));
              }

              // e.target.classList.toggle("invert");
              // checkInvert();
            }}
            className="transition-all duration-50 cursor-pointer flex-row px-2 w-[49%] mt-2 place-items-center"
          >
            {/* <NavBtn icon={BsMoonFill} text="Dark Mode" /> */}
            <NavBtn
              icon={<BsMoonFill />}
              text="Dark Mode"
              select={invert === true}
            />
            {/* <CgDarkMode />
            Mode */}
          </div>
          <div
            onClick={(e) => {
              if (invert) {
                setInvert((invert) => !invert);
                localStorage.setItem("color-theme", invert ? "light" : "dark");
                setTheme((theme) => !theme);
                dispatch(toggleTheme(!theme));
              }

              // e.target.classList.toggle("invert");
              // checkInvert();
            }}
            className="transition-all duration-50 cursor-pointer flex-row px-2 w-[49%] mt-2 place-items-center"
          >
            {/* <NavBtn icon={BsMoonFill} text="Dark Mode" /> */}
            <NavBtn
              icon={<BsSun />}
              text="Light Mode"
              select={invert !== true}
            />
            {/* <CgDarkMode />
            Mode */}
          </div>
        </div>
        <div className="text-white mt-5 text-justify">
          Welcome To The Portfolio Website by Ayush Sharma! We hope you're
          enjoying the experience. Feel free to reach out to us and say Hello!
        </div>
      </ul>
    );
  }
  return <></>;
};

export default Menu;
