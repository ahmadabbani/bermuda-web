import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import loaderLight from "../assets/loaderLight.json"; // Assuming you put it in src/assets
import "../App.css";
const LoaderLight = () => {
  return (
    <div>
      <Lottie
        animationData={loaderLight}
        loop={true}
        style={{
          width: "80px",
          height: "80px",
          margin: "6rem auto",
        }}
      />
    </div>
  );
};

export default LoaderLight;
