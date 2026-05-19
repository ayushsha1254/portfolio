import React from "react";
import Finder from "../Components/Finder";
import { useSelector } from "react-redux";
import Help from "../Components/Help";

const Global = ({ children, help, setHelp }) => {
  const state = useSelector((state) => state);

  return (
    <>
      {help ? <Help help={help} setHelp={setHelp} /> : null}
      <div className="z-[280] absolute top-0">
        {state.finder ? <Finder finder={state.finder} /> : null}
      </div>
      {children}
    </>
  );
};

export default Global;
