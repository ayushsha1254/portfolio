import React, { useRef, useEffect } from "react";
import casette from "../../Assets/Player/casette.svg";
import * as animationData from "../../Assets/Player/play.json";
import lottie from "lottie-web";
const Casette = ({ song, setNowAlbum, nowAlbum, nowPlaying, playing }) => {
  // console.log(song);
  // const url = "https://upload.wikimedia.org/wikipedia/en/2/25/LetItBe.jpg";
  const lottieRef = useRef(null);
  const [showLottie, setShowLottie] = React.useState(false);
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

  useEffect(() => {
    if (playing) {
      lottie.play();
    } else lottie.pause();
  }, [playing]);
  // useEffect(()=>{
  //   if(playing && nowPlaying.album)
  // })
  // console.log(playing, nowPlaying?.album, nowAlbum);
  return (
    <div
      className="w-[170px] h-[250px] group cursor-pointer p-2"
      onClick={() => {
        setNowAlbum(song.album);
      }}
    >
      <div className="w-[150px] h-[150px] max-w-[150px] max-h-[150px] relative">
        <div
          className="w-[50px] h-[50px] absolute bottom-0 right-0 z-50 bg-blend-difference"
          style={{
            display: song.album == nowPlaying?.album ? "block" : "none",
          }}
          ref={lottieRef}
        ></div>
        <img
          src={song.album_art}
          className="object-cover aspect-square shadow-lg rounded-xl"
        />
        <img
          src={casette}
          className="w-[130px] ml-[8px] -mt-[90px] group-hover:-rotate-[75deg] transition-all
          drop-shadow-xl shadow-xl
          group-hover:drop-shadow-2xl
          
      
        "
          style={{
            transformOrigin: "bottom left",
          }}
        />
        <div className="flex flex-col justify-center place-items-center text-center mt-[20px] transition-all dark:text-white text-black">
          <span className="text-xl group-hover:drop-shadow-2xl">
            {" "}
            {song.album}
          </span>
          <span className="text-md">Rishit Shivesh</span>
        </div>
      </div>
    </div>
  );
};

export default Casette;
