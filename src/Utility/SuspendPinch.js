import { useRef, useLayoutEffect } from "react";
const SuspendPinchZoom = ({ children }) => {
  const ref = useRef(null);
  // const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const target = ref.current;
    if (!target) return;
    const disablePinchZoom = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    target.addEventListener("wheel", disablePinchZoom, { passive: false });
    return () => {
      target.removeEventListener("wheel", disablePinchZoom);
    };
  }, []);
  return <div ref={ref}>{children}</div>;
};

export default SuspendPinchZoom;
