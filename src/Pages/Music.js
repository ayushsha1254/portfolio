import React, { Component, CSSProperties } from "react";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
// import VolumeDown from "@mui/icons-material/VolumeDown";
// import VolumeUp from "@mui/icons-material/VolumeUp";
import top from "../Assets/Player/top.svg";
import bottom from "../Assets/Player/bottom.svg";
import pattern from "../Assets/Player/pattern.svg";
import nowplaying from "../Assets/Player/nowplaying.svg";
import btns from "../Assets/Player/btns.svg";
import ReactHowler from "react-howler";
import { useEffect } from "react";
import btnskeleton from "../Assets/Player/btnskeleton.svg";
import { FaPlay, FaPause, FaStop, FaRandom } from "react-icons/fa";
import tapebg from "../Assets/Player/tapebg.svg";
// import "../Components/music.css ";
import cover from "../Assets/Player/cover.svg";
import smol from "../Assets/Player/smol.svg";
import big from "../Assets/Player/big.svg";
import wheel from "../Assets/Player/wheel.svg";
import Casette from "../Components/Music/Casette";
import songs from "../Data/music.json";
import Albums from "../Components/Music/Albums";
import Songs from "../Components/Music/Songs";
import volume from "../Assets/Player/volume.svg";
import progressImg from "../Assets/Player/progress.svg";
import { useNavigate } from "react-router-dom";
import "../Components/music.css";
// import { extractColors } from "extract-colors";
import { usePalette } from "react-palette";
import icons from "../Assets/Player/icons.svg";
import icon from "../Assets/Icons/music.svg";
import { AiOutlineMinus } from "react-icons/ai";
// import { GrClose } from "react-icons/gr";
import { CgClose } from "react-icons/cg";
import "../Components/music.css";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
const Music = React.forwardRef((props, ref) => {
  // console.log(props);
  // const ref = ref;
  const groupDataByAlbum = (data) => {
    const albums = {};
    data.forEach((item) => {
      if (!albums[item.album]) {
        albums[item.album] = [];
      }
      albums[item.album].push(item);
    });
    setAlbumData(albums);
    return albums;
  };
  useEffect(() => {
    groupDataByAlbum(songs);
  }, []);
  const [albumData, setAlbumData] = React.useState();
  const [position, setPosition] = React.useState(0);
  const [volumevalue, setvolumeValue] = React.useState(50);
  const [nowbtn, setNowbtn] = React.useState();
  const [circleWidth, setCircleWidth] = React.useState(0);
  const [nowAlbum, setNowAlbum] = React.useState("Beatles");
  const [volumeStart, setVolumeStart] = React.useState(0);
  const [volumeEnd, setVolumeEnd] = React.useState(0);
  const navigate = useNavigate();
  const [colors, setColors] = React.useState({});
  const handleChange = (event, newValue) => {
    setvolumeValue(newValue);
    // console.log(newValue / 100);
  };
  const handleSeekChange = (event, newValue) => {
    props.setSeek(newValue);
    // console.log(newValue / 100);
  };
  // useEffect(() => {
  //   if (props.nowPlaying) {
  //     var data;
  //     const f = async () => {
  //       data = await extractColors(props.nowPlaying.src);
  //     };
  //     f();
  //     console.log(data);
  //   }
  // }, [props.nowPlaying]);
  const GetColors = (img) => {
    const { data, loading, error } = usePalette(img);
    return data;
  };
  // useEffect(() => {
  // setColors(GetColors(props.nowPlaying?.art));
  // }, [props.nowPlaying]);
  // console.log(GetColors(props.nowPlaying?.art));
  useEffect(() => {
    ref.current.volume(volumevalue / 100);
  }, [volumevalue]);

  const chooseRandom = () => {
    const random = Math.floor(Math.random() * props.songs.data.length);
    props.setNowPlaying(props.songs.data[random]);
    setNowAlbum(props.nowPlaying.album);
    props.setPlaying(true);
  };

  useEffect(() => {
    setCircleWidth((props.progress / props.duration) * 100);
    // console.log(circleWidth);
  }, [props.progress]);

  const { id } = useParams();

  useEffect(() => {
    console.log(id);
    if (id && props.songs.data) {
      console.log(props.songs.data);
      const song = props.songs.data.find((song) => song.id == id);
      console.log(song);
      if (song) {
        props.setNowPlaying(song);
        setNowAlbum(song.album);
        props.setPlaying(true);
      } else {
        // window.location.pathname = "/music";
        // navigate("/music");
      }
    } else {
      // window.location.pathname = "/music";
      // navigate("/music");
    }
  }, [id, props?.songs?.data]);
  return (
    <div
      className="bg-[#b9b9b9] dark:bg-[#2f2f2f] bg dark:text-white text-black h-[100vh] w-[100vw] overflow-hidden transition-all "
      style={{
        "--one": GetColors(props.nowPlaying?.art)?.vibrant + "20",
        "--two": GetColors(props.nowPlaying?.art)?.darkVibrant + "20",
        "--three": GetColors(props.nowPlaying?.art)?.lightVibrant + "20",
        "--four": GetColors(props.nowPlaying?.art)?.muted + "20",
      }}
    >
      {/* <Helmet>
        <title>{`Music | Rishit Shivesh | ${props?.nowPlaying?.name}`}</title>
        <meta name="description" content="Rishit's Music Player" />
        <meta name="theme-color" content="#008f68" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#008f68" />
        <meta name="msapplication-navbutton-color" content="#008f68" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Rishit Shivesh" />
        <meta name="application-name" content="Rishit Shivesh" />
        <meta name="msapplication-starturl" content="/" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="keywords"
          content="Rishit Shivesh, Rishit, Shivesh, Music Player"
        />
        <meta name="author" content="Rishit Shivesh" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="og:title" content="Rishit Shivesh | Music Player" />
        <meta
          name="og:description"
          content={`${props?.nowPlaying?.name} on Rishit Shivesh's Music Player`}
        />
        <meta name="og:image" content={props?.nowPlaying?.art} />
      </Helmet> */}
      {/* <div className="w-[100vw] h-[5vh] fixed top-0 left-0 bg-black z-[100] px-5 py-1 text-white flex-row justify-between place-items-center">
        <span>Music Player</span>
        <div className="float-right mt-2 p-2 w-[20px] h-[20px] flex flex-row justify-center place-items-center bg-red-500 text-white rounded-full">
          X
        </div>
      </div> */}
      <div className="w-full h-[5vh] bg-[#00000170] flex flex-row justify-between place-items-center px-3 py-1 font-[Consolas]">
        <div className="flex flex-row place-items-center justify-center gap-x-2">
          <img src={icon} className="object-fit w-[30px]" />
          <div className=" font-[Modeseven]">//host/var/www/bin/Music.exe</div>
        </div>
        <div className="flex flex-row gap-x-2">
          <div
            className="p-1 bg-[#4f4f4f] rounded-lg text-white hover:bg-[#5f5641] active:bg-[#947836] transition-all cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            <AiOutlineMinus />
          </div>
          <div
            className="p-1 bg-[#4f4f4f] rounded-lg text-white hover:bg-[#432929] active:bg-[#712121] transition-all cursor-pointer"
            onClick={() => {
              ref.current.stop();
              // props.setSeek(0);
              props.setProgress(0);
              props.setPlaying(false);
              // props.setDuration(0);
              navigate("/");
            }}
          >
            {/* <GrClose /> */}
            <CgClose />
          </div>
        </div>
      </div>
      {/* <ReactHowler
        ref={ref}
        playing={playing}
        onLoad={() => {
          setDuration(ref.current.duration());
        }}
        src={
          nowPlaying
            ? nowPlaying.src
            : ""
        }
      /> */}
      {/* <div className="text-center">Music Player</div> */}
      <div
        className="flex flex-row justify-between pt-3 flex-wrap no-repeat relative"
        // onClick={() => {
        //   console.log(albumData[nowAlbum][0].album_art);
        // }}
        style={{
          backgroundImage: `url(${icons})`,
          //   // background: nowAlbum
          //   //   ? `background: linear-gradient(270deg, #2D2D2D 0%, rgba(45, 45, 45, 0) 152.98%),url(${albumData[nowAlbum][0].album_art})`
          //   //   : "",
          //   background: `url(${albumData?.[nowAlbum][0].album_art}) no-repeat,linear-gradient(270deg, #2D2D2D 0%, rgba(45, 45, 45, 0.2) 122.98%) no-repeat`,

          //   backgroundPosition: "left, left top",
          //   backgroundRepeat: "no-repeat, no-repeat",
          //   backgroundAttachment: "fixed,fixed",
          //   backgroundSize: "contain,50% 50%",
        }}
      >
        {/* <div
          className="absolute bg-red-100 w-[100vw] h-[100vh] top-0 left-0"
          style={{
            boxShadow:
              `inset -350px 0 100px 0 ` +
              GetColors(props.nowPlaying?.art)?.darkVibrant +
              "",
            opacity: 0.1,
            background: `url(${albumData?.[nowAlbum][0].album_art})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "50% 100%",
          }}
        >
          
        </div> */}
        <div className="screen h-[100vh] overflow-hidden">
          <Albums
            setNowAlbum={setNowAlbum}
            nowAlbum={nowAlbum}
            nowPlaying={props.nowPlaying}
            playing={props.playing}
            music={props?.songs?.data}
          />
        </div>
        <div className="h-[100vh] basis-[30%] mt-10 pt-10">
          <div
            className="w-[450px] h-[550px] bg-[#525252] mx-auto my-auto relative rounded-[2rem] overflow-hidden"
            style={{
              backgroundImage: `url(${top}), url(${bottom})`,
              backgroundPosition: "top, bottom",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
            }}
          >
            <img src={pattern} className="z-10 mx-auto mt-5" />
            <div
              className="bg-[#26282c] w-[90%] h-[57%] mx-auto mt-5 rounded-lg p-2"
              style={{
                backgroundImage: `url(${tapebg})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "98%",
              }}
            >
              <div
                className="box w-[90%] h-[75%] mx-auto bg-[#303237] mt-4 relative text-white text-center"
                style={{
                  clipPath:
                    "polygon(2% 0, 98% 0, 100% 2%, 100% 100%, 97% 100%, 0% 100%, 0 100%, 0 2%)",
                }}
              >
                <img
                  src={cover}
                  className="object-cover w-full h-full z-10 absolute top-0 left-0"
                />
                <span className="font-caveat text-3xl text-[#b8b8b9] z-20">
                  {props.nowPlaying ? props.nowPlaying.name : "‎ "}
                </span>
                {/* <div className="my-auto mx-auto bg-[#121212] w-[50%] h-[30%] translate-y-[45px] flex flex-row overflow-visible">
                <img
                  src={smol}
                  className={`absolute -left-[40px] w-[80px] -top-[10px] ${
                    playing ? "animate-[spin_2s_linear_infinite]" : ""
                  }`}
                ></img>
                <img
                  src={big}
                  className={`absolute -top-[30px] -right-[70px] w-[120px] ${
                    playing ? "animate-[spin_2s_linear_infinite]" : ""
                  }`}
                />
              </div> */}
                {/* Edit the round figure */}
                <div className="my-auto mx-auto bg-[#121212] w-[50%] h-[30%] translate-y-[35px] flex flex-row justify-between overflow-visible">
                  <div
                    className="rounded-full -ml-[50px] mt-[-25px]  relative flex flex-row justify-center place-items-center"
                    style={{
                      width: "110px",
                      height: "110px",
                    }}
                    backgroundImage={`url(${wheel})`}
                  >
                    <div
                      className="bg-[#604443] rounded-full transition-all"
                      style={{
                        width: `${110 - (circleWidth * 50) / 100}px`,
                        height: `${110 - (circleWidth * 50) / 100}px`,
                      }}
                    ></div>
                    <img
                      src={wheel}
                      className={`w-[60px] absolute  ${
                        props.playing ? "animate-[spin_2s_linear_infinite]" : ""
                      }`}
                    ></img>
                  </div>
                  <div
                    className="rounded-full -mr-[50px] mt-[-25px]  relative flex flex-row justify-center place-items-center"
                    style={{
                      width: "110px",
                      height: "110px",
                    }}
                    backgroundImage={`url(${wheel})`}
                  >
                    <div
                      className="bg-[#604443] rounded-full transition-all"
                      style={{
                        width: `${(circleWidth * 50) / 100 + 60}px`,
                        height: `${(circleWidth * 50) / 100 + 60}px`,
                      }}
                    ></div>
                    <img
                      src={wheel}
                      className={`w-[60px] absolute object-fit rounded-full ${
                        props.playing ? "animate-[spin_2s_linear_infinite]" : ""
                      }`}
                      style={{
                        transformOrigin: "center",
                      }}
                    ></img>
                  </div>
                </div>
                <div className="w-[95%] ml-[0.47rem] absolute bottom-[23px] z-20 pt-1">
                  {/* <Slider
                    aria-label="time-indicator"
                    size="small"
                    // value={position}
                    value={
                      props.progress ? (props.progress / ref.current.duration()) * 100 : 0
                    }
                    onChange={handleSeekChange}
                    // onChange={(_, value) => setPosition(value)}
                    sx={{
                      color: "#604443",
                      height: 10,
                      "& .MuiSlider-thumb": {
                        width: 15,
                        height: 15,
                        zIndex: 1,

                        transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
                        "&:before": {
                          display: "block",
                          // backgroundColor: "white",
                          // marginLeft: -4,
                          // width: "10%",
                          // height: 10,
                          // borderRadius: 5,
                          // opacity: 0.3,
                          zIndex: 0,
                          boxShadow: "0px 0px 5px 5px rgba(100, 100, 80, 0.5)",
                        },
                        "&:hover, &.Mui-focusVisible": {
                          boxShadow: `0px 0px 0px 8px ${"rgb(255 255 255 / 16%)"}`,
                        },
                        "&.Mui-active": {
                          width: 20,
                          height: 20,
                        },
                      },
                      "& .MuiSlider-rail": {
                        opacity: 0.28,
                      },
                    }}
                  /> */}
                  <Slider
                    aria-label="time-indicator"
                    // size="small"
                    // value={position}
                    value={
                      props.progress
                        ? (props.progress / ref.current?.duration()) * 100
                        : 0
                    }
                    onChange={handleSeekChange}
                    // onChange={(_, value) => setPosition(value)}
                    sx={{
                      color: "#60444370",
                      height: 20,
                      borderRadius: "4px",
                      width: 1,
                      "& .MuiSlider-thumb": {
                        overflow: "hidden",
                        width: 0,
                        height: 18,
                        zIndex: 1,
                        borderRadius: "4px",

                        transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
                        "&:before": {
                          display: "block",
                          overflow: "hidden",
                          borderRadius: "4px",

                          // backgroundColor: "white",
                          // marginLeft: -4,
                          // width: "10%",
                          // height: 10,
                          // borderRadius: 5,
                          // opacity: 0.3,
                          zIndex: 0,
                          // boxShadow: "0px 0px 5px 5px rgba(100, 100, 80, 0.5)",
                        },
                        "&:hover, &.Mui-focusVisible": {
                          boxShadow: `0px 0px 0px 0px ${"rgb(255 255 255 / 16%)"}`,
                        },
                        "&.Mui-active": {
                          width: 0,
                          height: 0,
                        },
                      },
                      "& .MuiSlider-rail": {
                        opacity: 0.9,
                        borderRadius: "4px",
                        backgroundImage: `url(${progressImg})`,
                        backgroundSize: "contain",
                      },
                    }}
                  />

                  {/* <div
                    className="w-full bg-red-100 h-[20px] overflow-hidden no-repeat"
                    style={{
                      background: `url(${volume})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <div
                      className="w-[2px] h-[10px] my-[2.5px] bg-red-100 transition-all"
                      style={{
                        marginLeft: `${(volumevalue / 100) * 307 + 8}px`,
                      }}
                      onMouseEnter={(e) => {
                        setVolumeStart(e.target.offsetLeft);
                        console.log(e.target.offsetLeft);
                      }}
                      onMouseLeave={(e) => {
                        setVolumeEnd(e.target.offsetLeft);
                        console.log(e.target.offsetLeft);
                      }}
                      onClick={(e) => {
                        // setVolume
                        console.log(volumeEnd, (volumeEnd / 315) * 100);
                        setvolumeValue((volumeEnd / 315) * 100);
                        console.log(e.target.offsetLeft);
                      }}
                    ></div>
                  </div> */}
                </div>
                <div className="w-[95%] ml-[0.47rem] absolute -bottom-2 z-20">
                  <Slider
                    aria-label="volume-indicator"
                    size="small"
                    // value={position}
                    value={volumevalue}
                    onChange={handleChange}
                    // onChange={(_, value) => setPosition(value)}
                    sx={{
                      color: "#60444390",
                      borderRadius: "4px",
                      height: 14,
                      "& .MuiSlider-thumb": {
                        overflow: "hidden",
                        width: 0,
                        height: 18,
                        zIndex: 1,
                        borderRadius: "4px",
                        transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
                        "&:before": {
                          display: "block",
                          overflow: "hidden",
                          // backgroundColor: "white",
                          // marginLeft: -4,
                          // width: "10%",
                          // height: 10,
                          // borderRadius: 5,
                          // opacity: 0.3,
                          zIndex: 0,
                          // boxShadow: "0px 0px 5px 5px rgba(100, 100, 80, 0.5)",
                        },
                        "&:hover, &.Mui-focusVisible": {
                          boxShadow: `0px 0px 0px 0px ${"rgb(255 255 255 / 16%)"}`,
                        },
                        "&.Mui-active": {
                          width: 0,
                          height: 0,
                        },
                      },
                      "& .MuiSlider-rail": {
                        opacity: 0.9,
                        borderRadius: "4px",
                        backgroundImage: `url(${progressImg})`,
                        backgroundSize: "contain",
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              className="bg-[#26282c] rounded-t-2xl w-[90%] h-[27%] mx-auto mt-5 bg-blend-luminosity flex flex-row justify-center place-items-center text-3xl overflow-hidden"
              style={{
                backgroundImage: `url(${bottom})`,
                backgroundPosition: "bottom",
                backgroundRepeat: "no-repeat",
                backgroundSize: "150%",
              }}
            >
              <div
                className="basis-[25%] transition-all flex flex-row justify-center h-full place-items-center text-[#d7d7d7] border-r-2 border-[#ffffff20] cursor-pointer"
                style={{
                  opacity: props.playing ? 0.5 : 1,
                  backgroundColor: props.playing ? "#000" : "",
                }}
                onClick={() => {
                  if (props.nowPlaying) props.setPlaying(true);
                }}
              >
                <FaPlay />
              </div>
              <div
                className="basis-[25%] flex flex-row justify-center h-full place-items-center text-[#d7d7d7] border-r-2 border-[#ffffff20] cursor-pointer"
                style={{
                  opacity: !props.playing && props.progress != 0 ? 0.5 : 1,
                  backgroundColor:
                    !props.playing && props.progress != 0 ? "#000" : "",
                }}
                onClick={() => {
                  props.setPlaying(false);
                }}
              >
                <FaPause />
              </div>
              <div
                className="basis-[25%] flex flex-row justify-center h-full place-items-center text-[#d7d7d7] border-r-2 border-[#ffffff20] active:animate-[darken_0.2s_linear] cursor-pointer"
                onClick={() => {
                  ref.current.stop();
                  // props.setSeek(0);
                  props.setProgress(0);
                  console.log(props.seek);
                  props.setPlaying(false);
                }}
              >
                <FaStop />
              </div>
              <div
                className="basis-[25%] flex flex-row justify-center h-full place-items-center text-[#d7d7d7] border-r-2 border-[#ffffff20] active:animate-[darken_0.2s_linear] cursor-pointer"
                onClick={chooseRandom}
              >
                <FaRandom />
              </div>
            </div>
          </div>
        </div>
        <div className="basis-[33%] h-[100vh]">
          <Songs
            nowAlbum={nowAlbum}
            setNowPlaying={props.setNowPlaying}
            setPlaying={props.setPlaying}
            nowPlaying={props.nowPlaying}
            music={props?.songs?.data}
          />
        </div>
      </div>
      <div className="flex flex-row justify-evenly px-5 pt-5 flex-wrap">
        {/* {songs.map((song, index) => {
          return (
            <div
              onClick={() => {
                setNowPlaying(song);
                setPlaying(true);
              }}
            >
              <Casette song={song} key={index} />
            </div>
          );
        })} */}
      </div>

      {/* <div className=" w-[50%] mx-auto">
        <Slider
          aria-label="Volume"
          value={volumevalue}
          onChange={handleChange}
        />
      </div> */}
    </div>
  );
});

// class App extends Component {

//   getHowler () {
//     this.player.howler
//   }

//   getDuration () {
//     this.player.duration()
//   }

//   getSeek () {
//     this.player.props.seek()
//   }

//   props.setSeek () {
//     this.player.props.seek(0.5)
//   }
//   // This sound file may not work due to cross-origin setting
//   render () {
//     return(
//       <ReactHowler
//         src='http://goldfirestudios.com/proj/howlerjs/sound.ogg'
//         playing={true}
//         ref={(ref) => (this.player = ref)}
//       />
//     );
//   }
// }
export default Music;
