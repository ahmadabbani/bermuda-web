import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "./CreateHome.css";
import { toast } from "react-toastify";
import axios from "axios";
import { Bold, Plus } from "lucide-react";
const CreateHome = () => {
  const {
    categories,
    setCategories,
    loading,
    error,
    products,
    setProducts,
    productsLoading,
    productsError,
  } = useOutletContext();
  const [checkboxLoading, setCheckboxLoading] = useState(false);
  const [checkboxError, setCheckboxError] = useState(null);
  const navigate = useNavigate();

  //category toggle
  const handleToggle = async (id) => {
    setCheckboxLoading(true);
    setCheckboxError(null);
    try {
      // Find the category to toggle
      const categoryToUpdate = categories.find(
        (category) => category.id === id
      );
      if (!categoryToUpdate) return;

      // Optimistically update the UI
      const updatedCategories = categories.map((category) =>
        category.id === id
          ? { ...category, available: !category.available }
          : category
      );
      setCategories(updatedCategories);

      // Make the API call to update the backend
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/categories/${id}/availability`,
        { available: !categoryToUpdate.available } // Send the new availability status
      );

      // Show success toast
      !categoryToUpdate.available
        ? toast.success("The category is now Active!")
        : toast.warning("The category is now Disabled!");
    } catch (error) {
      // Revert the UI change if the API call fails
      const revertedCategories = categories.map((category) =>
        category.id === id
          ? { ...category, available: categoryToUpdate.available } // Revert to the previous state
          : category
      );
      setCategories(revertedCategories);

      // Show error toast
      toast.error("Failed to update the category. Please try again.");
      console.error("Error updating the category:", error);
    } finally {
      setCheckboxLoading(false); // Stop loading
    }
  };

  //product toggle
  const handleProductToggle = async (id) => {
    setCheckboxLoading(true);
    setCheckboxError(null);
    try {
      // Find the category to toggle
      const productToUpdate = products.find((product) => product.id === id);
      if (!productToUpdate) return;

      // Optimistically update the UI
      const updatedProducts = products.map((product) =>
        product.id === id
          ? { ...product, available: !product.available }
          : product
      );
      setProducts(updatedProducts);

      // Make the API call to update the backend
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/products/${id}/availability`,
        { available: !productToUpdate.available } // Send the new availability status
      );

      // Show success toast
      !productToUpdate.available
        ? toast.success("The product is now Active!")
        : toast.warning("The product is now Disabled!");
    } catch (error) {
      // Revert the UI change if the API call fails
      const revertedProducts = products.map((product) =>
        product.id === id
          ? { ...product, available: productToUpdate.available } // Revert to the previous state
          : product
      );
      setProducts(revertedProducts);

      // Show error toast
      toast.error("Failed to update the product. Please try again.");
      console.error("Error updating the product:", error);
    } finally {
      setCheckboxLoading(false); // Stop loading
    }
  };

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  let iconSize = 24; // Default size
  if (screenWidth <= 768) iconSize = 18;
  if (screenWidth >= 1500) iconSize = 30;
  return (
    <div className="create-home-container">
      <div>
        <div className="create-new-item">
          {" "}
          <h3>Categories</h3>
          <div>
            <button
              className="create-ctg"
              onClick={() => navigate("/admin/create/category")}
            >
              Create Category <Plus size={iconSize} />
            </button>
          </div>
        </div>

        {/* Table or Loading/Error Message */}
        {loading ? (
          <div className="message">Loading categories...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category Name</th>
                  <th>Section</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.category_name}</td>
                    <td>{category.section}</td>
                    <td>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={category.available}
                          onChange={() => handleToggle(category.id)}
                          disabled={checkboxLoading} // Disable the checkbox while loading
                        />
                        {/* Show loading feedback */}
                        {/*{checkboxLoading && <span>Loading...</span>}{" "} */}
                        <span className="slider"></span>
                      </label>
                    </td>
                    <td>
                      {new Date(category.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="row mobile-row">
              {categories.map((category) => (
                <div className="col-md-4" key={category.id}>
                  {" "}
                  {/* Use col-md-4 for 3 columns on medium screens */}
                  <div className="card mb-4">
                    {" "}
                    {/* Add margin at the bottom for spacing */}
                    <div className="card-body">
                      <h5 className="card-title">{category.category_name}</h5>
                      <h6 className="card-subtitle mb-3">ID: {category.id}</h6>
                      <p className="card-text">
                        <strong>Section:</strong> {category.section}
                        <br />
                        <strong>Created At:</strong>{" "}
                        {new Date(category.created_at).toLocaleDateString()}
                      </p>
                      <div className="d-flex gap-4 align-items-center">
                        <span className="status-p">Status: </span>
                        <label className="toggle">
                          <input
                            type="checkbox"
                            checked={category.available}
                            onChange={() => handleToggle(category.id)}
                            disabled={checkboxLoading} // Disable the checkbox while loading
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* products*/}
      <div className="prdtcs-table">
        <div className="create-new-item">
          {" "}
          <h3>Products</h3>
          <div>
            <button
              className="create-ctg"
              onClick={() => navigate("/admin/create/product")}
            >
              Create Product <Plus size={iconSize} />
            </button>
          </div>
        </div>
        {/* Table or Loading/Error Message */}
        {productsLoading ? (
          <div className="message">Loading products...</div>
        ) : productsError ? (
          <div className="error">{productsError}</div>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.product_name}</td>
                    <td>{product.price}$</td>
                    <td>{product.category_name}</td>
                    <td>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={product.available}
                          onChange={() => handleProductToggle(product.id)}
                          disabled={checkboxLoading} // Disable the checkbox while loading
                        />
                        {/* Show loading feedback */}
                        {/*{checkboxLoading && <span>Loading...</span>}{" "} */}
                        <span className="slider"></span>
                      </label>
                    </td>
                    <td>{new Date(product.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Mobile */}
            <div className="row mobile-row">
              {products.map((product) => (
                <div className="col-md-4" key={product.id}>
                  {" "}
                  {/* Use col-md-4 for 3 columns on medium screens */}
                  <div className="card mb-4">
                    {" "}
                    {/* Add margin at the bottom for spacing */}
                    <div className="card-body">
                      <h5 className="card-title">{product.product_name}</h5>
                      <h6 className="card-subtitle mb-3">ID: {product.id}</h6>
                      <p className="card-text">
                        <strong>Price:</strong> {product.price}$
                        <br />
                        <strong>Category:</strong> {product.category_name}
                        <br />
                        <strong>Created At:</strong>{" "}
                        {new Date(product.created_at).toLocaleDateString()}
                      </p>
                      <div className="d-flex gap-4 align-items-center">
                        <span className="status-p">Status: </span>
                        <label className="toggle">
                          <input
                            type="checkbox"
                            checked={product.available}
                            onChange={() => handleProductToggle(product.id)}
                            disabled={checkboxLoading} // Disable the checkbox while loading
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateHome;
