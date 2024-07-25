const API_URL = "http://localhost:5000/product";

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/getProducts`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
