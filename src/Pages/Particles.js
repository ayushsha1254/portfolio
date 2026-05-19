import AmbientCanvas from "../Components/AmbientCanvas";

export default function Particles() {
  return (
    <div style={{ position: "absolute", inset: 0, width: "100vw", height: "100vh", pointerEvents: "none" }}>
      <AmbientCanvas />
    </div>
  );
}
