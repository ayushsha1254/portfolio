import React from "react";
import lottie from "lottie-web";
import animationData from "../Assets/Lottie/loader.json";
const Loading = () => {
  //   setup lottie
  React.useEffect(() => {
    lottie.loadAnimation({
      container: document.querySelector("#loading-screen"),
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animationData,
    });
  }, []);

  return (
    <div className="w-[100vw] h-[100vh] bg-[#3e3e3e]" id="loading-screen">
      <div></div>
    </div>
  );
};

export default Loading;
