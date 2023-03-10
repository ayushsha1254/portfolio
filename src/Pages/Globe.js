import React, { useRef, useEffect, Suspense } from "react";
import Handler from "./Handler";
import star from "../Assets/Theme/star.svg";
import day from "../Assets/Theme/day.jpg";
import data from "../Data/main.json";
import Nav from "../Components/Nav";
import bg from "../Assets/Images/globebg.svg";
import Skeleton from "@mui/material/Skeleton";
// import Explorer from "../Components/ExpandedExplorer";
import Taskbar from "../Components/Taskbar";
import Finder from "../Components/Finder";
import styles from "../Components/desk.module.css";
import Lock from "./Lock";
import wallpaper from "../Assets/Images/wallpaper.svg";
import CircularProgress from "@mui/material/CircularProgress";

import Particles from "./Particles";

import { useSelector, useDispatch } from "react-redux";
import { toggleExplorer, setExplorer } from "../Utility/state/action";

const Globe = ({
  theme,
  setTheme,
  lock,
  setLock,
  finder,
  setFinder,
  journey,
  setJourney,
  help,
  setHelp,
  nowPlaying,
  playing,
  setPlayStatus,
  musicStop,
  notifications,
}) => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  console.log(state);
  useEffect(() => {
    if (lock) {
      dispatch(setExplorer(false));
    }
  }, [lock]);
  const [ready, setReady] = React.useState(false);
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
          <div className="z-[100] absolute top-0" style={{}}>
            <Lock
              lock={lock}
              setLock={setLock}
              playing={playing}
              nowPlaying={nowPlaying}
            />
          </div>
        </Suspense>
      ) : null}

      <div
        className="py-3 px-2  bg-[#e6e6e6] dark:bg-[#0f0f0f]  transition-all duration-500 w-screen max-h-screen overflow-x-hidden"
        style={{
          backgroundImage: state.theme ? `url(${star})` : `url(${day})`,
          // backgroundColor: theme ? "#0f0f0f" : "#e6e6e6",
          backgroundRepeat: "no repeat",
          backgroundSize: "cover",
          width: "100vw",
          height: "100vh",
          maxHeight: "100vh",
          overflow: "hidden",
        }}
      >
        <div
          className="min-w-[100vw] min-h-[100vh] transition-all dark:backdrop-blur-0 backdrop-blur-md"
          style={{
            width: "100vw",
            height: "100vh",
            maxHeight: "100vh",
          }}
        >
          <Nav
            theme={state.theme}
            setTheme={setTheme}
            lock={lock}
            setLock={setLock}
            help={help}
            setHelp={setHelp}
            playing={playing}
            nowPlaying={nowPlaying}
            musicStop={musicStop}
            notifications={notifications}
          />

          <Particles />
          <div className="flex flex-col lg:flex-row justify-around">
            {/* <div id="globeViz"
      ></div> */}
            <div className="text-white font-[hackbot] text-[6rem] basis-full lg:basis-1/3 flex flex-wrap flex-col align-middle place-items-center justify-center px-8">
              {data.home.name}
            </div>
            <div
              className="basis-full lg:basis-1/3 lg:block hidden transition-all"
              style={{
                backgroundImage: `url(${bg})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "bottom",
              }}
            >
              <div id="globeViz"></div>

              <Handler
                device={false}
                theme={theme}
                ready={ready}
                onReady={setReady}
              />
            </div>
            {/* <div
            className="basis-full lg:basis-1/3 lg:block dark:hidden block"
            style={{
              backgroundImage: `url(${bg})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "bottom",
            }}
          >
            <div id="globeViz"></div>
            <Handler device={false} theme={theme} />
          </div> */}
            {/* <div className="basis-full lg:basis-1/3 lg:hidden block">
              <div id="globeViz"></div>

              <Handler device={true} ready={ready} onReady={setReady} />
            </div> */}
            <div className="text-white font-[hackbot] lg:basis-[34%] flex flex-wrap flex-row align-middle place-items-center justify-center pr-8 text-lg">
              {data.home.description}
              <br />~ {data.home.description_by}
            </div>
          </div>

          <div
            className={
              `${
                lock ? "hidden" : "fixed"
              } bottom-3 flex  flex-row justify-center w-[100vw] z-[160]` +
              styles.task
            }
          >
            {!lock ? (
              <Taskbar
                theme={state.theme}
                setTheme={setTheme}
                open={finder}
                setFinder={setFinder}
                nowPlaying={nowPlaying}
                playing={playing}
                setPlayStatus={setPlayStatus}
                musicStop={musicStop}
              />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Globe;
