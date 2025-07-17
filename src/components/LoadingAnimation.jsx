import React from "react";
import Lottie from "lottie-react";
import loaderAnimation from "../assets/loader.json"

function LoadingAnimation({loading}) {
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  };

    return (
      <div style={overlayStyle}>
        <Lottie
          animationData={loaderAnimation}
          loop={true}
          style={{ width: 150, height: 150 }}
        />
      </div>
    );
}

export default LoadingAnimation;
