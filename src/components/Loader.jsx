import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import loaderDark from "../assets/loaderDark.json"; // Assuming you put it in src/assets
import "../App.css";
const Loader = () => {
  return (
    <div>
      <Lottie
        animationData={loaderDark}
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

export default Loader;
