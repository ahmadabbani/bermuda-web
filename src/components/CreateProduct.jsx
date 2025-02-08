import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./CreateItems.css";
import { useOutletContext } from "react-router-dom";

import { Plus, Trash2 } from "lucide-react";
const CreateProduct = () => {
  const { categories, loading: catgsLoading, error } = useOutletContext();

  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    params: null,
    //quantity: "", // New quantity field
    categoryName: "", // Category name (display name)
    parent_id: "", // Category ID (hidden from the user)
    image: null,
  });
  const [dynamicFields, setDynamicFields] = useState([]); // Stores dynamic fields
  const [loading, setLoading] = useState(false);

  // Handle input changes for default fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    const selectedCategoryName = e.target.value;
    const selectedCategory = categories.find(
      (cat) => cat.category_name === selectedCategoryName
    );

    if (selectedCategory) {
      setFormData({
        ...formData,
        categoryName: selectedCategoryName, // Set category name
        parent_id: selectedCategory.id, // Set parent_id
      });
    } else {
      setFormData({
        ...formData,
        categoryName: "", // Reset category name
        parent_id: "", // Reset parent_id
      });
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle adding a new dynamic field
  const addDynamicField = () => {
    setDynamicFields([
      ...dynamicFields,
      { fieldName: "", fieldType: "", fieldValue: "" },
    ]);
  };

  // Handle changes in dynamic fields
  const handleDynamicFieldChange = (index, key, value) => {
    if (key === "fieldName") {
      // Replace spaces and special characters with underscores
      value = value.replace(/[^a-zA-Z0-9_]/g, "_");
    }
    const updatedFields = [...dynamicFields];
    updatedFields[index][key] = value;
    setDynamicFields(updatedFields);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent double submission

    // Validate default fields
    if (
      !formData.productName ||
      !formData.price ||
      //!formData.quantity ||
      !formData.image
    ) {
      toast.warning("Please fill all fields and upload an image.");
      return;
    }

    if (!formData.categoryName || !formData.parent_id) {
      toast.warning("Select an existing category or create one first.");
      return;
    }

    setLoading(true);

    try {
      // Create FormData object for file upload
      const data = new FormData();
      data.append("productName", formData.productName);
      data.append("price", formData.price);
      // Check if params is null or empty and append accordingly
      if (formData.params) {
        data.append("params", formData.params);
      } else {
        data.append("params", ""); // or omit this line to send no params if not required
      }
      data.append("category_name", formData.categoryName); // Send category name
      data.append("parent_id", formData.parent_id); // Send parent_id
      data.append("image", formData.image);

      // Append dynamic fields to FormData
      dynamicFields.forEach((field, index) => {
        data.append(`fields[${index}][fieldName]`, field.fieldName);
        data.append(`fields[${index}][fieldType]`, field.fieldType);
        data.append(`fields[${index}][fieldValue]`, field.fieldValue);
      });

      // Send POST request to backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/create/product`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" }, // required for file upload
        }
      );

      if (response.data.productStatus) {
        toast.success("Product created!");
        // Reset form after successful submission
        setFormData({
          productName: "",
          price: "",
          params: "",
          categoryName: "",
          parent_id: "",
          image: null,
        });
        setDynamicFields([]); // Clear dynamic fields
      } else {
        toast.error("Failed to create product.");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-product">
      <h1 className="create-product__title">Create Product</h1>
      <form className="create-product__form" onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="create-product__form-group">
          <label className="create-product__label">Product Name:</label>
          <input
            type="text"
            name="productName"
            className="create-product__input"
            value={formData.productName}
            onChange={handleInputChange}
            placeholder="Enter product name"
          />
        </div>

        {/* Price */}
        <div className="create-product__form-group">
          <label className="create-product__label">Price:</label>
          <input
            type="text"
            name="price"
            className="create-product__input"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Enter price"
          />
        </div>

        {/* Additional Info */}
        <div className="create-product__form-group">
          <p className="create-product__helper-text">
            Optional: This field is for additional service information needed to
            activate the order...
          </p>
          <label className="create-product__label">Additional Info:</label>
          <input
            type="text"
            name="params"
            className="create-product__input"
            value={formData.params}
            onChange={handleInputChange}
            placeholder="(example: account username instagram, tiktok..)"
          />
        </div>

        {/* Category Dropdown */}
        <div className="create-product__form-group">
          <label className="create-product__label">Category Name:</label>
          <div className="create-product__select-wrapper">
            <select
              name="categoryName"
              className="create-product__select"
              value={formData.categoryName}
              onChange={handleCategoryChange}
              disabled={catgsLoading || error}
            >
              <option value="">Select a category</option>
              {catgsLoading ? (
                <option value="" disabled>
                  Loading categories...
                </option>
              ) : error ? (
                <option value="" disabled>
                  Failed to load categories.
                </option>
              ) : (
                categories.map((category) => (
                  <option key={category.id} value={category.category_name}>
                    {category.category_name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div className="create-product__form-group">
          <label className="create-product__label">Image:</label>
          <div className="create-product__file-input">
            <input
              type="file"
              name="image"
              className="create-product__file"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
        </div>

        {/* Dynamic Fields */}
        {dynamicFields.map((field, index) => (
          <div className="create-product__dynamic-group" key={index}>
            <div className="create-product__dynamic-header">
              <button
                type="button"
                className="create-product__delete-field"
                onClick={() => {
                  const updatedFields = dynamicFields.filter(
                    (_, i) => i !== index
                  );
                  setDynamicFields(updatedFields);
                }}
              >
                <Trash2 size={18} color="#dc3545" />
              </button>
              <span className="create-product__field-number">
                Field {index + 1}
              </span>
            </div>

            <div className="create-product__form-group">
              <label className="create-product__label">Field Name:</label>
              <input
                type="text"
                className="create-product__input"
                value={field.fieldName}
                onChange={(e) =>
                  handleDynamicFieldChange(index, "fieldName", e.target.value)
                }
                placeholder="Field name"
              />
            </div>

            <div className="create-product__form-group">
              <label className="create-product__label">Field Type:</label>
              <div className="create-product__select-wrapper">
                <select
                  className="create-product__select"
                  value={field.fieldType}
                  onChange={(e) =>
                    handleDynamicFieldChange(index, "fieldType", e.target.value)
                  }
                >
                  <option value="">Select type</option>
                  <option value="TEXT">Text</option>
                  <option value="NUMBER">Number</option>
                </select>
              </div>
            </div>

            {field.fieldType && (
              <div className="create-product__form-group">
                <label className="create-product__label">Field Value:</label>
                <input
                  type={field.fieldType === "NUMBER" ? "number" : "text"}
                  className="create-product__input"
                  value={field.fieldValue}
                  onChange={(e) =>
                    handleDynamicFieldChange(
                      index,
                      "fieldValue",
                      e.target.value
                    )
                  }
                  placeholder={`Enter ${field.fieldType.toLowerCase()}`}
                />
              </div>
            )}
          </div>
        ))}

        {/* Add Field Button */}
        <button
          type="button"
          className="create-product__add-field"
          onClick={addDynamicField}
        >
          <Plus size={18} className="create-product__add-icon" />
          Add New Field
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          className="create-product__submit"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
