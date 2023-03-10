import React from "react";
import Typewriter from "typewriter-effect";

const Loader = () => {
  return (
    <div className="relative z-[1000]">
      <div
        className="w-full h-[100vh] bg-[black] text-[#7efa47] text-2xl p-5 z-10"
        style={{
          textShadow: "0 0 10px #7efa47",
          font: "1.5rem Inconsolata, monospace",
          lineHeight: "1.3",
          backgroundImage: "radial-gradient(rgba(0, 150, 0, 0.25), black 120%)",
        }}
      >
        <Typewriter
          options={{
            devMode: true,
            cursor: "_",
          }}
          onInit={(typewriter) => {
            typewriter
              .typeString("> ...loading sequence initiate...<br/>")
              .pasteString("contacting Host")
              .typeString("...<br/>")
              .pasteString("- style v6.9.0 installed.<br/>")
              .pasteString("- markup v4.2.0 installed.<br/>")
              .pasteString("- scripts v10.2.1 installed.<br/>")
              .pasteString("- awesomeness v99.1.0 installed.<br/>")
              .pasteString("- accessibility v1.0.0 installed.<br/>")
              .pasteString("- security v1.0.0 installed.<br/>")
              .pasteString("- performance v1.0.0 installed.<br/>")
              .pasteString("- seo v1.0.0 installed.<br/>")
              .pasteString("- responsiveness v1.0.0 installed.<br/>")
              .pasteString("- user experience v1.0.0 installed.<br/>")
              .pasteString("- social media v1.0.0 installed.<br/>")
              .pasteString("- analytics v1.0.0 installed.<br/>")
              .pasteString("- testing v1.0.0 installed.<br/>")
              .pasteString("- deployment v1.0.0 installed.<br/>")
              .pasteString("- maintenance v1.0.0 installed.<br/>")
              .pasteString("- support v1.0.0 installed.<br/>")
              .pasteString(`Make website accessible? (y/n)<br/>`)
              .typeString("> y<br/>")
              .typeString("finalizing...<br/>")
              .typeString("Welcome!<br/>")
              .start();
          }}
        />
      </div>
      <div
        style={{
          content: "",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 100,
          // backgroundColor: "rgba(0, 0, 0, 0.5)",
          background:
            "repeating-linear-gradient(rgba(black, 0.15), rgba(black, 0.15) 2px, transparent 1px, transparent 2px)",
          // background:
          //   "repeating-linear-gradient(0deg,rgba(black, 0.15),rgba(black, 0.15) 1px,transparent 1px,transparent 2px)",
        }}
      ></div>
    </div>
  );
};

export default Loader;
