import React, { useRef, useEffect } from "react";
// import music from "../../Data/music.json";
import * as animationData from "../../Assets/Player/play.json";
import lottie from "lottie-web";
import casette from "../../Assets/Player/casettebig.svg";
import walkman from "../../Assets/Player/walkman.svg";
import aictepattern from "../../Assets/Player/aictepattern.svg";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import fitty from "fitty";
const Songs = ({ setNowPlaying, nowAlbum, setPlaying, nowPlaying, music }) => {
  const [data, setData] = React.useState();

  const groupDataByAlbum = (data) => {
    const albums = {};
    data.forEach((item) => {
      if (!albums[item.album]) {
        albums[item.album] = [];
      }
      albums[item.album].push(item);
    });
    setData(albums);
    return albums;
  };
  React.useEffect(() => {
    if (music) groupDataByAlbum(music);
  }, [music]);
  //   console.log(data);
  //   console.log(album);
  const goUp = () => {
    document.getElementById("scroll-songs").scrollBy({
      top: 50,
      behavior: "smooth",
    });
  };
  const goDown = () => {
    document.getElementById("scroll-songs").scrollBy({
      top: -50,
      behavior: "smooth",
    });
  };
  const lottieRef = useRef(null);
  useEffect(() => {
    lottie.loadAnimation({
      container: lottieRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
        speed: 0.5,
      },
    });

    return () => {
      lottie.destroy();
    };
  }, []);
  const [songName, setSongName] = React.useState("Rishit's Mixtape");
  useEffect(() => {
    if (nowPlaying?.name?.length > 10)
      setSongName(nowPlaying?.name.substring(0, 10) + "...");
    else setSongName(nowPlaying?.name);
    if (!nowPlaying) setSongName("Rishit's Mixtape");
  }, [nowPlaying]);
  // useEffect(() => {
  //   fitty("#song-casette");
  // }, [nowPlaying]);
  return (
    <div className="min-w-[10vw] flex-grow flex flex-col justify-center flex-wrap py-2 px-4 transition-all">
      <div className="dark:text-white text-black text-2xl my-5">Songs</div>
      <div
        className=" h-[73vh] w-max bg-red-100 overflow-y-scroll px-2 py-2 relative"
        style={{
          // backgroundImage: `url(${walkman})`,

          // backgroundRepeat: "no-repeat",
          // backgroundPosition: "center",
          // backgroundSize: "fill",
          background: "#525252",
          /* type/faded */

          border: "1.13817px solid rgba(225, 225, 225, 0.5)",
          boxShadow:
            "0px 0px 27.3161px rgba(0, 0, 0, 0.25), 0px 9.10536px 9.10536px rgba(0, 0, 0, 0.25), inset 2.44161px -4.06936px 6.51097px rgba(0, 0, 0, 0.25), inset -2.44161px 4.06936px 6.51097px rgba(255, 255, 255, 0.64)",
          borderRadius: "22.7884px",
        }}
      >
        <div className="px-2 mt-2 pt-2 pb-8 h-[60%] rounded-[13.0207px] bg-[#35363C]">
          <div className="mt-2 mb-2 font-[hackbot] text-center bg-[#3b3b3b] py-2">
            {nowAlbum} Mixtape - {data && data[nowAlbum]?.length} Tracks
          </div>
          <div className="h-[90%] overflow-y-scroll" id="scroll-songs">
            {data &&
              data[nowAlbum].map((song) => {
                return (
                  <div
                    className="dark:text-white text-black my-3 flex flex-row place-items-center gap-x-5 justify-between w-[27vw]
                   transition-all cursor-pointer overflow-hidden rounded
                dark:hover:bg-[#ffffff20] hover:bg-[#00000120]
                "
                    style={{
                      backgroundColor:
                        nowPlaying === song ? "#646771" : "#64677185",
                      boxShadow:
                        "0px 3.26313px 3.26313px rgba(0, 0, 0, 0.25), inset 0px -0.815782px 0.815782px #4F5159, inset 0px 0.815782px 0.815782px #8B8E98",
                    }}
                    onClick={() => {
                      setNowPlaying(song);
                      setPlaying(true);
                    }}
                  >
                    <div className="p-1 rounded overflow-hidden flex flex-row flex-grow">
                      <div
                        className="text-white bg-[#5e1c1c] p-2 rotate-180 text-sm rounded-r text-center"
                        style={{
                          writingMode: "vertical-lr",
                        }}
                      >
                        Track
                      </div>
                      {/* <div className="h-[80px] aspect-square object-cover"> */}
                      <img
                        src={song.art}
                        className={"object-cover aspect-square w-[60px]"}
                      />
                      <div
                        className="w-full bg-[#e1e1e1] p-2 flex flex-row border-l-2 border-[#35363c]"
                        style={{
                          backgroundImage: `url(${aictepattern})`,
                          backgroundSize: "contain",
                        }}
                      >
                        <div className="flex flex-col bg-[#FFFDD020] basis-[80%]">
                          <div className="text-black font-mistrydibeti font-bold border-b-2 border-[#35363c]">
                            {song.name}
                          </div>
                          <div className="text-black font-mistrydibeti text-sm">
                            {song.artist}
                          </div>
                        </div>
                        <div className="basis-[20%] font-[Poppins] text-black flex flex-row justify-center place-items-center">
                          {song.year}
                        </div>
                      </div>
                      {/* </div> */}
                    </div>
                    {/* {song.name} */}
                    {/* <div className="w-[50px] h-[50px] relative">
                  
                  <img
                    src={song.art}
                    className="object-fit aspect-square rounded-lg"
                  ></img>
                </div>
                <div className="flex flex-col justify-start place-items-start text-left flex-grow">
                  <div className="my-auto font-[Poppins] text-xl">
                    {song.name}
                  </div>
                  <div className="my-auto font-[Poppins] text-sm text-[#252525] dark:text-[#cecece]">
                    {song.artist}
                  </div>
                </div>
                <div>{song.year}</div> */}
                  </div>
                );
              })}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-[200px] flex flex-row justify-between w-full ">
          <div className="relative w-full flex flex-row justify-start group">
            <img
              src={casette}
              className="w-[320px] -ml-4 -bottom-2 left-0 mx-auto mt-2 hover:scale-105 group-hover:scale-[1.05] transition-all rounded-xl drop-shadow-lg hover:drop-shadow[-50px_25px_25px_rgb(0 0 0 / 0.15)]"
            ></img>
            {/* <div
              className="absolute text-[1.3vmin] text-center top-[37px] ml-[100px] text-black font-mistrydibeti group-hover:scale-[1.05] group-hover:top-[32px] transition-all"
              // id="song-casette"
            >
              {nowPlaying?.name}
            </div> */}
            <div
              className="px-[8px] py-[4px] flex flex-row justify-center place-items-center text-black font-mistrydibeti  absolute top-[31px] group-hover:top-[28px] rounded-2xl group-hover:scale-[1.05] transition-all left-24 w-[150px] h-[22px]"
              onClick={(e) => {
                console.log(e.target.clientHeight);
              }}
            >
              {songName}
            </div>
          </div>
          <div className="bottom-10 gap-y-2 -translate-x-4 flex flex-col text-3xl select-none basis-[10%] mt-5 px-2">
            <div
              className="active:text-[#7e7b67] transition-all cursor-pointer p-5 bg-[#3e3e3e] rounded-full bg-blend-multiply
              active:shadow-[inset_0px_3.26313px_3.26313px_rgba(0,0,0,0.25)]
              shadow-[0px_3.26313px_3.26313px_rgba(0,0,0,0.25)]
              
              "
              onClick={goDown}
            >
              <AiFillCaretUp className="bg-blend-multiply" />
            </div>
            <div
              className="active:text-[#7e7b67] transition-all cursor-pointer p-5 bg-[#3e3e3e] rounded-full bg-blend-multiply
              active:shadow-[inset_0px_3.26313px_3.26313px_rgba(0,0,0,0.25)]
              shadow-[0px_3.26313px_3.26313px_rgba(0,0,0,0.25)]
              
              "
              onClick={goUp}
            >
              <AiFillCaretDown />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Songs;
