import React, { useState, useEffect } from "react";
import calendar from "../Assets/Images/calendar.svg";
import clock from "../Assets/Images/clock.svg";
const Datetime = ({ setMsg, setNotTime, setBattery }) => {
  const [date, setDate] = useState(new Date());
  //   console.log(date.getMonth());
  const [day, setDay] = useState(
    date.toUTCString().split(" ").slice(0, 4).join(" ")
  );
  function refreshClock() {
    setDate(new Date());
    // navigator.getBattery().then((battery) => setBattery(battery));
    // setBattery();
  }
  // useEffect(() => {
  //   setNotTime(date.toLocaleTimeString());
  // }, [date]);
  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000);

    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  function refreshBattery() {
    // setDate(new Date());
    navigator.getBattery().then((battery) => setBattery(battery));
    // setBattery();
  }
  // useEffect(() => {
  //   setNotTime(date.toLocaleTimeString());
  // }, [date]);
  useEffect(() => {
    const timerId = setInterval(refreshBattery, 5000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);
  useEffect(() => {
    if (setMsg) {
      const hour = date.getHours();
      setMsg(
        "Good " +
          ((hour < 12 && "Morning") ||
            (hour < 18 && "Afternoon") ||
            "Evening") +
          ", Friend!"
      );
    }
    // setBattery({ level: 0.5, charging: true });
  }, []);
  return (
    <div className="dark:bg-btn-darkNormal bg-btn-lightNormal rounded-xl w-[30vw] px-8 flex flex-row justify-around py-2 font-[Helvetica] text-white font-[300] xl:text-lg text-md">
      <div className="flex flex-row gap-x-3">
        <img src={calendar} className="h-6 w-6" />
        {day}
      </div>
      <div className="flex flex-row gap-x-3">
        <img src={clock} className="h-6 w-6" />
        {date.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default Datetime;
