import React, { CSSProperties, useEffect } from "react";
import "./Skill.css";
import project from "../../Assets/Icons/projects.svg";
import DisplayPanel from "./DisplayPanel";
import Folders from "./Folders";
import Contact from "./Contact";
import Pdf from "./Pdf";
import SingleCertificate from "./Certificates/SingleCertificate";
import SkillDisplay from "./SkillDisplay";
import SkillShort from "./SkillShort";
import { MdViewCompact } from "react-icons/md";
import { HiArrowsExpand } from "react-icons/hi";
import sih from "../../Assets/Projects/sih.svg";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CertCompact from "./Certificates/CertCompact";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import sihexe from "../../Assets/Icons/sih.svg";
import "./folder.css";
import Socials from "./Socials";
import About from "./About";
const ExplorerDisplay = ({
  data,
  item,
  setCert,
  setCertData,
  journey,
  setJourney,
  certifications,
  skills,
  setGallery,
  setProject,
  setIndex,
  setShowGallery,
}) => {
  console.log(data, item);
  const [display, setDisplay] = React.useState();
  const [filterData, setFilterData] = React.useState(undefined);
  const [allSkills, setAllSkills] = React.useState([]);
  const [mode, setMode] = React.useState("expand");

  function handleSkills(skills, category) {
    return skills.filter((skill) => skill.category.includes(category));
  }

  useEffect(() => {
    if (item == "skills") {
      let skills = [];
      // console.log("CODE", data);
      data.forEach((item) => {
        skills = skills.concat(...item.category);
      });
      setAllSkills([...new Set(skills)]);
      console.log(skills);
    }
    //   skills = skills.concat(...item.category);
    // });
  }, [data]);
  if (item == "projects")
    return (
      <div className="w-full flex flex-row flex-wrap overflow-auto">
        <div
          className={`${
            display ? "basis-1/2 max-w-[50%] " : " basis-full max-w-[100%] "
          } flex flex-col overflow-y-scroll transition`}
        >
          <div className="flex flex-row align-middle place-items-middle pb-5 transition-all">
            <img src={project} alt="project" />
            <span className="my-auto font-[Helvetica] text-xl ml-3 capitalize">
              {" "}
              {item}
            </span>
          </div>
          <div
            className={`flex flex-row flex-wrap gap-y-3 justify-around place-items-start overflow-y-scroll max-h-[55vh] min-h-[400px] transition-all scrollbar`}
          >
            {data.map((item) => {
              return (
                <div
                  className={`${display ? "basis-1/3" : "basis-1/5"} mt-5`}
                  onClick={() => {
                    setDisplay(item);
                  }}
                >
                  <Folders
                    name={item.name}
                    color={item.color}
                    logo={item.logo ? item.logo : null}
                    logourl={item.logourl ? item.logourl : null}
                    display={display?.name}
                  />
                </div>
              );
            })}
            {/* // <Folders name="Aaruush" color="#ef6522" logo="aaruush.svg" /> */}
          </div>
        </div>
        <div
          className={`overflow-y-scroll transition-none`}
          style={{
            flexBasis: display ? "50%" : "0%",
            maxWidth: display ? "50%" : "0%",
            display: display ? "block" : "none",
            opacity: display ? "1" : "0",
            transition: "none!important",
          }}
        >
          {display && (
            <DisplayPanel
              data={display}
              setDisplay={setDisplay}
              setGallery={setGallery}
              setProject={setProject}
              setIndex={setIndex}
              setShowGallery={setShowGallery}
            />
          )}
        </div>
      </div>
    );
  else if (item == "contact") {
    // console.log("contact");
    return (
      <div className="w-full h-full flex flex-row justify-center place-items-center">
        <Contact />
      </div>
    );
  } else if (item == "skills") {
    return (
      <>
        <div className="mb-2 mt-2 text-xl font-[Helvetica] flex flex-row justify-between place-items-center">
          <div>Skills</div>
          <div className="z-[100] flex flex-row gap-x-4">
            {/* <Label htmlFor="unnamed-select">Default</Label> */}
            <FormControl
              fullWidth
              margin="none"
              size="small"
              color="info"
              inputProps={{
                style: {
                  color: "white",
                },
              }}
              sx={{
                color: "white",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(228, 219, 233, 0.25)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(228, 219, 233, 0.25)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(228, 219, 233, 0.25)",
                },
                ".MuiSvgIcon-root ": {
                  fill: "white !important",
                },
              }}
            >
              <InputLabel
                id="demo-simple-select-label"
                labelStyle={{ color: "#ff0000" }}
                sx={{
                  color: "white",
                  fontSize: "0.8rem",
                  marginLeft: "0.3rem",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(228, 219, 233, 0.25)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(228, 219, 233, 0.25)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(228, 219, 233, 0.25)",
                  },
                  ".MuiSvgIcon-root ": {
                    fill: "white !important",
                  },
                }}
              >
                Filter By
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filterData}
                label="Filter By"
                onChange={(e) => {
                  setFilterData(e.target.value);
                }}
                defaultValue={false}
                color="primary"
                className="text-white"
                sx={{
                  color: "white",
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(228, 219, 233, 0.25)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(228, 219, 233, 0.25)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(228, 219, 233, 0.25)",
                  },
                  ".MuiSvgIcon-root ": {
                    fill: "white !important",
                  },
                }}
              >
                <MenuItem value={false}>None</MenuItem>
                {allSkills.map((skill) => {
                  return <MenuItem value={skill}>{skill}</MenuItem>;
                })}
                {/* <MenuItem value={10}>Ten</MenuItem> */}
              </Select>
            </FormControl>
            <div className="text-white flex flex-row">
              <Tooltip title="Expanded View">
                <IconButton>
                  <span
                    className={
                      mode == "expand"
                        ? "text-white"
                        : "text-gray-500" + " transition-all"
                    }
                    onClick={() => {
                      setMode("expand");
                    }}
                  >
                    <HiArrowsExpand />
                  </span>
                </IconButton>
              </Tooltip>
              <Tooltip title="Compact View">
                <IconButton>
                  <span
                    className={
                      mode == "compact"
                        ? "text-white"
                        : "text-gray-500" + " transition-all"
                    }
                    onClick={() => {
                      setMode("compact");
                    }}
                  >
                    <MdViewCompact />
                  </span>
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
        {mode == "expand" ? (
          <div className="w-full h-full flex flex-row flex-wrap transition-all justify-center place-items-center gap-y-4 scrollbar overflow-y-scroll py-2 pb-16">
            {filterData
              ? handleSkills(skills, filterData).map((item, idx) => {
                  return (
                    <div className="basis-1/2 relative overflow-hidden z-[15]">
                      <SkillDisplay data={item} key={idx} />
                      {/* <div
              className="w-full h-full skill absolute top-0 left-0"
              style={{
                "--color": item.color,
              }}
            ></div> */}
                    </div>
                  );
                })
              : skills.map((item, idx) => {
                  return (
                    <div className="basis-1/2 relative overflow-hidden z-[15]">
                      <SkillDisplay data={item} key={idx} />
                      {/* <div
                className="w-full h-full skill absolute top-0 left-0"
                style={{
                  "--color": item.color,
                }}
              ></div> */}
                    </div>
                  );
                })}
          </div>
        ) : (
          <div className="w-full h-full flex flex-row flex-wrap transition-all justify-start place-items-start gap-y-2 gap-x-2 pt-4 pb-16 scrollbar overflow-y-scroll px-5 ">
            {filterData
              ? handleSkills(skills, filterData).map((item, idx) => {
                  return (
                    <div className="relative overflow-hidden z-[15] flex-grow">
                      {/* <SkillShort data={item} key={idx} /> */}
                      <SkillShort data={item} key={idx} />

                      {/* <div
              className="w-full h-full skill absolute top-0 left-0"
              style={{
                "--color": item.color,
              }}
            ></div> */}
                    </div>
                  );
                })
              : skills.map((item, idx) => {
                  return (
                    <div className="relative overflow-hidden z-[15] flex-grow">
                      {/* <SkillShort data={item} key={idx} /> */}
                      <SkillShort data={item} key={idx} />

                      {/* <div
            className="w-full h-full skill absolute top-0 left-0"
            style={{
              "--color": item.color,
            }}
          ></div> */}
                    </div>
                  );
                })}
          </div>
        )}
      </>
    );
  } else if (item == "certifications") {
    console.log("certifications", data);
    return (
      <>
        <div className="mb-2 text-xl font-[Helvetica] flex flex-row justify-between place-items-center">
          <div>Certifications</div>
          <div className="text-white">
            <Tooltip title="Expanded View">
              <IconButton>
                <span
                  className={
                    mode == "expand"
                      ? "text-white"
                      : "text-gray-500" + " transition-all"
                  }
                  onClick={() => {
                    setMode("expand");
                  }}
                >
                  <HiArrowsExpand />
                </span>
              </IconButton>
            </Tooltip>
            <Tooltip title="Compact View">
              <IconButton>
                <span
                  className={
                    mode == "compact"
                      ? "text-white"
                      : "text-gray-500" + " transition-all"
                  }
                  onClick={() => {
                    setMode("compact");
                  }}
                >
                  <MdViewCompact />
                </span>
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className="w-full h-full flex flex-row justify-around pb-16 scrollbar gap-y-5 flex-wrap overflow-y-scroll">
          {mode == "expand"
            ? certifications.map((item) => {
                return (
                  <div className="transition-all">
                    <SingleCertificate
                      data={item}
                      setCert={setCert}
                      setCertData={setCertData}
                    />
                  </div>
                );
              })
            : certifications.map((item, idx) => {
                return (
                  <div className="transition-all w-full px-2">
                    <CertCompact
                      data={item}
                      setCert={setCert}
                      setCertData={setCertData}
                      key={idx}
                      idx={idx}
                    />
                  </div>
                );
              })}
          {/* {data.map((item) => {
          return (
            <div className="">
              <SingleCertificate
                data={item}
                setCert={setCert}
                setCertData={setCertData}
              />
            </div>
          );
        })} */}
        </div>
      </>
    );
  } else if (item == "achievements") {
    return (
      <div>
        <div
          onClick={() => {
            setJourney(true);
          }}
          className="text-white cursor-pointer hover:underline pt-5 flex flex-col w-[120px]"
        >
          <img src={sihexe} className="w-[100px] mx-auto" />
          <p className="text-center">SIH.exe</p>
          {/* <div className="font-[Helvetica] cursor-pointer transition-all w-[150px]">
            <div
              className={`relative w-[150px] flex flex-col bg-red-100 text-white justify-start place-items-start text-xl mb-2 transition-all mx-auto`}
              // data-color={'#ef6522}
            >
              <img src={sihexe} className=""></img>

              {sih ? (
                <img
                  src={sih}
                  alt="logo"
                  className="w-[80%] h-[80%] absolute bottom-0 right-0 opacity-30"
                />
              ) : null}
            </div>
            <div className="text-center ">SIH 22.exe</div>
          </div> */}
          {/* View SIH */}
        </div>
      </div>
    );
  } else if (item == "social") {
    return (
      <div>
        <div className="mb-2 text-xl font-[Helvetica] flex flex-row justify-between place-items-center">
          <div>Socials</div>
        </div>
        <Socials />
      </div>
    );
  } else if (item == "about") {
    return (
      <div className="h-full">
        <About data={data} />
      </div>
    );
  } else
    return (
      <div>
        <div>{item}</div>

        {JSON.stringify(data)}
      </div>
    );
};

export default ExplorerDisplay;
