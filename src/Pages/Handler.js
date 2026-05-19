import { useState, useEffect, useRef, useCallback } from "react";
import Globe from "react-globe.gl";
import data from "../Data/main.json";
import moon from "../Assets/Images/moon.png";
import sun from "../Assets/Images/sun.jpg";
import * as THREE from "three";
import cloud from "../Assets/Theme/clouds.png";
// import Particles from "./Particles";

const World = ({ device, theme }) => {
  const ARC_REL_LEN = 0.6; // relative to whole arc
  const FLIGHT_TIME = 900;
  const NUM_RINGS = 5;
  const RINGS_MAX_R = 5; // deg
  const RING_PROPAGATION_SPEED = 5; // deg/sec

  const [arcsData, setArcsData] = useState([]);
  const [ringsData, setRingsData] = useState([]);

  const prevCoords = useRef({ lat: 0, lng: 0 });
  const emitArc = useCallback(({ lat: endLat, lng: endLng }) => {
    const { lat: startLat, lng: startLng } = prevCoords.current;
    prevCoords.current = { lat: endLat, lng: endLng };

    // add and remove arc after 1 cycle
    const arc = { startLat, startLng, endLat, endLng };
    setArcsData((curArcsData) => [...curArcsData, arc]);
    setTimeout(
      () => setArcsData((curArcsData) => curArcsData.filter((d) => d !== arc)),
      FLIGHT_TIME * 2
    );

    // add and remove start rings
    const srcRing = { lat: startLat, lng: startLng };
    setRingsData((curRingsData) => [...curRingsData, srcRing]);
    setTimeout(
      () =>
        setRingsData((curRingsData) =>
          curRingsData.filter((r) => r !== srcRing)
        ),
      FLIGHT_TIME * ARC_REL_LEN
    );

    // add and remove target rings
    setTimeout(() => {
      const targetRing = { lat: endLat, lng: endLng };
      setRingsData((curRingsData) => [...curRingsData, targetRing]);
      setTimeout(
        () =>
          setRingsData((curRingsData) =>
            curRingsData.filter((r) => r !== targetRing)
          ),
        FLIGHT_TIME * ARC_REL_LEN
      );
    }, FLIGHT_TIME);
  }, []);
  //   control.target.update();
  //   console.log(Globe);
  const globeEl = useRef();

  useEffect(() => {
    if (!globeEl.current || typeof globeEl.current.controls !== "function") return;
    globeEl.current.controls().enableZoom = false;
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.7;
    // const CLOUDS_IMG_URL = { cloud }; // from https://github.com/turban/webgl-earth
    // const CLOUDS_ALT = 0.004;
    // const CLOUDS_ROTATION_SPEED = -0.006;
    // new THREE.TextureLoader().load(CLOUDS_IMG_URL, (cloudsTexture) => {
    //   const clouds = new THREE.Mesh(
    //     new THREE.SphereGeometry(
    //       globeEl.current.getGlobeRadius() * (1 + CLOUDS_ALT),
    //       75,
    //       75
    //     ),
    //     new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
    //   );
    //   console.log(clouds);
    //   globeEl.current.scene().add(clouds);

    //   (function rotateClouds() {
    //     clouds.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180;
    //     requestAnimationFrame(rotateClouds);
    //   })();
    // });
  }, []);
  const width = device === true ? "80vw" : window.innerWidth / 3;
  //   Globe.controls().enableZoom = false;
  return (
    <>
      {/* <Particles></Particles> */}
      <Globe
        ref={globeEl}
        animateIn={true}
        atmosphereAltitude={0}
        atmosphereColor="#D9D9D9"
        backgroundColor="rgba(0,0,0,0)"
        width={width}
        height={window.innerHeight / 1.5}
        globeImageUrl={data.oldglobe}
        // bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        onGlobeClick={emitArc}
        arcsData={arcsData}
        arcColor={() => "#ffffff"}
        arcDashLength={ARC_REL_LEN}
        arcDashGap={2}
        onGlobeReady={() => {
          if (globeEl.current && typeof globeEl.current.controls === "function") {
            globeEl.current.controls().enableZoom = false;
          }
        }}
        arcDashInitialGap={1}
        arcDashAnimateTime={FLIGHT_TIME}
        arcsTransitionDuration={0}
        ringsData={ringsData}
        ringColor={() => (t) => `rgba(255,200,200,${1 - t})`}
        ringMaxRadius={RINGS_MAX_R}
        ringPropagationSpeed={RING_PROPAGATION_SPEED}
        ringRepeatPeriod={(FLIGHT_TIME * ARC_REL_LEN) / NUM_RINGS}
        // onZoom={(e) => {
        //   e.latitude = e.latitude;
        //   e.longitude = e.longitude;
        //   e.altitude = 2.5;
        // }}
        // //   atmosphereAltitude={0.5}
        // options={{
        //   enableZoom: false,
        // }}
        // // disable zoom

        // // altitude={10}
      />
    </>
  );
};
export default World;
