import { useRef, useState } from "react";

const MIN_W = 280;
const MIN_H = 160;

export function useResize(initW, initH, xMV, yMV) {
  const sRef = useRef({ w: initW, h: initH });
  const [size, setSize] = useState({ w: initW, h: initH });

  const onHandleDown = (e, dirs) => {
    e.preventDefault();
    e.stopPropagation();
    const sx = e.clientX, sy = e.clientY;
    const { w: sw, h: sh } = sRef.current;
    const spx = xMV.get(), spy = yMV.get();

    const move = (me) => {
      const dx = me.clientX - sx, dy = me.clientY - sy;
      let nw = sw, nh = sh, nx = spx, ny = spy;
      if (dirs.e) nw = Math.max(MIN_W, sw + dx);
      if (dirs.w) { nw = Math.max(MIN_W, sw - dx); nx = spx + sw - nw; }
      if (dirs.s) nh = Math.max(MIN_H, sh + dy);
      if (dirs.n) { nh = Math.max(MIN_H, sh - dy); ny = spy + sh - nh; }
      sRef.current = { w: nw, h: nh };
      setSize({ w: nw, h: nh });
      if (dirs.w) xMV.set(nx);
      if (dirs.n) yMV.set(ny);
    };

    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const forceSize = (w, h) => {
    sRef.current = { w, h };
    setSize({ w, h });
  };

  return { size, sRef, forceSize, onHandleDown };
}

// 8-direction resize handles — 6px edges, 12px corners, extend 3px outside window border
export const RESIZE_HANDLES = [
  { dirs: { n:1 },       css: { top:-3,    left:10,   right:10,  height:6,  cursor:"ns-resize" } },
  { dirs: { s:1 },       css: { bottom:-3, left:10,   right:10,  height:6,  cursor:"ns-resize" } },
  { dirs: { e:1 },       css: { right:-3,  top:10,    bottom:10, width:6,   cursor:"ew-resize" } },
  { dirs: { w:1 },       css: { left:-3,   top:10,    bottom:10, width:6,   cursor:"ew-resize" } },
  { dirs: { n:1, e:1 },  css: { top:-3,    right:-3,  width:12,  height:12, cursor:"ne-resize" } },
  { dirs: { n:1, w:1 },  css: { top:-3,    left:-3,   width:12,  height:12, cursor:"nw-resize" } },
  { dirs: { s:1, e:1 },  css: { bottom:-3, right:-3,  width:12,  height:12, cursor:"se-resize" } },
  { dirs: { s:1, w:1 },  css: { bottom:-3, left:-3,   width:12,  height:12, cursor:"sw-resize" } },
];
