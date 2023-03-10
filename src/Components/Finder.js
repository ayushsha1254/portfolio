import React from "react";
import styles from "./finder.module.css";
import Apps from "./Apps";
import { useSelector } from "react-redux";
const Finder = () => {
  const state = useSelector((state) => state);
  return (
    <div className="w-[100vw] h-[80vh] flex flex-row justify-center">
      <div
        id="finder"
        className={
          `${
            state.finder ? "block" : "hidden"
          } w-[80vw] h-[80vh] bg-[#ffffff20] mx-auto dark:bg-[#0f0f0f60] backdrop-blur-lg transition-all duration-500 rounded-xl ` +
          styles.modal
        }
      >
        <div>
          <Apps />
        </div>
      </div>
    </div>
  );
};

export default Finder;
