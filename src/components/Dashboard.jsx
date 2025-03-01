import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [newCategories, setNewCategories] = useState([]); // Categories from endoit/api/categories
  const [allCategories, setAllCategories] = useState([]); // Combined categories (no duplicates)
  const [newLoading, setNewLoading] = useState(false); // New loading state
  const [newError, setNewError] = useState(null); // New error state

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false); // Loading state for products
  const [productsError, setProductsError] = useState(null); // Error state for products

  const [createdProducts, setCreatedProducts] = useState([]);
  const [createdProductsLoading, setCreatedProductsLoading] = useState(false); // Loading state for products
  const [createdProductsError, setCreatedProductsError] = useState(null);
  const { isAuthorized, user } = useAuth();

  useEffect(() => {
    /* const fetchCategories = async () => {
    
    };*/
    //products from api
    const fetchProducts = async () => {
      try {
        setProductsLoading(true); // Set loading to true
        setProductsError(null); // Reset error state

        // Fetch products from the external API
        const { data } = await axios.get(
          `${import.meta.env.VITE_EXTERNAL_API_URL}/products`
        );

        setProducts(data);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Map(
            data.map((product) => [
              product.category_name,
              {
                name: product.category_name,
                img: product.category_img,
              },
            ])
          ).values()
        );

        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching products:", error.message);
        setProductsError("Something went wrong, Please try again."); // Set error state
      } finally {
        setProductsLoading(false); // Set loading to false
      }
    };

    const fetchNewCategories = async () => {
      try {
        setNewLoading(true); // Set loading to true
        setNewError(null); // Reset error state

        // Fetch categories from endoit API
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/categories`
        );

        // Transform new categories to match the structure
        const uniqueNewCategories = Array.from(
          new Map(
            data.categories.map((catg) => [
              catg.category_name,
              {
                name: catg.category_name,
                img: catg.image,
                available: catg.available,
                section: catg.section,
              },
            ])
          ).values()
        );

        setNewCategories(uniqueNewCategories);
      } catch (error) {
        console.error("Error fetching new categories:", error.message);
        setNewError(error.message); // Set error state
      } finally {
        setNewLoading(false); // Set loading to false
      }
    };

    //creted products from db
    // Fetch products from the backend
    const fetchCreatedProducts = async () => {
      try {
        setCreatedProductsLoading(true); // Set loading to true
        setCreatedProductsError(null); // Reset error state

        // Make the API call to fetch products
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/products`
        );

        // Set the fetched data to the createdProducts state
        setCreatedProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
        setCreatedProductsError(error.message); // Set error state
      } finally {
        setCreatedProductsLoading(false); // Set loading to false
      }
    };

    fetchProducts();
    fetchNewCategories();
    fetchCreatedProducts();
  }, []);

  useEffect(() => {
    //filter available categories
    const availableNewCategories = newCategories.filter(
      (category) => category.available
    );
    // Combine categories from both sources and remove duplicates
    const combinedCategories = [...categories, ...availableNewCategories];
    const uniqueCombinedCategories = Array.from(
      new Map(
        combinedCategories.map((category) => [category.name, category])
      ).values()
    );
    setAllCategories(uniqueCombinedCategories);
  }, [categories, newCategories]);

  return (
    <div>
      {/* Pass products and categories as props */}
      <Outlet
        context={{
          user,
          products,
          allCategories,
          isAuthorized,
          newLoading,
          productsLoading,
          newError,
          productsError,
          createdProducts,
          createdProductsLoading,
          createdProductsError,
        }}
      />
    </div>
  );
};

export default Dashboard;
