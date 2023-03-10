import React from "react";
import mail from "../Assets/Icons/mail.png";
import whatsapp from "../Assets/Icons/whatsapp.png";
import github from "../Assets/Icons/github.png";
import linkedin from "../Assets/Icons/linkedin.png";
import doc from "../Assets/Icons/resume.svg";
import finderstyles from "./finder.module.css";
import phone from "../Assets/Icons/phone.png";
import finder from "../Assets/Icons/finder.svg";
import explorer from "../Assets/Icons/exp.svg";
import styles from "./desk.module.css";
import { Tooltip } from "@mui/material";
import { useDispatch } from "react-redux";
import terminal from "../Assets/Icons/terminal.svg";
import Zoom from "@mui/material/Zoom";
import { useEffect } from "react";
import Finder from "./Finder";
import music from "../Assets/Icons/music.svg";
// import photos from "../Assets/Icons/photos.png";
import { useNavigate } from "react-router-dom";
import MusicTaskbar from "./MusicTaskbar";
import blog from "../Assets/Icons/blog.svg";
import "./animate.css";
import {
  toggleExplorer,
  toggleFinder,
  toggleTerminal,
} from "../Utility/state/action";
import { useSelector } from "react-redux";
const items = [
  // {
  //   name: "Mail",
  //   icon: mail,
  // },
  // {
  //   name: "Phone",
  //   icon: phone,
  // },
  // {
  //   name: "Whatsapp",
  //   icon: whatsapp,
  // },
  // {
  //   name: "Github",
  //   icon: github,
  // },
  // {
  //   name: "Linkedin",
  //   icon: linkedin,
  // },
  // {
  //   name: "Resume",
  //   icon: doc,
  // },
  // {
  //   name: "Gallery",
  //   icon: photos,
  // },
];

// document.onkeydown = function (e) {
//   if (
//     (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) ||
//     e.key === "Meta" ||
//     e.key === "Shift" ||
//     e.key === "Control" ||
//     e.key === "alt"
//   ) {
//     return;
//   }
//   if (e.altKey + e.key === "trues") {
//     e.preventDefault();
//     console.log(finder ? "Open" : "Close");
//     document.getElementById("finderIcon").click();
//   }
//   console.log(e.altKey + e.key);
// };
const Taskbar = ({ theme, nowPlaying, playing, setPlayStatus, musicStop }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const navigate = useNavigate();
  return (
    <div className="w-[90vw] bg-transparent  mx-auto flex flex-row justify-center rounded-xl overflow-visible">
      <div
        className="w-[90%] px-5 backdrop-blur-md rounded-xl flex flex-row justify-center gap-x-6 py-1 mb-1"
        style={{
          backgroundColor: theme ? "#0d0d0d20" : "#ffffff20",
        }}
      >
        {/* {items.map((item, idx) => {
          return (
            <Tooltip
              title={item.name}
              disableFocusListener
              key={idx}
              arrow
              TransitionComponent={Zoom}
              className=""
            >
              <img
                src={item.icon}
                className={
                  `h-[10vh] hover:scale-[1.1] hover:-translate-y-3 transition cursor-pointer hover:drop-shadow-lg ` +
                  styles.taskitems
                }
                style={{
                  animationDelay: `${idx * 0.01}s`,
                }}
              ></img>
            </Tooltip>
          );
        })} */}
        <Tooltip
          title={"Explorer"}
          disableFocusListener
          arrow
          TransitionComponent={Zoom}
          className=""
        >
          <img
            onClick={() => {
              if (state.finder) {
                dispatch(toggleFinder(false));
              }
              if (state.explorer) {
                const el = document.getElementById("explorer-exanded-main");
                el.classList.remove("slide-in-bottom");
                el.classList.add("slide-out-bck-bottom");
                setTimeout(() => {
                  dispatch(toggleExplorer(false));
                }, 500);
              } else {
                dispatch(toggleExplorer(true));
              }
            }}
            src={explorer}
            id="explorerIcon"
            className={
              `h-[10vh] hover:scale-[1.1] hover:-translate-y-3 transition cursor-pointer hover:drop-shadow-lg ` +
              styles.taskitems
            }
            style={{
              animationDelay: `${6 * 0.01}s`,
            }}
          ></img>
        </Tooltip>
        <div
          className="h-full w-[2px] "
          style={{
            backgroundColor: !theme ? "#0d0d0d20" : "#ffffff20",
          }}
        ></div>
        <Tooltip
          title={"Blog"}
          disableFocusListener
          arrow
          TransitionComponent={Zoom}
          className=""
        >
          <img
            onClick={() => {
              navigate("/blog");
            }}
            src={blog}
            className={
              `h-[10vh] hover:scale-[1.1] hover:-translate-y-3 transition cursor-pointer hover:drop-shadow-lg ` +
              styles.taskitems
            }
            style={{
              animationDelay: `${6 * 0.01}s`,
            }}
          ></img>
        </Tooltip>
        <Tooltip
          title={"Resume"}
          disableFocusListener
          arrow
          TransitionComponent={Zoom}
          className=""
        >
          <img
            onClick={() => {
              navigate("/resume");
            }}
            src={doc}
            className={
              `h-[10vh] hover:scale-[1.1] hover:-translate-y-3 transition cursor-pointer hover:drop-shadow-lg ` +
              styles.taskitems
            }
            style={{
              animationDelay: `${6 * 0.01}s`,
            }}
          ></img>
        </Tooltip>
        <div
          className="transition-all"
          style={{
            display: !musicStop ? "block" : "none",
            width: !musicStop ? "max" : "0px",
            height: "10vh",
          }}
        >
          <MusicTaskbar
            playing={playing}
            nowPlaying={nowPlaying}
            setPlayStatus={setPlayStatus}
            musicStop={musicStop}
          />
        </div>
        <div
          style={{
            display: !musicStop ? "none" : "block",
          }}
        >
          <Tooltip
            title={"Music"}
            disableFocusListener
            arrow
            TransitionComponent={Zoom}
            className=""
          >
            <img
              onClick={() => {
                navigate("/music");
              }}
              src={music}
              id="musicIcon"
              className={
                `h-[10vh] hover:scale-[1.1] hover:-translate-y-3 transition cursor-pointer hover:drop-shadow-lg ` +
                styles.taskitems
              }
              style={{
                animationDelay: `${6 * 0.01}s`,
              }}
            ></img>
          </Tooltip>
        </div>
        <Tooltip
          title={"Terminal"}
          disableFocusListener
          arrow
          TransitionComponent={Zoom}
          className=""
        >
          <img
            onClick={() => {
              dispatch(toggleTerminal());
              if (state.finder) {
                dispatch(toggleFinder(false));
              }
              if (state.explorer) {
                dispatch(toggleExplorer(false));
              }
            }}
            src={terminal}
            id="terminalIcon"
            className={
              `h-[10vh] hover:scale-[1.1] hover:-translate-y-3 transition cursor-pointer hover:drop-shadow-lg ` +
              styles.taskitems
            }
            style={{
              animationDelay: `${6 * 0.01}s`,
            }}
          ></img>
        </Tooltip>

        <Tooltip
          title={"Finder"}
          disableFocusListener
          arrow
          TransitionComponent={Zoom}
          className=""
        >
          <img
            onClick={() => {
              if (state.finder) {
                const doc = document.querySelector("#finder");
                doc.classList.remove(finderstyles.modal);
                doc.classList.add(finderstyles.modalClose);
                // console.log(e.target.parentElement.classList);
                setTimeout(() => {
                  // setShow(false);
                  dispatch(toggleFinder(!state.finder));
                  doc.classList.add(finderstyles.modal);
                  doc.classList.remove(finderstyles.modalClose);
                }, 400);
              } else {
                dispatch(toggleFinder(!state.finder));
                if (state.explorer) {
                  dispatch(toggleExplorer(false));
                }
              }
            }}
            src={finder}
            id="finderIcon"
            className={
              `h-[10vh] hover:scale-[1.1] hover:-translate-y-3 transition cursor-pointer hover:drop-shadow-lg ` +
              styles.taskitems
            }
            style={{
              animationDelay: `${6 * 0.02}s`,
            }}
          ></img>
        </Tooltip>
        {/* <img
          src={mail}
          className="h-[10vh] hover:scale-[1.1] hover:-translate-y-3 transition cursor-pointer hover:drop-shadow-lg"
        ></img>
        <img
          src={phone}
          className="h-[10vh] hover:scale-[1.1] hover:-translate-y-3 transition cursor-pointer  hover:drop-shadow-lg"
        ></img>
        <img
          src={whatsapp}
          className="h-[10vh] hover:scale-[1.1] hover:-translate-y-3 transition cursor-pointer hover:drop-shadow-lg"
        ></img>
        <img
          src={github}
          className="h-[10vh] hover:scale-[1.1] hover:-translate-y-3 transition cursor-pointer hover:drop-shadow-lg"
        ></img>
        <img
          src={linkedin}
          className="h-[10vh] hover:scale-[1.1] hover:-translate-y-3 transition cursor-pointer hover:drop-shadow-lg"
        ></img>
        <img
          src={doc}
          className="h-[10vh] hover:scale-[1.1] hover:-translate-y-3 transition cursor-pointer hover:drop-shadow-lg"
        ></img> */}
      </div>
    </div>
  );
};

export default Taskbar;
