import React, { useEffect } from "react";
import "./animate.css";
import { useNavigate } from "react-router-dom";
import { FaStop, FaPlay, FaPause } from "react-icons/fa";
// import { usePalette } from "react-palette";
const MusicTaskbar = ({ playing, nowPlaying, setPlayStatus, musicStop }) => {
  const [name, setName] = React.useState();
  const [width, setWidth] = React.useState(10);
  //   const colorThief = new ColorThief();
  //   console.log(colorThief.getColor(nowPlaying?.art));
  //   console.log(data);
  //   useEffect(() => {
  //   }, []);
  React.useEffect(() => {
    if (nowPlaying) {
      setName(
        nowPlaying.name.substring(0, 15) +
          (nowPlaying.name.length > 15 ? "..." : "")
      );
    }
  }, [nowPlaying]);
  //   React.useEffect(() => {
  //     // const changeWidth = () => {
  //     //   if (width < 20) setWidth(width + 0.1);
  //     // };
  //     // const widthId = setInterval(changeWidth, 100);
  //     // return function cleanup() {
  //     //   clearInterval(widthId);
  //     // };
  //   }, []);
  //   setTimeout(() => {
  //     if (width < 20) setWidth(() => parseFloat(width) + 0.1);
  //   }, 1);
  console.log(width);
  const navigate = useNavigate();
  return (
    <div
      className="slit-in-vertical my-auto h-[80%] rounded-lg text-white flex flex-row px-4 py-2 place-items-center gap-x-2 font-[Poppins] transition-all mt-2"
      style={{
        background:
          "linear-gradient(94.19deg, #270C13 0%, #190911 26.26%, #0E1E2F 57.63%, #0E2E47 100%)",
      }}
    >
      <div className="w-[50px] h-[50px] rounded-5">
        <img
          className="object-contain aspect-square cursor-pointer"
          src={nowPlaying?.art}
          onClick={() => {
            navigate("/music");
          }}
        ></img>
      </div>

      <div>{name}</div>
      <div
        className="cursor-pointer ml-5"
        onClick={() => {
          document.querySelector("#music-play").click();
        }}
      >
        <FaPlay />
      </div>
      <div
        className="cursor-pointer"
        onClick={() => {
          document.querySelector("#music-pause").click();
        }}
      >
        <FaPause />
      </div>
      <div
        className="cursor-pointer"
        onClick={() => {
          document.querySelector("#music-stop").click();
        }}
      >
        <FaStop />
      </div>
      {/* <div
        onClick={() => {
          if (playing) {
            setPlayStatus("pause");
          } else {
            setPlayStatus("play");
          }
        }}
      >
        Pause
      </div> */}
    </div>
  );
};

export default MusicTaskbar;
