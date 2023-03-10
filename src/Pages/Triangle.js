import React from "react";
// import "../Utility/triangle";
const Triangle = ({
  width = window.innerWidth,
  height = window.innerHeight,
}) => {
  return (
    <>
      <div id="container" class="container">
        {/* <div className="w-[100vw] h-[100vh] container" id="output"> */}
        <iframe
          src="https://rishitshivesh.github.io/triangles/"
          width={width}
          height={height}
        />
        {/* </div> */}
      </div>
      <div id="controls" class="controls"></div>
    </>
  );
};

export default Triangle;
