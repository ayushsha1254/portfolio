import React, { useRef, useEffect } from "react";
import music from "../../Data/music.json";
import * as animationData from "../../Assets/Player/play.json";
import lottie from "lottie-web";
const Songs = ({ setNowPlaying, nowAlbum, setPlaying, nowPlaying }) => {
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
    groupDataByAlbum(music);
  }, []);
  //   console.log(data);
  //   console.log(album);
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
  return (
    <div className="min-w-[10vw] flex-grow flex flex-col justify-center flex-wrap py-2 px-4 transition-all">
      <div className="dark:text-white text-black text-2xl my-5">Songs</div>
      <div className=" max-h-[70vh]  overflow-y-scroll scrollbar">
        {data &&
          data[nowAlbum].map((song) => {
            return (
              <div
                className="dark:text-white text-black my-5 flex flex-row place-items-center gap-x-5 justify-between max-w-[30vw]
                p-2 transition-all rounded-lg cursor-pointer
                dark:hover:bg-[#ffffff20] hover:bg-[#00000120]
                "
                style={{
                  backgroundColor: nowPlaying === song ? "#00000120" : "",
                }}
                onClick={() => {
                  setNowPlaying(song);
                  setPlaying(true);
                }}
              >
                <div className="w-[50px] h-[50px] relative">
                  {/* <div
                    className="w-[50px] h-[50px] z-50 bg-[#00000120]  absolute top-0 left-0"
                    // ref={lottieRef}
                  ></div> */}
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
                <div>{song.year}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Songs;
