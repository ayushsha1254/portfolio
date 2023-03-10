import React from "react";
import { CgClose } from "react-icons/cg";

import { useNavigate } from "react-router-dom";
import icon from "../Assets/Player/icon.webp";
import bg from "../Assets/Resume/bg.svg";
import logo from "../Assets/Resume/logo.svg";
import Fade from "react-reveal/Fade";
import data from "../Data/main.json";
import {
  IoMail,
  IoCall,
  IoLogoLinkedin,
  IoLogoGithub,
  IoLocation,
} from "react-icons/io5";
import { BsDot } from "react-icons/bs";
import { GrDocumentText } from "react-icons/gr";
import Menu, { Item as MenuItem } from "rc-menu";
import "rc-dropdown/assets/index.css";
import Dropdown from "rc-dropdown";
import {
  HiOutlineDocumentDownload,
  HiOutlineDocumentAdd,
  HiOutlineMail,
} from "react-icons/hi";
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

import "react-toastify/dist/ReactToastify.css";
const Resume = () => {
  const navigate = useNavigate();
  const [resumeData, setResumeData] = React.useState({});
  const [downloadOpen, setDownloadOpen] = React.useState(false);
  const [shareOpen, setShareOpen] = React.useState(false);
  const link = window.location.href;
  const text = "Hey! Check out Rishit Shivesh's Resume at " + link;

  async function downloadUsingFetch(data) {
    const image = await fetch(data);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    const anchor = document.createElement("a");
    anchor.href = imageURL;
    anchor.download = "Rishit";

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(imageURL);
  }

  React.useEffect(() => {
    setResumeData(data?.resume);
  }, [data]);
  console.log(resumeData);
  const menu = (
    <Menu
      style={{
        width: 270,
        height: 550,
        background: "transparent",
        border: "none",
        boxShadow: "none",
        overflow: "hidden",
      }}
      onOverlayClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDownloadOpen(true);
      }}
    >
      <div className=" transition-all w-[270px] justify-evenly bg-[#0f0f0f50] backdrop-blur-md rounded-md h-max text-white p-4 text-lg flex flex-row">
        <div
          className="flex flex-col justify-center place-items-center text-white hover:text-[#a4eca5] cursor-pointer transition-all"
          onClick={() => {
            downloadUsingFetch(resumeData?.thisresume);
          }}
        >
          <div className="text-3xl">
            <HiOutlineDocumentDownload />
          </div>
          <div className="text-sm">This Resume</div>
        </div>
        <div className="flex flex-col justify-center place-items-center text-white hover:text-[#a4eca5] cursor-pointer transition-all">
          <div className="text-3xl">
            <HiOutlineDocumentAdd />
          </div>
          <div className="text-sm">Basic Resume</div>
        </div>
      </div>
    </Menu>
  );
  const share = (
    <Menu
      style={{
        width: 300,
        height: 550,
        background: "transparent",
        border: "none",
        boxShadow: "none",
        overflow: "hidden",
      }}
      onOverlayClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShareOpen(true);
      }}
    >
      <div className="text-center gap-y-5 transition-all w-[300px] bg-[#0f0f0f50] backdrop-blur-md rounded-md h-max text-white p-4 text-lg flex flex-col">
        Share
        <div className="flex flex-row justify-evenly text-2xl">
          <div
            className="cursor-pointer hover:text-[#128C7E] transition-all"
            onClick={() => {
              window.open(`https://wa.me/?text=${text}`);
            }}
          >
            <FaWhatsapp />
          </div>
          <div
            className="cursor-pointer hover:text-[#0077b5] transition-all"
            onClick={() => {
              window.open(
                `https://www.linkedin.com/shareArticle?url=h${link}&title=Rishit Shivesh's Resume&summary=Check out Rishit Shivesh's Resume&source=LinkedIn`
              );
            }}
          >
            <FaLinkedin />
          </div>

          <div
            className="cursor-pointer hover:text-[#afcbff] transition-all"
            onClick={() => {
              window.open(
                `mailto:?subject=Rishit Shivesh's Resume&body=${text}`
              );
            }}
          >
            <IoMail />
          </div>
          <div
            className="cursor-pointer hover:text-[#00acee] transition-all"
            onClick={() => {
              window.open(`https://twitter.com/intent/tweet?text=${text}`);
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
                )}&quote=${text}`
              );
            }}
          >
            <FaFacebook />
          </div>

          <div
            className="cursor-pointer hover:text-[#FF8700] transition-all"
            onClick={() => {
              window.open(
                `https://www.reddit.com/submit?url=${text}&title=Check this out!`
              );
            }}
          >
            <FaReddit />
          </div>

          <div
            className="cursor-pointer hover:text-[#2AABEE] transition-all"
            onClick={() => {
              //   create a window object and open the facebook share link with encoded url
              window.open(`https://t.me/share/url?url=${link}&text=${text}`);
            }}
          >
            <FaTelegram />
          </div>
        </div>
        <div className="text-sm text-left">This Page</div>
        <div className="flex flex-row justify-between">
          <input value={link} disabled className="text-sm w-[90%] px-2" />
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
        <div className="text-sm text-left">This Resume</div>
        <div className="flex flex-row justify-between">
          <input
            value={resumeData?.thisresume}
            disabled
            className="text-sm w-[90%] px-2"
          />
          <div
            className="cursor-pointer hover:text-[#ffffff80] transition-all"
            onClick={() => {
              navigator.clipboard.writeText(resumeData?.thisresume);
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
        <div className="text-sm text-left">Basic Resume</div>
        <div className="flex flex-row justify-between">
          <input value={link} disabled className="text-sm w-[90%] px-2" />
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
    </Menu>
  );
  return (
    <div>
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
      <div className="w-full h-[5vh] bg-[#b9b2ac] flex flex-row justify-between place-items-center px-3 py-1 font-[Consolas] fixed z-[100]">
        <div className="flex flex-row place-items-center justify-center gap-x-2">
          {/* <img src={icon} className="object-fit w-[30px]" /> */}
          <GrDocumentText />
          <div className=" font-[Modeseven]">
            //host/var/www/bin/Resume.docx
          </div>
        </div>
        <div className="flex flex-row gap-x-2">
          {/* <div
            className="p-1 bg-[#4f4f4f] rounded-lg text-white hover:bg-[#5f5641] active:bg-[#947836] transition-all cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            <AiOutlineMinus />
          </div> */}
          <Dropdown
            id="control"
            trigger={["click"]}
            overlay={menu}
            animation="slide-up"
            onOverlayClick={(e) => {
              e.preventDefault();
            }}
            // alignPoint
          >
            <div
              onClick={() => {
                setDownloadOpen(true);
              }}
              className="p-1 bg-[#4f4f4f] rounded-lg text-white hover:bg-[#29432f] active:bg-[#217122] transition-all cursor-pointer"
            >
              {/* <span className="text-2xl mr-2">
            <AiFillControl />
          </span> */}
              Download
            </div>
          </Dropdown>
          {/* <div
            className="p-1 bg-[#4f4f4f] rounded-lg text-white hover:bg-[#29432f] active:bg-[#217122] transition-all cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            Download
          </div> */}
          <Dropdown
            id="control2"
            trigger={["click"]}
            overlay={share}
            animation="slide-up"
            onOverlayClick={(e) => {
              e.preventDefault();
            }}
            // alignPoint
          >
            <div
              onClick={() => {
                setShareOpen(true);
              }}
              className="p-1 bg-[#4f4f4f] rounded-lg text-white hover:bg-[#434329] active:bg-[#6a7121] transition-all cursor-pointer"
            >
              {/* <span className="text-2xl mr-2">
            <AiFillControl />
          </span> */}
              Share
            </div>
          </Dropdown>
          {/* <div
            className="p-1 bg-[#4f4f4f] rounded-lg text-white hover:bg-[#434329] active:bg-[#6a7121] transition-all cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            Share
          </div> */}
          <div
            className="p-1 bg-[#4f4f4f] rounded-lg text-white hover:bg-[#432929] active:bg-[#712121] transition-all cursor-pointer flex flex-row place-items-center justify-center gap-x-1"
            onClick={() => {
              navigate("/");
            }}
          >
            {/* <GrClose /> */}
            <CgClose />
          </div>
        </div>
      </div>
      <div
        className="min-h-[100vh] w-[100vw] bg-[#e8dfd7] flex flex-col pb-10 relative"
        // style={{
        //   backgroundImage: `url(${bg})`,
        // }}
      >
        <img
          src={bg}
          className=" fixed top-0 bottom-0 z-[70] w-[100vw] h-[100vh] object-cover bg-blend-overlay"
        />
        <div className="flex flex-col relative pt-10 mt-5">
          <Fade bottom>
            <div className="flex flex-col relative">
              <div className="font-fatface text-[100px] w-[92%] relative bg-[#bed1d9] pl-[390px] mx-auto flex flex-row">
                <div className="w-[150px] h-[5px] bg-[black] absolute rotate-90 left-[200px] top-[20px]"></div>
                <img
                  src={logo}
                  className="w-[150px] absolute left-[50px] bottom-0"
                ></img>
                {resumeData?.name?.split(" ")[0]}
              </div>
              <div className="font-fatface text-[100px] -mt-[37px] pl-[450px]">
                {resumeData?.name?.split(" ")[1]}
              </div>
              <div
                className="font-montserrat text-[50px] pl-[450px]"
                style={{
                  fontWeight: "500",
                  lineHeight: "110.5%",
                  letterSpacing: "4.12037px",
                  color: "#969696",
                }}
              >
                {resumeData?.subheading}
              </div>
            </div>
          </Fade>
        </div>
        <div className="flex flex-row justify-start w-[90%] mx-auto mt-24">
          <Fade left cascade>
            <div className="flex flex-col font-montserrat text-xl gap-y-4 border-[#969696] border-r-4 pr-5 z-[90]">
              <div className="flex flex-row place-items-center gap-x-4 w-[375px]">
                <div className="text-3xl">
                  <IoMail />
                </div>
                <a href={`mailto:${resumeData?.email}`}>{resumeData?.email}</a>
              </div>
              <div className="flex flex-row place-items-center gap-x-4">
                <div className="text-3xl">
                  <IoCall />
                </div>
                <a href={`tel:${resumeData?.phone}`}>{resumeData?.phone}</a>
              </div>
              <div className="flex flex-row place-items-center gap-x-4">
                <div className="text-3xl">
                  <IoLocation />
                </div>
                {resumeData?.location}
              </div>
              <div className="flex flex-row place-items-center gap-x-4">
                <div className="text-3xl">
                  <IoLogoGithub />
                </div>
                <a href={resumeData?.github} target="_blank">
                  {resumeData?.github?.split("//")[1]}
                </a>
              </div>
              <div className="flex flex-row place-items-center gap-x-4">
                <div className="text-3xl">
                  <IoLogoLinkedin />
                </div>
                <a href={resumeData?.linkedin} target="_blank">
                  {resumeData?.linkedin?.split("//")[1]}
                </a>
              </div>
            </div>
          </Fade>
          {/* <Fade right cascade> */}
          <div
            className="font-montserrat p-5 text-justify text-xl max-w-[80%]"
            style={{}}
          >
            {resumeData?.description}
          </div>
          {/* </Fade> */}
        </div>
        <div className="flex flex-row justify-start w-[90%] mx-auto mt-24">
          <Fade left cascade>
            <div className="flex flex-col font-montserrat text-xl gap-y-2 border-[#969696] w-[400px] border-r-4 pr-5">
              <div className="font-bold text-2xl">Skills</div>
              {resumeData?.skills?.map((skill) => {
                return (
                  <div className="flex flex-row gap-x-5 text-lg place-items-center">
                    <BsDot /> {skill}
                  </div>
                );
              })}
            </div>
          </Fade>
          <Fade right cascade>
            <div className="px-5 font-montserrat max-w-[60%]">
              <div className="font-bold text-2xl mb-5">Experience</div>

              <div className="flex flex-col gap-y-16">
                {resumeData?.experience?.map((exp) => {
                  return (
                    <div className="flex flex-row justify-start gap-x-5 text-left place-items-start font-montserrat ">
                      <div className="text-3xl text-[#202020] flex flex-col justify-start place-items-start">
                        <BsDot />
                      </div>
                      <div className="flex flex-col place-items-start justify-start">
                        <div className="font-bold text-2xl">{exp?.name}</div>
                        <div className="font-montserrat">{exp?.position}</div>
                        <div>{exp?.duration}</div>
                        <div className="text-xl text-justify">
                          {exp?.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Fade>
        </div>
        <div className="flex flex-row justify-start w-[90%] mx-auto mt-24">
          <Fade left cascade>
            <div className="flex flex-col font-montserrat text-xl gap-y-2 border-[#969696] w-[400px] border-r-4 pr-5">
              <div className="font-bold text-2xl">Soft Skills</div>
              {resumeData?.softskills?.map((skill) => {
                return (
                  <div className="flex flex-row gap-x-5 text-lg place-items-center">
                    <BsDot /> {skill}
                  </div>
                );
              })}
              <div className="font-bold text-2xl mt-24">Awards</div>
              {resumeData?.awards?.map((skill) => {
                return (
                  <div className="flex flex-row gap-x-5 text-lg place-items-center">
                    <BsDot /> {skill}
                  </div>
                );
              })}
            </div>
          </Fade>
          <Fade right cascade>
            <div className="px-5 font-montserrat max-w-[60%]">
              <div className="font-bold text-2xl mb-5">Education</div>

              <div className="flex flex-col gap-y-16">
                {resumeData?.education?.map((exp) => {
                  return (
                    <div className="flex flex-row justify-start gap-x-5 text-left place-items-start font-montserrat ">
                      <div className="text-3xl text-[#202020] flex flex-col justify-start place-items-start">
                        <BsDot />
                      </div>
                      <div className="flex flex-col place-items-start justify-start">
                        <div className="font-bold text-2xl">{exp?.degree}</div>
                        <div className="font-montserrat">{exp?.school}</div>
                        <div>{exp?.location}</div>

                        <div>{exp?.duration}</div>
                        <div className="text-xl text-justify">
                          {exp?.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Fade>
        </div>
        <div className="flex flex-row justify-start w-[90%] mx-auto mt-24">
          <Fade left cascade>
            <div className="flex flex-col font-montserrat text-xl gap-y-2 border-[#969696] w-[400px] border-r-4 pr-5">
              <div className="font-bold text-2xl">Languages</div>
              {resumeData?.languages?.map((skill) => {
                return (
                  <div className="flex flex-row gap-x-5 text-lg place-items-center">
                    <BsDot /> {skill}
                  </div>
                );
              })}
            </div>
          </Fade>
          <Fade right cascade>
            <div className="px-5 font-montserrat max-w-[60%]">
              <div className="font-bold text-2xl mb-5">Certificates</div>
              {/* <div className="font-bold text-2xl">Languages</div> */}

              <div className="flex flex-col gap-y-2">
                {data?.explorer?.certifications?.map((exp) => {
                  return (
                    <div className="flex flex-row justify-start gap-x-5 text-left place-items-start font-montserrat ">
                      <div className="text-3xl text-[#202020] flex flex-col justify-start place-items-start">
                        <BsDot />
                      </div>
                      <div className="text-lg">{exp.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Fade>
        </div>
      </div>
    </div>
  );
};

export default Resume;
