import React from "react";
import { CgClose } from "react-icons/cg";
import { useNavigate } from "react-router";
import icon from "../Assets/Player/icon.webp";
import { SiBloglovin } from "react-icons/si";
import Nav from "../Components/Blog/Nav";
import { useSelector, useDispatch } from "react-redux";
import star from "../Assets/Theme/star.svg";
import day from "../Assets/Theme/day.jpg";
// import data from "../Data/main.json";
import LoadingAnimation from "./LoadingAnimation";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { FiShare } from "react-icons/fi";
import { BiBookReader } from "react-icons/bi";
import { Fade } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Moment from "react-moment";
// import { moment } from "react-moment";
import moment from "moment";
import { useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { MdOutlineArrowUpward, MdOutlineArrowDownward } from "react-icons/md";
// import { purple, red, blueGrey } from "@mui/material/colors";
import blogLogo from "../Assets/Icons/blog.svg";
import { SlArrowDown } from "react-icons/sl";
import axios from "../Utility/Axios/axios";
// import Battery from "Battery";
const Blog = (
  setTheme,
  lock,
  setLock,
  help,
  setHelp,
  nowPlaying,
  playing,
  musicStop,
  notifications
) => {
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const link = window.location.href;

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // const posts = data["blog"].sort(
  //   (a, b) => new Date(b.date) - new Date(a.date)
  // );
  const [posts, setPosts] = React.useState([]);
  useEffect(() => {
    const getBlogs = async () => {
      const blogs = await axios.get("/blogs");
      setPosts(
        blogs.data.data.sort((a, b) => new Date(b.date) - new Date(a.date))
      );
    };
    getBlogs();

    // const blogs = axios.get("/blogs").then((res) => {
    //   // console.log(res.data);
    //   setPosts(res.data.data);
    // });
  }, []);

  // console.log(posts);

  console.log(posts);
  const getDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;

    if (diff < 1) return "Today";
    else return `${Math.floor(diff / (1000 * 60 * 60 * 24))} days ago`;
  };
  const [group, setGroup] = React.useState({});
  const [timeline, setTimeline] = React.useState([]);
  useEffect(() => {
    let res = {};

    posts.forEach((item) => {
      let month = moment(item.date).startOf("month");
      res[month] = res[month] || 0;
      res[month]++;
    });
    // console.log(res);
    setGroup(res);
  }, [posts]);
  useEffect(() => {
    let res = {};
    Object.keys(group).forEach((item) => {
      // let d = new Date(item);\
      let d = moment(item).format("MMMM YYYY").split(" ");
      res = { ...res, [d[1]]: { ...res[d[1]], [d[0]]: group[item] } };
    });
    setTimeline(res);
  }, [group, posts]);
  console.log(timeline);
  const [filterMonth, setFilterMonth] = React.useState();
  const [filterData, setFilterData] = React.useState([]);

  useEffect(() => {
    if (filterMonth) {
      let res = posts.filter((item) => {
        let d = new Date(item.date);
        let from = new Date(filterMonth.from);
        let to = new Date(filterMonth.to);
        return d >= from && d <= to;
      });
      setFilterData(res);
    } else {
      setFilterData(posts);
    }
  }, [posts, filterMonth]);
  console.log(filterData);
  // console.log(Battery);
  // console.log(navigator.getBattery().then((battery) => console.log(battery)));
  return (
    <>
      {posts.length === 0 ? (
        <LoadingAnimation />
      ) : (
        <div className="max-h-[100vh] overflow-hidden">
          {/* <div className="w-full h-[5vh] bg-[#00000170] flex flex-row justify-between place-items-center px-3 py-1 font-[Consolas]">
        <div className="flex flex-row place-items-center justify-center gap-x-2">
          <SiBloglovin />
          <div className=" font-[Modeseven]">//host/var/www/bin/Blog.app</div>
        </div>
        <div className="flex flex-row gap-x-2">
          
          <div
            className="p-1 bg-[#4f4f4f] rounded-lg text-white hover:bg-[#432929] active:bg-[#712121] transition-all cursor-pointer"
            onClick={() => {
              //   ref.current.stop();
              //   // props.setSeek(0);
              //   props.setProgress(0);
              //   props.setPlaying(false);
              //   // props.setDuration(0);
              navigate("/");
            }}
          >
            <CgClose />
          </div>
        </div>
      </div> */}
          {/* <div className="bg-[#272727]"></div> */}
          {/* <Battery /> */}
          <div className="flex flex-row  bg-[#272727]">
            <div className="flex flex-col basis-[20%] w-[20vw] h-[100vh] overflow-y-scroll pt-4">
              <div className="flex flex-row justify-center items-center w-full gap-x-5">
                {/* <div className="font-[Monoton] text-[4rem] text-white z-[100] text-center">
              {data.logo}
            </div> */}
                <img src={blogLogo} className="w-[100px]" />
              </div>

              <div className="font-Helvetica text-white text-center text-[1.5rem] mt-4">
                Blog
              </div>
              <hr className="opacity-50 w-[95%] mx-auto mt-5" />
              <div className="p-4">
                <div className="text-center text-white text-lg py-5">
                  Filter Posts
                </div>
                <div className="max-h-[50vh] overflow-y-scroll">
                  {Object.keys(timeline)
                    .reverse()
                    .map((item, idx) => (
                      <div className="flex flex-col gap-y-2">
                        <Accordion
                          expanded={expanded === `panel${idx}`}
                          onChange={handleChange(`panel${idx}`)}
                          sx={{
                            width: "100%",
                            backgroundColor: "#ffffff50",
                            gap: "10px",
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<SlArrowDown />}
                            aria-controls={`panel${idx}bh-content`}
                            id={`panel${idx}bh-header`}
                          >
                            <Typography
                              sx={{
                                width: "33%",
                                flexShrink: 0,
                                color: "white",
                              }}
                            >
                              {item}
                            </Typography>
                            {/* <Typography sx={{ color: 'text.secondary' }}>I am an accordion</Typography> */}
                          </AccordionSummary>
                          {Object.keys(timeline[item]).map((month) => (
                            <div className="flex flex-col gap-y-2">
                              <AccordionDetails
                                className="flex flex-row mt-2 justify-between place-items-center w-full cursor-pointer group bg-[#ffffff40] backdrop-blur-md transition-all"
                                style={{}}
                                onClick={() => {
                                  setFilterMonth({
                                    from: `${item}-${month}-01`,
                                    to: `${item}-${month}-31`,
                                    label: `${month}, ${item}`,
                                  });
                                }}
                              >
                                <Typography className="text-white transition-all ">
                                  {month}
                                </Typography>
                                <Typography
                                  className="my-auto"
                                  sx={{
                                    fontSize: "12px",
                                    color: "text.secondary",
                                  }}
                                >
                                  {timeline[item][month]} posts
                                </Typography>
                              </AccordionDetails>
                            </div>
                          ))}
                        </Accordion>
                      </div>
                    ))}
                </div>
                <div
                  className="text-sm text-white hover:opacity-70 transition-all cursor-pointer p-2 mb-4 text-right"
                  onClick={() => {
                    setFilterMonth();
                    setExpanded(false);
                  }}
                >
                  Clear Filter
                </div>
              </div>
            </div>
            <div
              className="flex flex-col basis-[80%] pt-4 max-h-[100vh]"
              style={{
                backgroundImage: state.theme ? `url(${star})` : `url(${day})`,
                backgroundSize: "cover",
              }}
            >
              <ToastContainer
                position="bottom-center"
                autoClose={1500}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
              />
              <Nav
                theme={state.theme}
                setTheme={setTheme}
                lock={lock}
                setLock={setLock}
                help={help}
                setHelp={setHelp}
                playing={playing}
                nowPlaying={nowPlaying}
                musicStop={musicStop}
                notifications={notifications}
              />

              <div className="max-h-[90vh] overflow-y-scroll flex flex-col place-items-center w-full gap-2 pb-16">
                {filterMonth ? (
                  <div className="text-center text-lg my-5 text-white">
                    Showing posts for {filterMonth.label}
                  </div>
                ) : null}
                {filterData && filterData.length >= 1 && (
                  <>
                    <Fade in out left cascade timeout={1000}>
                      <div className="bg-[#ffffff20] backdrop-blur-md  text-white w-[91%] rounded-lg p-6 flex flex-col justify-between">
                        <div>
                          <div className="font-bold text-xl">
                            {filterData[0]?.title}
                          </div>
                          <div className="max-h-[200px] text-ellipsis opacity-70 mt-5">
                            {filterData[0]?.raw.substring(0, 500) + "..."}
                          </div>
                        </div>

                        <div className="flex flex-row justify-between">
                          <div className="flex flex-row gap-x-5  opacity-40">
                            {filterData[0]?.author}
                            <Moment fromNow>{filterData[0]?.date}</Moment>
                          </div>
                          <div className="flex flex-row gap-x-5 justify-center">
                            <div
                              className="flex flex-row justify-center gap-x-2 place-items-center opacity-40 hover:opacity-80 cursor-pointer transition-all"
                              // onClick={() => {
                              //   navigator.clipboard.writeText(link + "/" + posts[0].id);
                              //   toast.info("Copied To Clipboard!", {
                              //     position: "bottom-center",
                              //     autoClose: 1000,
                              //     hideProgressBar: true,
                              //     closeOnClick: true,
                              //     pauseOnHover: true,
                              //     draggable: true,
                              //     progress: undefined,
                              //     theme: "dark",
                              //   });
                              // }}
                              onClick={() => {
                                navigator.share({
                                  title: `Check out ${filterData[0]?.title} by ${filterData[0]?.author}`,
                                  text:
                                    filterData[0]?.raw.substring(0, 200) +
                                    "... \n\nRead More at",
                                  url: link + "/" + filterData[0]?.id,
                                });
                              }}
                            >
                              <FiShare />
                              Share
                            </div>
                            <div
                              className="flex flex-row justify-center gap-x-2 place-items-center opacity-40 hover:opacity-80 cursor-pointer transition-all"
                              onClick={() => {
                                navigate("/blog/" + filterData[0]?.id);
                              }}
                            >
                              <BiBookReader />
                              Read More
                            </div>
                          </div>
                        </div>
                      </div>
                    </Fade>
                    <Fade in={true} out={true} bottom cascade timeout={1500}>
                      <div className="flex flex-row flex-wrap w-full justify-center gap-2">
                        {filterData.map((post, idx) => {
                          if (idx != 0)
                            return (
                              <div className="bg-[#ffffff20] bg-blur-md text-white w-[45%] p-5 rounded-lg flex flex-col backdrop-blur-md justify-between ">
                                <div>
                                  <div className="font-bold text-lg">
                                    {post.title}
                                  </div>
                                  <div className="max-h-[200px] text-ellipsis overflow-hidden opacity-60 mt-5">
                                    {post.raw.substring(0, 400) + "..."}
                                  </div>
                                </div>

                                <div className="flex flex-row justify-between">
                                  <div className="flex flex-row gap-x-5  opacity-40">
                                    {post.author}

                                    <Moment fromNow>{post.date}</Moment>
                                  </div>
                                  <div className="flex flex-row gap-x-5 justify-center">
                                    <div
                                      className="flex flex-row justify-center gap-x-2 place-items-center opacity-40 hover:opacity-80 cursor-pointer transition-all"
                                      // onClick={() => {
                                      //   navigator.clipboard.writeText(
                                      //     link + "/" + post.id
                                      //   );
                                      //   toast.info("Copied To Clipboard!", {
                                      //     position: "bottom-center",
                                      //     autoClose: 1000,
                                      //     hideProgressBar: true,
                                      //     closeOnClick: true,
                                      //     pauseOnHover: true,
                                      //     draggable: true,
                                      //     progress: undefined,
                                      //     theme: "dark",
                                      //   });
                                      // }}
                                      onClick={() => {
                                        navigator.share({
                                          title: `Check out ${post.title} by ${post.author}`,
                                          text:
                                            post.raw.substring(0, 200) +
                                            "... \n\nRead More at",
                                          url: link + "/" + post.id,
                                        });
                                      }}
                                    >
                                      <FiShare />
                                      Share
                                    </div>
                                    <div
                                      className="flex flex-row justify-center gap-x-2 place-items-center opacity-40 hover:opacity-80 cursor-pointer transition-all"
                                      onClick={() => {
                                        navigate("/blog/" + post.id);
                                      }}
                                    >
                                      <BiBookReader />
                                      Read More
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                        })}
                      </div>
                    </Fade>
                    {/* <div dangerouslySetInnerHTML={{ __html: markup }}></div> */}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Blog;
