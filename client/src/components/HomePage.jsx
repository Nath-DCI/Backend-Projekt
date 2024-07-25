import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../http/api";
import { addToCart, getCart, deleteFromCart, updateCart } from "../http/cart";
import { fetchProducts } from "../http/product";
import "./HomePage.css";

const getEmailFromLocalStorage = () => {
  return localStorage.getItem("userEmail");
};

export const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState();
  const [quantity, setQuantity] = useState(1);
  const email = getEmailFromLocalStorage();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleRegister = () => {
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("userEmail");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleQuantityChange = (event) => {
    setQuantity(Number(event.target.value));
  };

  const handleAddToCart = async (productId) => {
    const userId = "66a1a4581270e2428b7770df";

    try {
      await addToCart(userId, productId, quantity);
      console.log(`Product ${productId} added to cart`);
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  const handleViewCart = () => {
    if (email) {
      navigate(`/cart/${email}`);
    } else {
      console.error("User email not found");
    }
  };

  return (
    <div>
      <header>
        <button onClick={handleRegister}>Register</button>
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={handleViewCart}>View Cart</button>
      </header>
      <main>
        <h1>Our Products</h1>
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product">
              <h2>{product.name}</h2>
              <p>
                <strong>SKU:</strong> {product.articel}
              </p>
              <p>
                <strong>Price:</strong> ${product.price.toFixed(2)}
              </p>
              <input
                type="number"
                value={quantity}
                min="1"
                onChange={handleQuantityChange}
              />
              <button onClick={() => handleAddToCart(product._id)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

// export default HomePage;
