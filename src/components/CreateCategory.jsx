import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./CreateItems.css";

const CreateCategory = () => {
  const [formData, setFormData] = useState({
    categoryName: "",
    section: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent double submission

    // Validate inputs
    if (!formData.categoryName || !formData.section || !formData.image) {
      toast.warning("Please fill all fields and upload an image.");
      return;
    }

    setLoading(true);

    try {
      // Create FormData object for file upload
      const data = new FormData();
      data.append("categoryName", formData.categoryName);
      data.append("section", formData.section);
      data.append("image", formData.image);

      // Send POST request to backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/create/category`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" }, // Required for file upload
        }
      );

      if (response.data.categoryStatus) {
        toast.success("Category created!");
        // Reset form after successful submission
        setFormData({
          categoryName: "",
          section: "",
          image: null,
        });
      } else {
        toast.error("Failed to create category.");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="create-category">
      <h1 className="create-category__title">Create Category</h1>
      <form className="create-category__form" onSubmit={handleSubmit}>
        {/* Category Name */}
        <div className="create-category__form-group">
          <label className="create-category__label">Category Name:</label>
          <input
            type="text"
            name="categoryName"
            className="create-category__input"
            value={formData.categoryName}
            onChange={handleInputChange}
            placeholder="Enter category name"
          />
        </div>

        {/* Section Dropdown */}
        <div className="create-category__form-group">
          <label className="create-category__label">Section:</label>
          <div className="create-category__select-wrapper">
            <select
              name="section"
              className="create-category__select"
              value={formData.section}
              onChange={handleInputChange}
            >
              <option value="">Select a section</option>
              <option value="Applications section">Applications section</option>
              <option value="Games section">Games section</option>
              <option value="Cards section">Cards section</option>
              <option value="Numbers section">Numbers section</option>
              <option value="Social Media Section">Social Media Section</option>
              <option value="قسم الرصيد و الباقات">قسم الرصيد و الباقات</option>
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div className="create-category__form-group">
          <label className="create-category__label">Image:</label>
          <div className="create-category__file-input">
            <input
              type="file"
              name="image"
              className="create-category__file"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="create-category__submit"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Category"}
        </button>
      </form>
    </div>
  );
};

export default CreateCategory;
