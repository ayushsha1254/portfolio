import React, { useState, useEffect, useCallback, Suspense } from "react";
import logo from "./logo.svg";
import "./App.css";
import Draggable from "react-draggable";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Desktop from "./Pages/Desktop";
import Menu from "./Components/Menu";
import Globe from "./Pages/Globe";
import Lock from "./Pages/Lock";
import Matrix from "./Components/Matrix";
import Particles from "./Pages/Particles";
// import Matrix from "react-matrix-effect";
import CircularProgress from "@mui/material/CircularProgress";
import ReactHowler from "react-howler";

import { TerminalContextProvider } from "react-terminal";
import { Provider } from "react-redux";
import store from "./Utility/state/store";
import Browser from "./Pages/Browser";
import Global from "./Pages/Global";
import Triangle from "./Pages/Triangle";
import Tetris from "./Pages/Tetris";
import Terminal from "./Pages/Terminal";
import { ParallaxProvider } from "react-scroll-parallax";
import Loader from "./Pages/Loader";
import Loading from "./Pages/Loading";
import Resume from "./Pages/Resume";
import axios from "./Utility/Axios/axios";
// import Menu from "./Components/Menu";
// import Blog from "./Pages/Blog";
// import SingleBlog from "./Pages/SingleBlog";

import BlogEditor from "./Pages/BlogEditor";
import LoadingAnimation from "./Pages/LoadingAnimation";
// import Music from "./Pages/Music";
const Music = React.lazy(() => import("./Pages/Music"));
const Blog = React.lazy(() => import("./Pages/Blog"));
const SingleBlog = React.lazy(() => import("./Pages/SingleBlog"));

function App() {
  const [theme, setTheme] = React.useState(true);
  const themedata = localStorage.getItem("color-theme") == "dark";
  const [lock, setLock] = React.useState(true);
  const [finder, setFinder] = React.useState(false);
  const [help, setHelp] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [nowPlaying, setNowPlaying] = React.useState(null);
  const [duration, setDuration] = React.useState(0);
  const ref = React.createRef();
  const [progress, setProgress] = React.useState(0);
  const [seek, setSeek] = React.useState(0);
  const [playStatus, setPlayStatus] = React.useState("play");
  const [musicStop, setMusicStop] = React.useState(true);
  useEffect(() => {
    if (!playing && progress == 0) {
      setMusicStop(true);
    } else {
      setMusicStop(false);
    }
  }, [playing, progress]);
  useEffect(() => {
    setTheme(themedata);
  }, [themedata]);

  console.log("m", musicStop);
  useEffect(() => {
    // if (playing) {
    const refreshTime = () => {
      setProgress(ref.current.seek());
    };
    const timerId = setInterval(refreshTime, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
    // }
  }, [ref]);
  useEffect(() => {
    ref.current.seek((seek / 100) * ref.current.duration());
  }, [seek]);
  useEffect(() => {
    // window.location.reload();

    if (
      localStorage.getItem("color-theme") === "dark" ||
      (!("color-theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    }
  }, [theme]);

  document.onkeydown = function (e) {
    if (
      (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) ||
      e.key === "Meta" ||
      e.key === "Shift" ||
      e.key === "Control" ||
      e.key === "alt" ||
      e.key === "Option"
    ) {
      return;
    }
    if (
      e.altKey + e.key.toLowerCase() === "truel" ||
      e.metaKey + e.key.toLowerCase() === "trueL"
    ) {
      e.preventDefault();
      // console.log(finder ? "Open" : "Close");
      localStorage.removeItem("lastlogin");

      setLock(true);
    } else if (
      e.altKey + e.key.toLowerCase() === "trues" ||
      e.metaKey + e.key.toLowerCase() === "trueS"
    ) {
      e.preventDefault();
      console.log(finder ? "Open" : "Close");
      document.getElementById("finderIcon").click();
    } else if (
      e.altKey + e.key.toLowerCase() === "truee" ||
      e.metaKey + e.key.toLowerCase() === "truee"
    ) {
      e.preventDefault();
      // console.log(finder ? "Open" : "Close");
      // document.getElementById("finderIcon").click();
      document.getElementById("explorerIcon").click();
    }

    console.log(e.altKey + e.key, e.key);
  };
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    if (window.innerWidth <= 1000) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }, [window && window.innerWidth]);
  const [songs, setSongs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [skills, setSkills] = useState([]);
  // const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  useEffect(() => {
    const data = axios.get("/songs").then((res) => setSongs(res.data));
  }, []);
  useEffect(() => {
    const data = axios
      .get("/notifications")
      .then((res) => setNotifications(res.data.data));

    const skills = axios.get("/static/skills").then((res) => {
      console.log(res.data);
      setSkills(res.data);
    });

    const certifications = axios
      .get("/static/certifications")
      .then((res) => setCertifications(res.data));
  }, []);
  console.log(nowPlaying);
  // console.log(skills, certifications);
  const [loadingNow, setLoadingNow] = useState(true);
  // useEffect(() => {
  //   const check = localStorage.getItem("rs-login");
  //   if (check) {
  //     const lastLogin = new Date(check);
  //     const now = new Date();
  //     const diffTime = Math.abs(now - lastLogin);
  //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //     if (diffDays > 1) {
  //       localStorage.setItem("rs-login", new Date().toISOString());
  //       setLoadingNow(true);
  //     } else {
  //       setLoadingNow(false);
  //     }
  //   } else {
  //     setLoadingNow(true);
  //     localStorage.setItem("rs-login", new Date().toISOString());
  //   }
  //   // console.log(check);
  // }, []);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     // setCount('Timeout called!');
  //     setLoadingNow(false);
  //   }, 17000);
  //   return () => clearTimeout(timer);
  // }, [loadingNow]);

  if (!mobile) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <TerminalContextProvider>
            <ParallaxProvider>
              <Menu theme={theme} setTheme={setTheme} />
              <div
                id="music-stop"
                className="hidden"
                onClick={() => {
                  ref.current.stop();
                  setPlaying(false);
                }}
              ></div>
              <div
                id="music-pause"
                className="hidden"
                onClick={() => {
                  ref.current.pause();
                  setPlaying(false);
                }}
              ></div>
              <div
                id="music-play"
                className="hidden"
                onClick={() => {
                  ref.current.play();
                  setPlaying(true);
                }}
              ></div>
              <ReactHowler
                ref={ref}
                playing={playing}
                onLoad={() => {
                  setDuration(ref.current.duration());
                  ref.current.volume(0.5);
                }}
                loop={true}
                src={
                  nowPlaying
                    ? nowPlaying.src
                    : "https://rs-bucket-s3.s3.ap-south-1.amazonaws.com/music/sos-rs.mp3"
                }
              />
              {/* {loadingNow ? (
                // <React.Fragment>
                <Loader />
              ) : // </React.Fragment>
              null} */}
              <Routes>
                {/* <Route
            path="/"
            element={
              <Suspense
                fallback={
                  <div className="w-full h-full flex flex-row justify-center place-items-center">
                    {" "}
                    <CircularProgress />
                  </div>
                }
              >
                <Desktop
                  theme={theme}
                  setTheme={setTheme}
                  lock={lock}
                  setLock={setLock}
                  finder={finder}
                  setFinder={setFinder}
                />
              </Suspense>
            }
          /> */}
                <Route
                  path="/"
                  element={
                    <Suspense
                      fallback={
                        <div className="w-full h-full flex flex-row justify-center place-items-center">
                          {" "}
                          <CircularProgress />
                        </div>
                      }
                    >
                      <Global
                        help={help}
                        setHelp={setHelp}
                        certifications={certifications}
                        skills={skills}
                      >
                        <Globe
                          theme={theme}
                          setTheme={setTheme}
                          lock={lock}
                          setLock={setLock}
                          finder={finder}
                          setFinder={setFinder}
                          help={help}
                          setHelp={setHelp}
                          nowPlaying={nowPlaying}
                          playing={playing}
                          setPlayStatus={setPlayStatus}
                          musicStop={musicStop}
                          notifications={notifications}
                        />
                      </Global>
                    </Suspense>
                  }
                />
                <Route path="/particles" element={<Particles />} />

                <Route path="/browser" element={<Browser />} />
                <Route path="/triangles" element={<Triangle />} />
                <Route path="/tetris" element={<Tetris />} />

                <Route path="/terminal" element={<Terminal />} />
                <Route
                  path="/music"
                  element={
                    <Suspense fallback={<Loading />}>
                      <Music
                        ref={ref}
                        duration={duration}
                        setDuration={setDuration}
                        playing={playing}
                        setPlaying={setPlaying}
                        nowPlaying={nowPlaying}
                        setNowPlaying={setNowPlaying}
                        progress={progress}
                        setProgress={setProgress}
                        seek={seek}
                        setSeek={setSeek}
                        songs={songs}
                      />
                    </Suspense>
                  }
                />

                <Route
                  path="/music/:id"
                  element={
                    <Suspense fallback={<Loading />}>
                      <Music
                        ref={ref}
                        duration={duration}
                        setDuration={setDuration}
                        playing={playing}
                        setPlaying={setPlaying}
                        nowPlaying={nowPlaying}
                        setNowPlaying={setNowPlaying}
                        progress={progress}
                        setProgress={setProgress}
                        seek={seek}
                        setSeek={setSeek}
                        songs={songs}
                      />
                    </Suspense>
                  }
                />

                <Route path="/matrix" element={<Matrix />} />
                <Route path="/loader" element={<Loader />} />
                <Route path="/loading" element={<Loading />} />
                <Route path="/resume" element={<Resume />} />
                <Route
                  path="/blog"
                  element={
                    <Suspense fallback={<LoadingAnimation />}>
                      <Blog />
                    </Suspense>
                  }
                />
                <Route path="loadingAnimation" element={<LoadingAnimation />} />
                <Route
                  path="/blog/:id"
                  element={
                    <Suspense fallback={<LoadingAnimation />}>
                      <SingleBlog />
                    </Suspense>
                  }
                />

                <Route path="/blogeditor" element={<BlogEditor />} />
              </Routes>
            </ParallaxProvider>
          </TerminalContextProvider>
          {/* <App /> */}
        </BrowserRouter>
      </Provider>
    );
  } else {
    const pathname = window.location.pathname;
    console.log(pathname);
    // window.location.href = "https://m.rishitshivesh.co.in" + pathname;
    window.alert(
      "Mobile version is under development. Please visit on desktop for now. Thank you!"
    );
  }
}

export default App;
