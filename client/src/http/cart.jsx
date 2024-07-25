const API_URL = "http://localhost:5000/cart";

export const addToCart = async (userId, productId, quantity) => {
  try {
    const response = await fetch(`${API_URL}/addToCart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, productId, quantity }),
    });

    if (!response.ok) {
      throw new Error("Failed to add to cart");
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const getCart = async () => {
  try {
    const email = localStorage.getItem("userEmail");
    const response = await fetch(`${API_URL}/getCart/${email}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to get cart");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

export const deleteFromCart = async (email, productId) => {
  email = localStorage.getItem("userEmail");
  try {
    const response = await fetch(`${API_URL}/deleteFromCart/${email}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete from cart");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting from cart:", error);
    throw error;
  }
};

export const updateCart = async (email, updates) => {
  try {
    const response = await fetch(`${API_URL}/updateCart/${email}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Failed to update cart");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};

export const sendInvoiceRequest = async (email) => {
  try {
    const response = await fetch(`${API_URL}/test-invoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Failed to send invoice");
    }
    return await response.json();
  } catch (error) {
    console.error("Error sending invoice:", error);
    throw error;
  }
};
