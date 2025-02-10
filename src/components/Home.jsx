import React, { useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for styling
import "./Home.css";

import Loader from "./Loader";

const Home = () => {
  const {
    allCategories,
    newLoading,
    productsLoading,
    newError,
    productsError,
  } = useOutletContext(); // Get the products passed from Dashboard
  const isLoading = newLoading || productsLoading;
  const error = newError || productsError;

  // Show error toast if there's an error

  const requiredSections = [
    "Applications section",
    "Games section",
    "Cards section",
    "قسم الرصيد و الباقات",
    "Numbers section",
    "Social Media Section",
  ];

  // Filter allCategories to include required sections and categories with "section" or "Section"
  const filteredCategories = allCategories.filter(
    (cat) => requiredSections.includes(cat.name) || /section/i.test(cat.name) // Case-insensitive check for "section"
  );

  const existingSectionNames = new Set(allCategories.map((cat) => cat.name));

  const placeholderCategories = requiredSections
    .filter((section) => !existingSectionNames.has(section))
    .map((section) => {
      let imgUrl = ""; // Default empty string for img URL

      // Manually set img for specific sections
      if (section === "Games section") {
        imgUrl = "https://api.flashvision.co/images/category/1710724381.webp";
      } else if (section === "قسم الرصيد و الباقات") {
        imgUrl =
          "https://api.flashvision.co/images/category/1807-1716452917.webp";
      }

      return {
        name: section,
        img: imgUrl,
        alt: section, // Use the section name as the alt text
      };
    });
  console.log("placeholderCategories", placeholderCategories);

  const finalCategories = [...filteredCategories, ...placeholderCategories];

  return (
    <>
      <div className="home-logo">
        <img src="/images/bermuda-white.png" alt="bermuda-logo" />
      </div>
      <div
        className="container-fluid dash-wrapper d-flex justify-content-center align-items-center mt-0
    mb-3"
      >
        <div className="container dashboard-container p-4">
          <h1 className="main-heading text-main mb-2 mb-sm-5">
            WELCOME TO BERMUDA
          </h1>
          {isLoading ? (
            <Loader />
          ) : (
            <div className="row categories-list">
              {finalCategories.map((cat, index) => (
                <div
                  key={`${cat.id}-${index}`}
                  className="col-md-3 col-sm-4 col-6 category-item"
                >
                  <Link
                    to={`/dashboard/category/${encodeURIComponent(cat.name)}`}
                    className="text-decoration-none"
                  >
                    {cat.img ? (
                      <img
                        src={cat.img}
                        alt={cat.name}
                        className="category-img img-fluid"
                      />
                    ) : (
                      <div className="placeholder">{cat.alt}</div>
                    )}
                    <p className=" sect-name text-center mb-1 mt-0">
                      {cat.name}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
