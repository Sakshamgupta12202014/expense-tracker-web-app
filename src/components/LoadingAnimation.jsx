import React from "react";
import Lottie from "lottie-react";
import loaderAnimation from "../assets/loader.json";
import "./LoadingAnimation.css"

function LoadingAnimation({ loading }) {
  return (
    <div className="overlayStyle4">
      <Lottie
        animationData={loaderAnimation}
        loop={true}
        style={{ width: 150, height: 150 }}
      />
    </div>
  );
}

export default LoadingAnimation;
