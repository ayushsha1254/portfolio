// useContextMenu.js
import { useEffect, useCallback, useState } from "react";

const useContextMenu = () => {
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);

  const handleContextMenu = useCallback(
    (event) => {
      event.preventDefault();
      var x, y;
      if (event.pageX > window.innerWidth - 300) x = window.innerWidth - 300;
      if (event.pageY > window.innerHeight - 300) y = window.innerHeight - 300;
      else {
        x = event.pageX;
        y = event.pageY;
      }
      setAnchorPoint({ x: x, y: y });
      setShow(true);
    },
    [setShow, setAnchorPoint]
  );

  const handleClick = useCallback(() => (show ? setShow(false) : null), [show]);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  });
  return { anchorPoint, show };
};

export default useContextMenu;
