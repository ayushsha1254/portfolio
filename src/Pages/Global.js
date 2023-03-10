import React from "react";
import Finder from "../Components/Finder";
import Explorer from "../Components/ExpandedExplorer";
import { useSelector } from "react-redux";
import Display from "../Components/Explorer/Certificates/CertModal";
import { useDispatch } from "react-redux";
import {
  toggleExplorer,
  setExplorer,
  toggleTerminal,
} from "../Utility/state/action";
import { useEffect } from "react";
import Terminal from "../Components/Terminal";
import SIH from "../Components/Explorer/SIH";
import Help from "../Components/Help";
import Viewer from "../Components/Gallery/Viewer";
import { View } from "parallax-controller";
const Global = ({ children, help, setHelp, certifications, skills }) => {
  const state = useSelector((state) => state);
  const [cert, setCert] = React.useState(false);
  const [certdata, setCertData] = React.useState(undefined);
  const [keepExplorer, setKeepExplorer] = React.useState(false);
  const [nowItem, setNowItem] = React.useState(undefined);
  const dispatch = useDispatch();
  const [terminal, setTerminal] = React.useState(false);
  const [show, setShow] = React.useState(false);
  // useEffect(()=>{})
  // useEffect(() => {
  //   if (state.terminal) {
  //     setTerminal(true);
  //   } else {
  //     setTerminal(false);
  //   }
  // }, [state.terminal]);
  // useEffect(() => {
  //   if (!terminal && state.terminal) {
  //     dispatch(setExplorer(false));
  //     setNowItem(undefined);
  //     dispatch(toggleTerminal());
  //   }
  // }, [terminal]);
  // useEffect(() => {
  //   if (state.lock && terminal) {
  //     setTerminal(false);
  //   }
  // });
  const [gallery, setGallery] = React.useState([]);
  const [project, setProject] = React.useState({});
  const [index, setIndex] = React.useState(0);
  const [showGallery, setShowGallery] = React.useState(false);
  useEffect(() => {
    if (cert && state.explorer) {
      dispatch(setExplorer(false));
      setNowItem(undefined);
    } else if (!cert && keepExplorer) {
      dispatch(setExplorer(true));
      setNowItem("certifications");
    } else if (!cert && !keepExplorer) {
      dispatch(setExplorer(false));
      setNowItem(undefined);
    }
  }, [cert]);

  useEffect(() => {
    if (showGallery && state.explorer) {
      dispatch(setExplorer(false));
      setNowItem(undefined);
    } else if (!showGallery && keepExplorer) {
      dispatch(setExplorer(true));
      setNowItem("projects");
    } else if (!showGallery && !keepExplorer) {
      dispatch(setExplorer(false));
      setNowItem(undefined);
    }
  }, [showGallery]);

  return (
    <>
      <div className="relative">{show ? <SIH setShow={setShow} /> : null}</div>
      {state.explorer ? (
        <Explorer
          setCert={setCert}
          setCertData={setCertData}
          nowItem={nowItem}
          journey={show}
          setJourney={setShow}
          certifications={certifications}
          skills={skills}
          setGallery={setGallery}
          setProject={setProject}
          setIndex={setIndex}
          setShowGallery={setShowGallery}
        />
      ) : null}
      {cert ? (
        <Display
          data={certdata}
          show={cert}
          setShow={setCert}
          setKeepExplorer={setKeepExplorer}
        />
      ) : null}
      {showGallery ? (
        <Viewer
          gallery={gallery}
          setGallery={setGallery}
          project={project}
          setProject={setProject}
          index={index}
          setIndex={setIndex}
          show={showGallery}
          setShow={setShowGallery}
          setKeepExplorer={setKeepExplorer}
        />
      ) : null}
      {help ? <Help help={help} setHelp={setHelp} /> : null}
      {/* <Help /> */}
      {state.terminal ? <Terminal /> : null}
      <div className="z-[280] absolute top-0">
        {state.finder ? <Finder finder={state.finder} /> : null}
      </div>
      {children}
    </>
  );
};

export default Global;
