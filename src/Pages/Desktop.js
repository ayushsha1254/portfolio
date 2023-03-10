import React, { Suspense, useEffect } from "react";
import Taskbar from "../Components/Taskbar";
import wallpaper from "../Assets/Images/apple.jpg";
import Draggable from "react-draggable";
import mail from "../Assets/Icons/mail.png";
import earth from "../Assets/Icons/earth.png";
import terminal from "../Assets/Icons/terminal.png";

import Menu from "../Components/Menu";
import Modal from "../Components/DeskModal";
import styles from "../Components/desk.module.css";
import Nav from "../Components/Nav";
import Lock from "./Lock";
import { Link, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Finder from "../Components/Finder";
import Matrix from "../Components/Matrix";

const Desktop = ({ theme, setTheme, lock, setLock, finder, setFinder }) => {
  const navigate = useNavigate();
  const [show, setShow] = React.useState(false);
  const time = localStorage.getItem("lastlogin");
  useEffect(() => {
    if (time) {
      const calc = new Date().getTime() - time;
      if (calc > 1000000) {
        setLock(true);
      } else {
        // localStorage.setItem("lastlogin", new Date().getTime());
        setLock(false);
      }
    } else {
      // localStorage.setItem("lastlogin", new Date().getTime());
      setLock(true);
    }
  }, [time]);
  // console.log(lock);
  console.log(finder);
  const [showMatrix, setShowMatrix] = React.useState(false);
  return (
    <>
      {lock ? (
        <Suspense
          fallback={
            <div className="w-full h-full flex flex-row justify-center place-items-center">
              {" "}
              <CircularProgress />
            </div>
          }
        >
          <div
            className="z-[100] absolute top-0"
            style={{
              backgroundImage: `url(${wallpaper})`,

              backgroundSize: "cover",
            }}
          >
            <Lock lock={lock} setLock={setLock} />
          </div>
        </Suspense>
      ) : null}

      <div
        className="w-[100vw] h-[100vh] bg-black relative z-40 transition-all overflow-hidden"
        style={{
          backgroundImage: `url(${wallpaper})`,
          backgroundSize: "cover",
          // backgroundColor: "hsla(180,0%,50%,0.25)",
          // opacity: theme ? 0.9 : 1,
          filter: theme ? "brightness(0.9)" : "brightness(1)",
        }}
      >
        {showMatrix ? (
          <div className={styles.matrix}>
            <Matrix />
          </div>
        ) : null}

        <Nav theme={theme} setTheme={setTheme} lock={lock} setLock={setLock} />

        <Menu setLock={setLock} />
        <div className="z-[120]">
          <Modal show={show} setShow={setShow} />
        </div>
        {/* <CircularProgress /> */}

        <div className="z-0">
          {!show ? (
            <div className="w-[90vw] h-[80vh] pt-10 relative">
              <Draggable bounds="parent">
                <img
                  src={mail}
                  className="w-[5vw] z-20"
                  onDoubleClick={() => {
                    setShow(!show);
                  }}
                ></img>
              </Draggable>
              <Draggable bounds="parent">
                <img
                  src={earth}
                  className="w-[5vw] z-20"
                  onDoubleClick={() => {
                    navigate("/globe");
                  }}
                ></img>
              </Draggable>
              <Draggable bounds="parent">
                <img
                  src={terminal}
                  className="w-[5vw] z-20"
                  onDoubleClick={() => {
                    // navigate("/matrix");
                    setShowMatrix(!showMatrix);
                  }}
                ></img>
              </Draggable>
              <div className="z-[160] absolute top-0">
                {finder ? (
                  <Finder setFinder={setFinder} finder={finder} />
                ) : null}
              </div>
            </div>
          ) : null}

          <div
            className={
              `${
                show ? "hidden" : "fixed"
              } bottom-2 flex  flex-row justify-center w-[100vw] z-[160]` +
              styles.task
            }
          >
            {!lock ? (
              <Taskbar
                theme={theme}
                setTheme={setTheme}
                open={finder}
                setFinder={setFinder}
              />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Desktop;
