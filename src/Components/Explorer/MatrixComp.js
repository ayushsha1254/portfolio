import { height, width } from "@mui/system";
import React, { useEffect, useRef } from "react";

const MatrixComp = ({ timeout = 50, Swidth, Sheight }) => {
  const canvas = useRef();

  useEffect(() => {
    const context = canvas.current.getContext("2d");

    const width = Swidth ? Swidth : window.innerWidth;
    const height = Sheight ? Sheight : window.innerHeight;
    canvas.current.width = width;
    canvas.current.height = height;

    context.fillStyle = "#000";
    context.fillRect(0, 0, width, height);

    const columns = Math.floor(width / 20) + 1;
    const yPositions = Array.from({ length: columns }).fill(0);

    context.fillStyle = "#000";
    context.fillRect(0, 0, width, height);

    const matrixEffect = () => {
      context.fillStyle = "#0001";
      context.fillRect(0, 0, width, height);

      context.fillStyle = "#0f0";
      context.font = "15pt matrix";

      yPositions.forEach((y, index) => {
        const text = String.fromCharCode(Math.random() * 128);
        const x = index * 20;
        context.fillText(text, x, y);

        if (y > 100 + Math.random() * 10000) {
          yPositions[index] = 0;
        } else {
          yPositions[index] = y + 20;
        }
      });
    };

    const interval = setInterval(matrixEffect, timeout);
    return () => {
      clearInterval(interval);
    };
  }, [canvas, timeout]);

  return (
    <canvas
      ref={canvas}
      style={{
        font: "matrix",
        position: "absolute",
        zIndex: 0,
        opacity: 1,
      }}
    />
  );
};

export default MatrixComp;
