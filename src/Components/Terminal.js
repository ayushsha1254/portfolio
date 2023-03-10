import { ReactTerminal } from "react-terminal";
import { useRef } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import "./animate.css";
import { useDispatch } from "react-redux";
import { toggleTerminal } from "../Utility/state/action";
import waitForUserInput from "wait-for-user-input";
// import { useDispatch } from "react-redux";
function App(props) {
  //   console.log("here");
  //   const terminalRef = useRef(null);
  //   terminalRef.style.height = "100vh";
  //   console.log(terminalRef);
  const dispatch = useDispatch();
  // Define commands here
  const [ip, setIP] = useState("");
  const [path, setPath] = useState("");
  const [directory, setDirectory] = useState("/");
  //creating function to load ip address from the API
  const getData = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    console.log(res.data);
    setIP(res.data.IPv4);
  };
  useEffect(() => {
    //passing getData method to the lifecycle method
    getData();
  }, []);
  useEffect(() => {
    setPath(`user@${ip}:~${directory}$`);
  }, [ip, directory]);

  const mail = async (name, email, subj) => {
    // const input = await waitForUserInput("do you agree?");
    // console.log(input);
    if (!name || !email || !subj) return "Please enter all the fields";
    return `Connecting to ${name} at ${email} for ${subj}...`;
  };
  const commands = {
    whoami: "Rishit Shivesh",
    cd: (directory) => {
      setDirectory(directory + "/");
      return `changed path to ${directory}`;
    },
    ls: ["file1", "file2", "file3"],
    cat: (file) => `contents of ${file}`,
    echo: (message) => message,
    email: () => "Connecting...",
    hello: () => "Hello to you my Friend!",
    abc: () => {
      return "abc";
    },
    herethere: () => {
      return "herethere";
    },
    mail: (name) => (email) => (subj) => mail(name, email, subj),
    nl: () => {
      return (
        <div>
          <span className="text-red-500">Welcome,</span>
          <br />
          Hello
          <br />
          There
        </div>
      );
    },
    contact: (str) => mail(...str.split(" ")),
    // mail: (name) => mail(name, ""),
  };
  //   useEffect(() => {
  //     // document.querySelector(".react-terminal").style.height = "100vh";
  //     const el = document.getElementById("#index_terminalContainer__4seT6");
  //     if (el) {
  //       el.style.height = "100vh";
  //     }
  //   }, []);
  return (
    <div className="transition-all absolute top-0 z-[300] flex flex-row justify-center place-items-center w-[100vw] h-[100vh] overflow-hidden scrollbar bg-[#ffffff10] backdrop-blur-sm">
      <div
        id="terminal-div"
        className="slide-in-blurred-bottom relative w-[70%] h-[80%] scrollbar flex flex-col pt-[4vh]"
      >
        <div className="absolute top-0 w-full h-[4vh] bg-[#ffffff20] rounded-t-xl flex flex-row px-4 place-items-center text-white font-bold justify-between">
          Terminal
          <div
            className="w-[1rem] h-[1rem] rounded-full bg-[#ff0000] cursor-pointer"
            onClick={() => {
              var el = document.getElementById("terminal-div");
              el.classList.remove("slide-in-blurred-bottom");
              el.classList.add("slide-out-blurred-bottom");
              setTimeout(() => {
                // props.setTerminal(false);
                dispatch(toggleTerminal());
              }, 500);
            }}
          ></div>
        </div>
        <ReactTerminal
          className="w-full min-h-[100vh] scrollbar object-cover"
          height="100vh"
          commands={commands}
          showControlButtons={false}
          showControlBar={false}
          style={{
            width: "100%",
            height: "100vh",
          }}
          //   welcomeMessage="Welcome to Rishit Shivesh's Terminal"
          prompt={path}
          errorMessage="error! command not found"
          themes={{
            "my-custom-theme": {
              themeBGColor: "#272B36",
              themeToolbarColor: "#DBDBDB",
              themeColor: "#FFFEFC",
              themePromptColor: "#a917a8",
              navbarBGColor: "#272B36",
              minHeight: "100vh",
              innerHeight: "100vh",
            },
          }}
          theme="matrix"
        />
      </div>
    </div>
  );
}

export default App;
