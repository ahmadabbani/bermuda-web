import axios from "axios";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";

import { useAuth } from "../../AuthContext";
import { toast } from "react-toastify";
import "./Home.css";
import { ArrowLeftCircle } from "lucide-react";
import LoaderLight from "./LoaderLight";
const Categorie = () => {
  const { id: categoryName } = useParams(); // `id` here is the category_name
  //const modalRef = useRef(null);

  const {
    allCategories,
    products,
    productsLoading,
    productsError,
    isAuthorized,
    createdProducts,
    createdProductsLoading,
    createdProductsError,
  } = useOutletContext(); // Get the products passed from Dashboard
  const { user, fetchBalance } = useAuth();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    product_name: "",
    total_price: 0,
    quantity: 1,
    type: "OUT",
    accountemail: user?.email || "",
    email: "",
    //phone: "",
    username: user?.username || "", // Fallback to empty string if username is null/undefined
    user_id: user?.id || "",
    status: "waiting",
    params: [],
  });
  console.log(
    "ACCOUNTEMAIL:",
    formData.accountemail,
    "USERID:",
    formData.user_id
  );

  const handleBack = () => {
    navigate(-1); // Go back to the previous history entry
  };
  // Update formData when selectedProduct or quantity changes
  useEffect(() => {
    if (selectedProduct) {
      setFormData((prev) => ({
        ...prev,
        user_id: user?.id || "",
        accountemail: user?.email || "",
        product_name: selectedProduct.name,
        total_price: selectedProduct.price * quantity,
        quantity: quantity,
      }));
    }
  }, [selectedProduct, quantity]);

  // Filter products based on the category_name
  const filteredProducts = products.filter(
    (product) => product.category_name === decodeURIComponent(categoryName)
  );

  const normalizedProducts = filteredProducts.map((product) => ({
    ...product,
    id: `p-${product.id}`, // Prefix ID with "p-"
  }));

  const currentCategory = decodeURIComponent(categoryName); // Decode the category name

  const normalizedProductsA = products.map((product) => ({
    ...product,
    id: `p-${product.id}`, // Prefix ID with "p-"
  }));

  const normalizedCreatedProductsA = createdProducts.map((product) => ({
    id: `c-${product.id}`, // Prefix ID with "c-"
    name: product.product_name, // Rename product_name to name
    price: product.price,
    category_name: product.category_name,
    available: product.available,
    category_img: product.image,
    params: product.params,
  }));

  const allProducts = [...normalizedProductsA, ...normalizedCreatedProductsA];

  const subCategoriesMap = {
    "Applications section": [
      "Shahid VIP",
      "TikTok",
      "Meyo",
      "Liveu",
      "Tumile live",
      "Azar live",
      "BEE LIVE",
      "PIKA STAR",
      "YoYo",
    ],
    "Games section": [
      "pubg mobile global",
      "Pubg mobile code",
      "Jawaker",
      "Yalla ludo Gold",
      "yalla ludo diamonds",
      "mobile legends bang bang",
      "Clash of Clans",
      "CLASH ROYALE",
      "Hay Day",
      "Brawl Stars",
      "Arena Breakout",
      "Genshin Impact",
      "Ludo Club",
      "Free Fire",
    ],
    "Cards section": [
      "Steam card",
      "I T U N E S",
      "PLAYSTATION LEB",
      "PLAYSTATION USA",
      "PLAYSTATION UAE",
      "STEAM TR",
      "ROBLOX USA",
      "STEAM USA",
      "XBOX USA",
      "Nintendo",
      "Itunes France",
      "Itunes Emirates (uae)",
    ],
    "قسم الرصيد و الباقات": ["ALFA Telcome", "Alfa u-share"],
  };

  // Get predefined subcategories
  const predefinedSubCategories = subCategoriesMap[currentCategory] || [];

  // Get additional subcategories from allCategories
  const additionalSubCategories = allCategories
    .filter((cat) => cat.section === currentCategory)
    .map((cat) => ({
      name: cat.name,
      image: cat.img,
      section: cat.section,
    }));
  console.log("added catg img:", additionalSubCategories);

  // Combine predefined and additional subcategories

  const filteredCreatedProducts = createdProducts.filter(
    (product) => product.category_name === decodeURIComponent(categoryName)
  );

  const normalizedCreatedProducts = filteredCreatedProducts.map((product) => ({
    id: `c-${product.id}`, // Prefix ID with "c-"
    name: product.product_name, // Rename product_name to name
    price: product.price,
    category_name: product.category_name,
    available: product.available,
    category_img: product.image,
    params: product.params,
  }));

  const filteredAllProducts = [
    ...normalizedProducts,
    ...normalizedCreatedProducts,
  ];

  // Step 1: Find the image for each predefined category from allProducts
  const predefinedSubCategoriesWithImages = predefinedSubCategories.map(
    (catgName) => {
      // Find the product with the matching category_name
      const product = products.find(
        (product) => product.category_name === catgName
      );

      // Return an object with both name and image (category_img)
      return {
        name: catgName,
        image: product ? product.category_img : "", // Fallback if image not found
      };
    }
  );

  // Step 2: Merge predefinedSubCategories (with images) and additionalSubCategories
  const subCategories = [
    ...predefinedSubCategoriesWithImages,
    ...additionalSubCategories,
  ];

  // Filter both subcategories and products based on search term
  const filteredItems = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    const filteredSubCategories = subCategories.filter((subCategory) =>
      subCategory.name.toLowerCase().startsWith(term)
    );

    const filteredProducts = filteredAllProducts.filter((product) =>
      product.name.toLowerCase().startsWith(term)
    );

    return {
      filteredSubCategories,
      filteredProducts,
    };
  }, [searchTerm, subCategories, filteredAllProducts]);

  const openModal = (product) => {
    if (!isAuthorized) {
      // Redirect to sign-in if not authorized
      toast.warning("Please sign in first !");
      //navigate("/dashboard");
    } else {
      setSelectedProduct(product);
      // Center modal in current viewport
      setTimeout(() => {
        const modalContent = document.querySelector(".modal-content");
        if (modalContent) {
          // Get viewport dimensions
          const viewportHeight = window.innerHeight;
          const modalHeight = modalContent.offsetHeight;

          // Calculate scroll position
          const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;

          // Position modal precisely at center of current viewport
          modalContent.style.position = "fixed";
          modalContent.style.top = `${
            scrollTop + viewportHeight / 2 - modalHeight / 2
          }px`;
          modalContent.style.left = "50%";
          modalContent.style.transform = "translate(-50%, -20%)";
        }
      }, 0);

      if (!product.qty_values) {
        setQuantity(1); // Default quantity if qty_values is null
      } else {
        setQuantity(parseInt(product.qty_values.min, 10)); // Start with minimum value
      }
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setQuantity(1);
    setError("");
    setFormData((prev) => ({
      ...prev,
      email: "",
      //accountemail: "",
      //phone: "",
      params: [],
    }));
  };

  const handleQuantityChange = (newQuantity) => {
    if (selectedProduct?.qty_values) {
      const min = parseInt(selectedProduct.qty_values.min, 10);
      const max = parseInt(selectedProduct.qty_values.max, 10);
      if (newQuantity >= min && newQuantity <= max) {
        setQuantity(newQuantity);
        setError("");
      } else {
        setError(`Quantity must be between ${min} and ${max}`);
        setTimeout(() => {
          setError("");
        }, 2000);
      }
    }
  };

  const handleParamChange = (index, value) => {
    const newParams = [...formData.params];
    newParams[index] = value;
    setFormData({ ...formData, params: newParams });
  };

  const renderParamsInputs = (selectedProduct) => {
    if (!selectedProduct.params || selectedProduct.params.length === 0)
      return null;

    // Convert params to an array if it's a string
    const paramsArray = Array.isArray(selectedProduct.params)
      ? selectedProduct.params
      : [selectedProduct.params];

    return paramsArray.map((param, index) => (
      <div key={index} style={{ marginBottom: "0px" }}>
        <label>{param}</label>
        <input
          type="text"
          name={`param_${index}`}
          placeholder={`Enter ${param}`}
          value={formData.params[index] || ""}
          onChange={(e) => handleParamChange(index, e.target.value)}
          className="custom-input"
        />
      </div>
    ));
  };

  const validateParams = () => {
    if (!selectedProduct.params || selectedProduct.params.length === 0)
      return true; // No params to validate

    // Convert params to an array if it's a string
    const paramsArray = Array.isArray(selectedProduct.params)
      ? selectedProduct.params
      : [selectedProduct.params];

    // Check if all params are filled
    return paramsArray.every((_, index) => formData.params[index]?.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prevent double submission
    if (loading) return;
    // Ensure userId and username are available before proceeding
    if (!user?.id || !user?.username) {
      console.error("User ID or Username is missing.");
      return;
    }
    // Validate params
    if (!validateParams()) {
      toast.warning("Please fill all required fields.");
      return;
    }
    try {
      const currentBalance = await fetchBalance(user?.id);
      const orderPrice = formData.total_price; // Assuming you have access to the price
      if (currentBalance < orderPrice) {
        toast.warning(
          `Insufficient balance. You have only ${currentBalance}$ in your balance`
        );
        return;
      }
    } catch (error) {
      console.error("Error checking balance:", error);
      toast.error("Unable to verify balance. Please try again.");
      return;
    }
    // Convert params to an array if it's present and valid, otherwise use an empty array
    const paramsArray = selectedProduct.params
      ? Array.isArray(selectedProduct.params)
        ? selectedProduct.params
        : [selectedProduct.params]
      : [];

    // Generate paramsString only if there are valid parameters
    const paramsString = paramsArray
      .map((paramName, index) => {
        const value = formData.params[index]?.trim();
        return value ? `${paramName}:${value}` : null;
      })
      .filter((param) => param !== null)
      .join(",");

    // Prepare order data, including params only if there are valid entries
    const orderData = {
      ...formData,
      ...(paramsString && { params: paramsString }), // Conditionally include params
    };

    if (orderData.email !== orderData?.accountemail) {
      toast.warning("The email entered does not match your account email");
      return;
    }
    /* Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEmailValid("Please enter a valid email address.");
      return;
    }*/
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders`,
        orderData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.orderStatus) {
        toast.success(response.data.message);
        closeModal();
      } else {
        toast.error(
          response.data.error || "An error occurred while placing your order"
        );
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      if (error.response) {
        // Server responded with an error status
        toast.error(
          error.response.data.error ||
            "An error occurred while placing your order"
        );
      } else if (error.request) {
        // Request was made but no response received
        toast.error("Unable to reach the server. Please try again later.");
      } else {
        // Something else went wrong
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      // Stop loading whether successful or not
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };
  const allLoading = productsLoading || createdProductsLoading;
  const allError = productsError || createdProductsError;

  if (allError) {
    return (
      <p
        style={{
          color: "#ff4d4f", // Modern red color
          backgroundColor: "#fff1f0", // Light red background
          padding: "12px 16px", // Padding for spacing
          borderRadius: "8px", // Rounded corners
          border: "1px solid #ffccc7", // Subtle border
          fontSize: "14px", // Smaller font size
          fontWeight: "500", // Medium font weight
          margin: "24px 0", // Margin for spacing
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", // Soft shadow
          animation: "fadeIn 0.3s ease-in-out", // Fade-in animation
          display: "flex", // Flexbox for icon alignment
          alignItems: "center", // Center-align icon and text
          gap: "8px", // Space between icon and text
        }}
      >
        {/* Friendly icon (you can use an emoji or an icon library) */}
        <span role="img" aria-label="warning">
          ⚠️
        </span>
        {/* Friendly error message */}
        Oops! Something went wrong: {allError}
      </p>
    );
  }
  return (
    <div className="container-fluid dash-wrapper d-flex justify-content-center align-items-center mt-5 mb-3">
      <div className="catgs-container container p-4">
        <div className="first-row justify-content-between d-flex  align-items-center mb-2 mb-sm-5">
          <h1 className="catgs-heading">Products in {categoryName}</h1>

          <button
            className="back-btn"
            onClick={handleBack}
            style={{ border: "none", background: "none", padding: 0 }}
          >
            <ArrowLeftCircle size={40} color="#fff" />{" "}
            {/* Adjust size as needed */}
          </button>
        </div>
        <div className="search-container mb-3">
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              maxWidth: "300px",
              padding: "8px 12px",
              borderRadius: "4px",
            }}
          />
        </div>
        {allLoading ? (
          <LoaderLight />
        ) : (
          <div className="row categories-list">
            {/* Render Filtered Subcategories */}
            {filteredItems.filteredSubCategories.length > 0 &&
              filteredItems.filteredSubCategories.map((subCategory, index) => {
                const normalizedPath = subCategory.image.replace(/\\/g, "/");
                const isLocalPath = normalizedPath.startsWith("uploads/");
                const imgUrl = isLocalPath
                  ? `${import.meta.env.VITE_IMAGE_BASE_URL}/${normalizedPath}`
                  : normalizedPath;

                return (
                  <div
                    key={`${subCategory?.id}-${index}`}
                    className="category-item p-item col-md-3 col-sm-4 col-6"
                    onClick={() => {
                      setSearchTerm(""); // Reset search
                      navigate(
                        `/dashboard/category/${encodeURIComponent(
                          subCategory.name
                        )}`
                      );
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <img src={imgUrl} alt={subCategory.name} />
                    <p className="sub-name sect-name text-center mt-0 p-0 pb-2 pt-2">
                      {subCategory?.name}
                    </p>
                  </div>
                );
              })}

            {filteredItems.filteredProducts.length > 0
              ? filteredItems.filteredProducts.map((product, index) => {
                  const normalizedImagePath = product.category_img.replace(
                    /\\/g,
                    "/"
                  );
                  const isLocalImage =
                    normalizedImagePath.startsWith("uploads/");
                  const imageUrl = isLocalImage
                    ? `${
                        import.meta.env.VITE_IMAGE_BASE_URL
                      }/${normalizedImagePath}`
                    : normalizedImagePath;
                  return (
                    <div
                      key={`${product?.id}-${index}`}
                      className="category-item p-item col-md-3 col-sm-4 col-6"
                      style={{
                        opacity: product.available ? 1 : 0.5,
                        cursor: product.available ? "pointer" : "not-allowed",
                      }}
                      onClick={() => {
                        setSearchTerm("");
                        product.available && openModal(product);
                      }}
                    >
                      <p className="p-price">
                        {parseFloat(product.price).toFixed(2)}$
                      </p>

                      <img
                        src={imageUrl}
                        alt={product.name}
                        style={{
                          filter: product.available
                            ? "none"
                            : "grayscale(100%)",
                        }}
                      />
                      <p className="sub-name sect-name text-center mt-0 p-0 pb-2 pt-2">
                        {product.name}
                      </p>
                    </div>
                  );
                })
              : filteredItems.filteredSubCategories.length === 0 && (
                  <p style={{ fontWeight: "600" }}>No products available.</p>
                )}
          </div>
        )}

        {selectedProduct && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h4 className="modal-title">{selectedProduct.name}</h4>
              <p className="modal-subtitle">
                Email in order to get back to you when the order is ready
              </p>
              <div className="input-container">
                <input
                  type="text"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="custom-input"
                />
                {renderParamsInputs(selectedProduct)}
              </div>
              {selectedProduct.qty_values ? (
                <div className="quantity-container">
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={
                        quantity <=
                        parseInt(selectedProduct.qty_values.min - 1, 10)
                      }
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      name="quantity"
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(parseInt(e.target.value, 10))
                      }
                      className="custom-input quantity-input"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={
                        quantity >=
                        parseInt(selectedProduct.qty_values.max + 1, 10)
                      }
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  <p className="modal-total-price">
                    Price:{" "}
                    {parseFloat(selectedProduct.price * quantity).toFixed(2)}$
                  </p>
                </div>
              ) : (
                <p className="modal-price">
                  Price: {parseFloat(selectedProduct.price).toFixed(2)}$
                </p>
              )}
              {error && <p className="qty-error-text">{error}</p>}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`submit-btn ${loading ? "loading" : ""}`}
              >
                {loading ? <div className="spinner"></div> : "Send Order"}
              </button>
              <button onClick={closeModal} className="close-btn">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categorie;
