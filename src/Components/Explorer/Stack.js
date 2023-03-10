import React from "react";
import { Tooltip } from "@mui/material";

const Stack = ({ name }) => {
  const logo = require("../../Assets/Skills/" + name + ".svg");
  return (
    <div className="w-12 h-12">
      <Tooltip title={name} placement="top" className="capitalize">
        <img
          src={logo}
          alt={name}
          className="object-contain bg-white rounded-xl p-2"
        />
      </Tooltip>
    </div>
  );
};

export default Stack;
