const BASE_URL = "http://localhost:5000/api";
// Функция для выполнения запросов с аутентификацией
export const fetchWithAuth = async (url, options = {}) => {
  let accessToken = localStorage.getItem("accessToken");

  const makeRequest = async () => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      accessToken = await refreshToken();

      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    return response;
  };
  return makeRequest();
};

export const registerUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/registration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }

    const data = await response.json();

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    return data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred during registration");
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    return data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred during login");
  }
};

export const logout = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    console.log("Logged out successfully");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }
  try {
    const response = await fetch("http://localhost:5000/api/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    console.log("Tokens refreshed successfully");
    return data.accessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
  }
};

export const fetchUser = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const users = await response.json();
    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
};
