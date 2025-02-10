import React from "react";
import "./AboutUs.css";
import { SiInstagram, SiWhatsapp, SiTiktok } from "react-icons/si";
const AboutUs = () => {
  return (
    <>
      <div className="aboutus-logo">
        <img src="/images/bermuda-white.png" alt="bermuda-logo" />
      </div>
      <div className="aboutus-wrapper">
        <h1 className="aboutus-heading">About Us</h1>

        <div className="aboutus-image-container">
          <img
            src="/images/about-us-desktop.webp"
            alt="Bermuda Gift Cards"
            className="aboutus-image"
          />
        </div>

        <div className="aboutus-content-box">
          <p className="aboutus-text">
            Welcome to <span className="aboutus-brand">Bermuda</span>, your
            premier destination for premium gift cards! At{" "}
            <span className="aboutus-brand">Bermuda</span>, we specialize in
            curating an exceptional gifting experience for your clients. We take
            pride in our expertise in procuring gift cards from popular
            platforms such as PUBG, Jawkker, TikTok, and an array of other
            exciting products. Our mission is to make every gifting occasion
            special and memorable. Whether you're looking to reward your
            clients, show appreciation, or celebrate a special event,{" "}
            <span className="aboutus-brand">Bermuda</span> has you covered.
            <br />
            <br />
            Visit us at <span className="aboutus-brand">
              bermuda-tech.com
            </span>{" "}
            to explore our diverse range of gift card options. You can reach out
            to us via phone at{" "}
            <span className="aboutus-phone">00961 71 777 139</span>,{" "}
            <span className="aboutus-phone">00961 78 870 487</span>, and{" "}
            <span className="aboutus-phone">00961 70 154 668</span>. Our
            headquarters are situated in the vibrant city of Beirut, embodying
            our commitment to excellence and personalized service.
            <br />
            <br />
            <span className="italic-font">
              Experience the joy of gifting like never before with{" "}
            </span>
            <span className="aboutus-brand italic-font">Bermuda!</span>
          </p>
        </div>

        <div className="aboutus-social-container">
          <a href="#" className="aboutus-social-link">
            <SiInstagram className="aboutus-social-icon" />
          </a>
          <a href="#" className="aboutus-social-link">
            <SiWhatsapp className="aboutus-social-icon" />
          </a>
          <a href="#" className="aboutus-social-link">
            <SiTiktok className="aboutus-social-icon" />
          </a>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
