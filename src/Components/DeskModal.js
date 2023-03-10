import React from "react";
import styles from "./desk.module.css";
import Btn from "./SendButton";
import { AiFillCloseCircle } from "react-icons/ai";
const DeskModal = ({ show, setShow }) => {
  return (
    <div
      className="z-40 w-[100vw] h-[100vh] transition delay-700"
      style={{
        display: `${show ? "block" : "none"}`,
      }}
    >
      <div
        className={
          `ease-in-out dark:bg-[#303030] bg-white w-[100vw] h-[100vh] ` +
          styles.modal
        }
      >
        <button
          onClick={(e) => {
            e.target.parentElement.classList.remove(styles.modal);
            e.target.parentElement.classList.add(styles.modalClose);
            // console.log(e.target.parentElement.classList);
            setTimeout(() => {
              setShow(false);
              e.target.parentElement.classList.add(styles.modal);
              e.target.parentElement.classList.remove(styles.modalClose);
            }, 400);
            // setShow(!show);
          }}
          id="close-modal"
          className=" mr-2 mt-2 text-lg text-white float-right bg-red-500 font-sans rounded-full w-[25px] h-[25px] flex flex-row justify-center align-middle place-items-center"
        >
          X
        </button>
        <div className="mx-10 my-10 relative">
          <Btn setShow={setShow}></Btn>
        </div>
      </div>
    </div>
  );
};

export default DeskModal;
