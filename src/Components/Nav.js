import React from "react";
import Datetime from "../Components/datetime";
import { AiFillControl, AiOutlineDown } from "react-icons/ai";
import data from "../Data/main.json";
import { CgDarkMode } from "react-icons/cg";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { Zoom } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme, toggleLock } from "../Utility/state/action";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { BsLightningChargeFill } from "react-icons/bs";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NavBtn from "./NavBtn";
import { BsMoonFill, BsSun } from "react-icons/bs";
import { FiHelpCircle } from "react-icons/fi";
import { CiLock } from "react-icons/ci";
// import Dropdown from "react-dropdown";
// import "react-dropdown/style.css";
import MusicNavbar from "./Music/MusicNavbar";
import "rc-dropdown/assets/index.css";
import Dropdown from "rc-dropdown";
import { IoNotificationsOutline } from "react-icons/io5";
import Menu, { Item as MenuItem } from "rc-menu";
import { useEffect } from "react";
import { IoMdMusicalNote } from "react-icons/io";
import { BsFillLightningChargeFill } from "react-icons/bs";
import charge from "../Assets/Icons/charge.svg";
const Nav = ({
  theme,
  setTheme,
  lock,
  setLock,
  help,
  setHelp,
  playing,
  nowPlaying,
  musicStop,
  notifications,
}) => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  // const [notTime, setNotTime] = React.useState(new Date().toLocaleTimeString());
  const notTime = new Date().toLocaleTimeString();
  const navigate = useNavigate();
  const [invert, setInvert] = React.useState(
    localStorage.getItem("color-theme") == "dark"
  );
  const [notificationMessage, setNotificationMessage] = React.useState();
  // console.log()
  const [battery, setBattery] = React.useState();
  console.log(notifications);
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    if (notifications)
      setNotificationMessage(
        notifications[Math.floor(Math.random() * notifications.length)]
      );
  }, [open]);
  // var notificationMessage =
  //   data["notifications"][
  //     Math.floor(Math.random() * data["notifications"].length)
  //   ];
  const ControlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      marginRight: theme.spacing(2),
      backgroundColor: "transparent",
    },
  }));
  console.log(invert);
  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };
  const [msg, setMsg] = React.useState();
  function checkInvert() {
    var doubleClickEvent = document.createEvent("MouseEvents");
    doubleClickEvent.initEvent("dblclick", true, true);
    const el = document.getElementById("inv");
    el.dispatchEvent(doubleClickEvent);
    // setOpen(true);
  }
  // console.log(battery);

  useEffect(() => {
    if (lock) {
      navigate("/");
    }
  }, [lock]);
  const menu = (
    <Menu
      style={{
        width: 270,
        height: 550,
        background: "transparent",
        border: "none",
        boxShadow: "none",
        overflow: "hidden",
      }}
      onOverlayClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(true);
      }}
    >
      <div className=" transition-all w-[270px] bg-[#0f0f0f50] dark:bg-[#99989850] duration-500 backdrop-blur-md rounded-md h-max text-white p-4 text-lg flex flex-col">
        <div className="flex flex-row justify-between" style={{}}>
          <div
            style={{
              fontSize: "0.9rem",
            }}
          >
            {msg}
          </div>
          <div
            className="flex flex-row place-items-center gap-x-0"
            style={{
              opacity: 0.5,
            }}
          >
            {/* <div className="w-[20px] h-[10px] border-2 border-white rounded flex flex-row justify-start place-items-center relative">
              
              <div
                className=" h-full bg-white"
                style={{
                  width: battery
                    ? parseFloat(battery?.level) * 100 + "%"
                    : null,
                }}
              ></div>
              
            </div> */}
            {battery && (
              <div className="flex flex-row gap-x-2">
                <div className="h-[15px] w-[10px] rounded-[2px] border-[1px] border-white my-auto flex flex-col justify-end relative">
                  <div
                    className="bg-white my-[1px] rounded-[1px] mx-[1px]"
                    style={{
                      height: `${battery.level * 13}px`,
                    }}
                  ></div>
                  <div
                    className={`text-[9px] absolute top-[3px] left-0 invert ${
                      battery.charging ? "block" : "hidden"
                    }`}
                  >
                    <BsLightningChargeFill />
                  </div>
                </div>
                <div style={{ fontSize: "0.8rem" }}>
                  {battery.level * 100} %
                </div>
              </div>
            )}
            {/* <div
              className="mx-2 text-sm"
              style={{
                fontSize: "0.5rem!important",
              }}
            >
              {battery?.level
                ? parseInt(parseFloat(battery?.level) * 100)
                : null}{" "}
              %
            </div> */}
          </div>
        </div>
        <div className="flex flex-row flex-wrap gap-x-1 justify-between">
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
          <div
            onClick={(e) => {
              setHelp(true);
            }}
            // onClick={(e) => {
            //   if (!invert) {
            //     setInvert((invert) => !invert);
            //     localStorage.setItem("color-theme", invert ? "light" : "dark");
            //     setTheme((theme) => !theme);
            //     dispatch(toggleTheme(!theme));
            //   }

            //   // e.target.classList.toggle("invert");
            //   // checkInvert();
            // }}
            className="transition-all duration-50 cursor-pointer flex-row px-2 w-[49%] mt-2 place-items-center"
          >
            {/* <NavBtn icon={BsMoonFill} text="Dark Mode" /> */}
            <NavBtn icon={<FiHelpCircle />} text="Need Help?" select={false} />
            {/* <CgDarkMode />
            Mode */}
          </div>
          <div
            // onClick={(e) => {
            //   if (!invert) {
            //     setInvert((invert) => !invert);
            //     localStorage.setItem("color-theme", invert ? "light" : "dark");
            //     setTheme((theme) => !theme);
            //     dispatch(toggleTheme(!theme));
            //   }

            //   // e.target.classList.toggle("invert");
            //   // checkInvert();
            // }}
            onClick={(e) => {
              localStorage.removeItem("lastlogin");
              dispatch(toggleLock(true));
              setLock(true);
            }}
            className="transition-all duration-50 cursor-pointer flex-row px-2 w-[49%] mt-2 place-items-center"
          >
            {/* <NavBtn icon={BsMoonFill} text="Dark Mode" /> */}
            <NavBtn icon={<CiLock />} text="Lock" select={false} />
            {/* <CgDarkMode />
            Mode */}
          </div>
          {/* <div
            onClick={(e) => {
              setInvert((invert) => !invert);
              localStorage.setItem("color-theme", invert ? "light" : "dark");
              setTheme((theme) => !theme);
              dispatch(toggleTheme(!theme));
              // e.target.classList.toggle("invert");
              // checkInvert();
            }}
            className="transition duration-500 bg-white text-black flex text-md gap-x-3 cursor-pointer flex-row px-2 w-[45%] rounded-lg py-1 mt-2 place-items-center"
            style={{
              filter: invert ? "invert(1)" : "invert(0)",
            }}
          >
            <CgDarkMode />
            Mode
          </div> */}
        </div>
        {!musicStop ? (
          <div className="flex flex-col gap-y-2 h-max">
            <div className="flex flex-row justify-start gap-x-4 place-items-center mt-3 text-white">
              <IoMdMusicalNote />
              Music
            </div>
            <MusicNavbar playing={playing} nowPlaying={nowPlaying} />
          </div>
        ) : (
          <div className="flex flex-col gap-y-2 h-max">
            <div className="flex flex-row justify-start gap-x-4 place-items-center mt-3 text-white">
              <IoNotificationsOutline />
              Notifications
            </div>
            <div
              className="w-full h-max rounded-xl p-2"
              style={{
                background: "rgba(255, 255, 255, 0.3)",
              }}
            >
              <div className="text-[0.9rem] text-[#ffffff80] flex flex-row place-items-center gap-x-2">
                {[
                  [notTime.split(":")[0], notTime.split(":")[1]].join(":"),
                  notTime.split(" ")[1],
                ].join(" ")}{" "}
                <AiOutlineDown />
              </div>
              <div className="text-sm flex flex-row gap-x-1">
                <div className="w-16 h-16 rounded-full basis-[15%]">
                  <img
                    className="w-full rounded-full  object-cover aspect-square "
                    src={notificationMessage?.img}
                  ></img>
                </div>
                <div className="flex-col flex overflow-hidden basis-[80%]">
                  <b>{notificationMessage?.person}</b>
                  {notificationMessage?.msg}
                </div>
                {/* <div className="flex flex-col">
                <div className="flex flex-row">
                  <img
                    className="w-10 rounded-full  object-cover aspect-square "
                    src={notificationMessage.img}
                  ></img>
                  <b>{notificationMessage.person}</b>
                </div>
                <div>{notificationMessage.msg}</div>
              </div> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </Menu>
  );
  return (
    <div className="transition-all w-screen flex flex-row justify-between px-4 py-2 z-[10]">
      <Link to="/">
        <div className="font-[Monoton] text-3xl text-white z-[100] ">
          {data.logo}
        </div>
      </Link>
      <Datetime setMsg={setMsg} setBattery={setBattery} />

      <Dropdown
        id="control"
        trigger={["click"]}
        overlay={menu}
        animation="slide-up"
        onOverlayClick={(e) => {
          e.preventDefault();
        }}
        // alignPoint
      >
        <div
          onClick={handleTooltipOpen}
          className="dark:bg-btn-darkNormal bg-btn-lightNormal hover:bg-btn-lightHover backdrop-blur-md px-3 py-2 my-auto   place-items-center align-middle flex flex-row justify-center rounded-xl text-white cursor-pointer dark:hover:bg-btn-darkHover transition"
        >
          <span className="text-2xl mr-2">
            <AiFillControl />
          </span>
          Control
        </div>
      </Dropdown>
    </div>
  );
};

export default Nav;
