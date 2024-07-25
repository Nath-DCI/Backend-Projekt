import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ActivationSuccess from "./components/ActivationSuccess";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import { HomePage } from "./components/HomePage";
import CartPage from "./components/CartPage";
import { fetchUser } from "./http/api";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await fetchUser();
        setIsAuthenticated(!!user);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterForm />} index />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/api/:activationLink" element={<ActivationSuccess />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/cart/:email" element={<CartPage />} />
      </Routes>
    </Router>
  );
};

export default App;
