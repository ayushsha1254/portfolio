import React, { useEffect } from "react";
import styles from "./finder.module.css";
import browsing from "../Assets/Theme/search.gif";
// import phone from "../Assets/Icons/phone.png";
const Apps = () => {
  const apps = [
    {
      name: "Phone",
      icon: "phone.png",
      link: "tel:+919667516345",
    },
    {
      name: "Mail",
      icon: "mail.png",
      link: "mailto:rishitshivesh@gmail.com",
    },
    {
      name: "Whatsapp",
      icon: "whatsapp.png",
      link: "https://wa.me/919667516345",
    },
    {
      name: "Github",
      icon: "github.png",
      link: "https://www.github.com/rishitshivesh",
    },
    {
      name: "Linkedin",
      icon: "linkedin.png",
      link: "https://www.linkedin.com/in/rishit-shivesh",
    },
    {
      name: "Resume",
      icon: "doc.png",
      link: "https://resume.rishitshivesh.co.in",
    },
  ];
  const [list, setList] = React.useState(apps);
  const [search, setSearch] = React.useState("");
  function check(Arr, n) {
    let s = n.toLowerCase();
    var pattern = new RegExp(".*" + s + ".*");
    return Arr.filter((obj) => {
      // console.log(obj.name.toLowerCase(), pattern.test(obj));
      return pattern.test(obj.name.toLowerCase());
    });
  }
  useEffect(() => {
    // console.log(search);
    if (search.length > 0 && check(apps, search)) {
      setList(check(apps, search));
    } else {
      setList(apps);
    }
  }, [search]);
  return (
    <div className="flex flex-col justify-center">
      <input
        autoFocus
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        className="mt-5 mx-auto w-1/2 h-10 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-gray-500 px-3"
      />
      <div className="w-full flex px-5 py-5 flex-row justify-center gap-x-5 mt-5">
        {/* <img src={browsing} className="w-[20vw]"></img> */}

        {list && list.length > 0 ? (
          list.map((app, idx) => {
            const img = require("../Assets/Icons/" + app.icon);
            // const img = require("../Assets/Icons/phone.png");
            return (
              <img
                src={img}
                className={"h-20 w-20 mx-2 cursor-pointer " + styles.taskitems}
                onClick={() => {
                  window.open(app.link);
                }}
                style={{
                  animationDelay: `${idx * 0.03}s`,
                }}
              />
            );
          })
        ) : (
          <img src={browsing} className="w-[20vw]"></img>
        )}
      </div>
    </div>
  );
};

export default Apps;
