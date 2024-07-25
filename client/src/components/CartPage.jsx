import React, { useEffect, useState } from "react";
import {
  getCart,
  deleteFromCart,
  updateCart,
  sendInvoiceRequest,
} from "../http/cart";

const CartPage = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartData = await getCart();
        setCart(cartData);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };
    fetchCart();
  }, [cart]);

  const handleDelete = async (productId) => {
    const email = localStorage.getItem("userEmail");
    try {
      await deleteFromCart(email, productId);
      setCart(cart.filter((item) => item._id !== productId));
    } catch (error) {
      console.error("Failed to delete product from cart:", error);
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      await updateCart({ productId, quantity });
      setCart(
        cart.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Failed to update cart quantity:", error);
    }
  };

  const handleCheckout = async () => {
    const email = localStorage.getItem("userEmail");
    try {
      await sendInvoiceRequest(email);
      alert("Invoice sent successfully");
    } catch (error) {
      alert("Failed to send invoice");
    }
  };

  return (
    <div>
      <h1>Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cart.products.map((item) => (
            <li key={item.product._id}>
              {item.product.name} -
              <input
                type="number"
                value={item.quantity}
                min="1"
                onChange={(e) => {
                  setQuantity(Number(e.target.value));
                  handleUpdateQuantity(
                    item.product._id,
                    Number(e.target.value)
                  );
                }}
              />{" "}
              ${item.product.price}
              <button
                onClick={() => {
                  console.log(item);
                  handleDelete(item.product._id);
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <h2>Total Price: ${Number(cart.totalPrice).toFixed(2)}</h2>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

export default CartPage;
