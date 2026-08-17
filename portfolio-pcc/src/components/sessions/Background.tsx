"use client";
import Particles from "./Particles";
function Background() {
  return (
    <div
      className={`"bg-black" : "bg-white" fixed w-full h-screen top-0 left-0 z-0 overflow-hidden`}
    >
      <div className="h-full w-full relative">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
    </div>
  );
}

export default Background;
