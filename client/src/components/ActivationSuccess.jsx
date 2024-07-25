import React from "react";
import { useParams } from "react-router-dom";

const ActivationSuccess = () => {
  const { activationLink } = useParams();

  return (
    <div>
      <h1>Account Activation Successful!</h1>
      <p>
        Your account has been activated. You can now <a href="/login">log in</a>
        .
      </p>
    </div>
  );
};

export default ActivationSuccess;
