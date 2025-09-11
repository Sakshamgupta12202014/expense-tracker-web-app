import React from "react";
import Lottie from "lottie-react";
import loaderAnimation from "../assets/loader.json";

function LoadingAnimation({ loading }) {
  const overlayStyle2 = {
    position: "fixed",
    top: 0,
    left: "200px",
    width: "calc(100vw - 200px)", // Correct width
    height: "100vh",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  };

  return (
    <div style={overlayStyle2}>
      <Lottie
        animationData={loaderAnimation}
        loop={true}
        style={{ width: 150, height: 150 }}
      />
    </div>
  );
}

export default LoadingAnimation;
