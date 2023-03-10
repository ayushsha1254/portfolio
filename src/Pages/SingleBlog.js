import React, { useEffect } from "react";
import { CgClose } from "react-icons/cg";
import { useNavigate, useParams } from "react-router";
import icon from "../Assets/Player/icon.webp";
import { SiBloglovin } from "react-icons/si";
import Nav from "../Components/Blog/Nav";
import { useSelector, useDispatch } from "react-redux";
import star from "../Assets/Theme/star.svg";
import day from "../Assets/Theme/day.jpg";
import data from "../Data/main.json";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { FiShare } from "react-icons/fi";
import { BiBookReader } from "react-icons/bi";
import "../Components/Blog/blog.css";
import {
  IoMail,
  IoCall,
  IoLogoLinkedin,
  IoLogoGithub,
  IoLocation,
} from "react-icons/io5";
import {
  FaTwitter,
  FaFacebook,
  FaReddit,
  FaLinkedin,
  FaWhatsapp,
  FaTelegram,
} from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";

import mail from "../Assets/Icons/blogs/mail.svg";
import wa from "../Assets/Icons/blogs/wa.svg";
import fb from "../Assets/Icons/blogs/fb.svg";
import tw from "../Assets/Icons/blogs/tw.svg";
import li from "../Assets/Icons/blogs/li.svg";
import rt from "../Assets/Icons/blogs/rt.svg";
import tg from "../Assets/Icons/blogs/tg.svg";
import blogLogo from "../Assets/Icons/blog.svg";

import Loader from "./LoadingAnimation";

import "react-toastify/dist/ReactToastify.css";
import axios from "../Utility/Axios/axios";

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
  // const posts = data["blog"];
  const { id } = useParams();
  // const post = posts.find((post) => post?.id == id);
  const [post, setPost] = React.useState({});
  useEffect(() => {
    const post = axios.get(`/blogs/${id}`).then((res) => {
      setPost(res.data.data);
    });
    console.log(id, post);
  }, []);
  //   //   const rawContentState = convertToRaw(post.body);
  const markup = draftToHtml(post?.body);
  //   console.log(markup);
  const link = window.location.href;
  const buttons = [
    {
      icon: mail,
      name: "Mail",
      link: `mailto:?subject=${post?.title}&body=${link}`,
    },
    {
      icon: wa,
      name: "Whatsapp",
      link: `https://wa.me/?text=${link}`,
    },
    {
      icon: fb,
      name: "Facebook",
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        link
      )}`,
    },
    {
      icon: tw,
      name: "Twitter",
      link: `https://twitter.com/intent/tweet?text=${link}`,
    },
    {
      icon: li,
      name: "Linkedin",
      link: `https://www.linkedin.com/shareArticle?url=h${link}`,
    },
    {
      icon: rt,
      name: "Reddit",
      link: `https://www.reddit.com/submit?url=${link}&title=Check this out!`,
    },
    {
      icon: tg,
      name: "Telegram",
      link: `https://t.me/share/url?url=${link}&text=${post?.title}`,
    },
  ];
  return (
    <>
      {post?.title ? (
        <div className="max-h-[100vh] overflow-hidden">
          <div className="flex flex-row  bg-[#272727]">
            <div className="flex flex-col basis-[20%] w-[20vw] h-[100vh] overflow-y-scroll pt-4">
              {/* <div className="font-[Monoton] text-[3rem] text-white z-[100] text-center">
            {data.logo}
          </div> */}

              <div className="flex flex-row justify-center items-center w-full gap-x-5">
                {/* <div className="font-[Monoton] text-[4rem] text-white z-[100] text-center">
              {data.logo}
            </div> */}
                <img src={blogLogo} className="w-[100px]" />
              </div>
              <div className="font-Helvetica text-white text-center text-[1.5rem] mt-3">
                Blog
              </div>
              <div>
                <div className="text-center gap-y-5 transition-all backdrop-blur-md rounded-md h-max text-white p-4 text-lg flex flex-col">
                  Share
                  {/* <div className="flex flex-col gap-y-6 justify-evenly text-2xl">
                <div
                  className="cursor-pointer hover:text-[#128C7E] transition-all"
                  onClick={() => {
                    window.open(`https://wa.me/?text=${link}`);
                  }}
                >
                  <FaWhatsapp />
                </div>
                <div
                  className="cursor-pointer hover:text-[#0077b5] transition-all"
                  onClick={() => {
                    window.open(
                      `https://www.linkedin.com/shareArticle?url=h${link}`
                    );
                  }}
                >
                  <FaLinkedin />
                </div>

                <div
                  className="cursor-pointer hover:text-[#afcbff] transition-all"
                  onClick={() => {
                    window.open(`mailto:?subject=${post?.title}&body=${link}`);
                  }}
                >
                  <IoMail />
                </div>
                <div
                  className="cursor-pointer hover:text-[#00acee] transition-all"
                  onClick={() => {
                    window.open(
                      `https://twitter.com/intent/tweet?text=${link}`
                    );
                  }}
                >
                  <FaTwitter />
                </div>
                <div
                  className="cursor-pointer hover:text-[#3b5998] transition-all"
                  onClick={() => {
                    //   create a window object and open the facebook share link with encoded url
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        link
                      )}`
                    );
                  }}
                >
                  <FaFacebook />
                </div>

                <div
                  className="cursor-pointer hover:text-[#FF8700] transition-all"
                  onClick={() => {
                    window.open(
                      `https://www.reddit.com/submit?url=${link}&title=Check this out!`
                    );
                  }}
                >
                  <FaReddit />
                </div>

                <div
                  className="cursor-pointer hover:text-[#2AABEE] transition-all"
                  onClick={() => {
                    //   create a window object and open the facebook share link with encoded url
                    window.open(`https://t.me/share/url?url=${link}`);
                  }}
                >
                  <FaTelegram />
                </div>
              </div> */}
                  <div className="flex flex-col gap-y-6 justify-evenly text-2xl">
                    {buttons.map((button) => (
                      <div className="cursor-pointer  transition-all flex flex-row justify-between items-center">
                        <div className="flex flex-row justify-start gap-x-5">
                          <img src={button.icon} />
                          <div className="text-lg text-left">{button.name}</div>
                        </div>
                        <div
                          className="px-4 py-2 text-sm rounded-3xl bg-[#5a9bf7] hover:bg-[#5a9bf790] transition-all text-white"
                          onClick={() => {
                            window.open(button.link);
                          }}
                        >
                          Share
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-lg text-center">Link to this page</div>
                  <div className="flex flex-row justify-between items-center">
                    <input
                      value={link}
                      disabled
                      className="text-sm w-[90%] bg-[#2b323c] p-2 rounded-3xl"
                    />
                    <div
                      className="cursor-pointer hover:text-[#ffffff80] transition-all"
                      onClick={() => {
                        navigator.clipboard.writeText(link);
                        toast.info("Copied To Clipboard!", {
                          position: "bottom-center",
                          autoClose: 1000,
                          hideProgressBar: true,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "dark",
                        });
                      }}
                    >
                      <IoCopyOutline />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="flex flex-col basis-[80%] pt-4 max-h-[100vh]"
              style={{
                backgroundImage: state.theme ? `url(${star})` : `url(${day})`,
              }}
            >
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
                single={true}
              />

              <div
                className="max-h-[90vh] overflow-y-scroll flex flex-col place-items-center w-full gap-2 pb-16 text-white scroll-smooth"
                id="blog-post"
              >
                <div className="w-[90%] mx-auto py-5">
                  <div className="font-bold text-3xl  mb-5">{post?.title}</div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: markup,
                    }}
                    style={{
                      color: "white!important",
                    }}
                    className="opacity-80 text-white white text-justify backdrop-blur-md"
                  ></div>
                  <div className="mt-10 text-center flex flex-col">
                    <span className="opacity-50">
                      Published {new Date(post?.date).toDateString()} IST
                    </span>

                    <span className="opacity-60">by {post?.author}</span>
                    <span
                      className="text-[#2F9FF8] cursor-pointer transition-all hover:underline"
                      onClick={() => {
                        const doc = document.getElementById("blog-post");
                        doc.scrollTop = 0;
                      }}
                    >
                      Back to Top
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Blog;
