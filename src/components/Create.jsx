import React, { useEffect, useState } from "react";
import axios from "axios";
import { Outlet } from "react-router-dom";
import "./CreateItems.css";
const Create = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [error, setError] = useState("");
  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/categories`
        );
        if (response.data.success) {
          setCategories(response.data.categories);
        } else {
          setError("Failed to fetch categories.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("An error occurred while fetching categories.");
      } finally {
        setLoading(false);
      }
    };

    //products
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/products`
        );

        setProducts(response.data);

        setProductsError("");
      } catch (error) {
        console.error("Error fetching products:", error);
        setProductsError("An error occurred while fetching products.");
      } finally {
        setProductsLoading(false);
      }
    };
    fetchCategories();
    fetchProducts();
  }, []);

  return (
    <>
      <Outlet
        context={{
          categories,
          setCategories,
          loading,
          error,
          products,
          setProducts,
          productsLoading,
          productsError,
        }}
      />
    </>
  );
};

export default Create;
