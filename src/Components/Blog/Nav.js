import React from "react";
import Datetime from "../../Components/datetime";
import { AiFillControl, AiOutlineDown } from "react-icons/ai";
import data from "../../Data/main.json";
import { CgDarkMode } from "react-icons/cg";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { Zoom } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme, toggleLock } from "../../Utility/state/action";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NavBtn from "../NavBtn";
import { BsMoonFill, BsSun } from "react-icons/bs";
import { FiHelpCircle } from "react-icons/fi";
import { CiLock } from "react-icons/ci";
// import Dropdown from "react-dropdown";
// import "react-dropdown/style.css";
import MusicNavbar from "../Music/MusicNavbar";
import "rc-dropdown/assets/index.css";
import Dropdown from "rc-dropdown";
import { IoNotificationsOutline } from "react-icons/io5";
import Menu, { Item as MenuItem } from "rc-menu";
import { useEffect } from "react";
import { IoMdMusicalNote } from "react-icons/io";
const Nav = ({ single, setMsg }) => {
  const navigate = useNavigate();
  return (
    <div className="transition-all flex flex-row justify-between py-2 z-[10] px-14 w-full mx-auto">
      {/* <Link to="/">
        <div className="font-[Monoton] text-3xl text-white z-[100] ">
          {data.logo}
        </div>
      </Link> */}
      {single ? (
        <div
          className="dark:bg-btn-darkNormal bg-btn-lightNormal hover:bg-btn-lightHover backdrop-blur-md px-3 py-2 my-auto  place-items-center align-middle flex flex-row justify-center rounded-xl text-white cursor-pointer dark:hover:bg-btn-darkHover transition mr-4"
          onClick={() => {
            navigate("/blog");
          }}
        >
          Back to Blog
        </div>
      ) : null}
      <div className="mx-auto">
        <Datetime setMsg={setMsg} />
      </div>

      <div
        className="dark:bg-btn-darkNormal bg-btn-lightNormal hover:bg-btn-lightHover backdrop-blur-md px-3 py-2 my-auto   place-items-center align-middle flex flex-row justify-center rounded-xl text-white cursor-pointer dark:hover:bg-btn-darkHover transition"
        onClick={() => {
          navigate("/");
        }}
      >
        Back to Home
      </div>
    </div>
  );
};

export default Nav;
