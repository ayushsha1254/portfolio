import React, { useState } from "react";
import style from "./button.module.css";
import { AiOutlineSend, AiOutlineCheck } from "react-icons/ai";

const SendButton = ({ setShow }) => {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleClick = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        document.getElementById("close-modal").click();
        // setShow(false);
      }, 2500);
    }, 2000);
  };
  return (
    <button
      onClick={handleClick}
      className={`${style.button} ${
        isSending || isSent ? ` ${style.sending}` : ""
      }`}
    >
      <div className={style.icon}>
        {isSent ? <AiOutlineCheck /> : <AiOutlineSend />}
      </div>
      <div className={style.text}>
        {isSending ? "Sending..." : isSent ? "Sent" : "Send Message"}
      </div>
    </button>
  );
};

export default SendButton;
