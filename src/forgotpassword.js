import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    try {
      await axios.post("http://localhost:3000/forgot-password", {
        email: email,
      });

      setMessage("Password reset email sent");
      navigate(`/verify-otp/${email}`);
    } catch (error) {
      setMessage("This email is not registered");
    }
  };

  return (
    <section>
      <div className="form-box">
        <div className="form-value">
          <form onSubmit={handleResetPassword}>
            <h1
              style={{
                fontSize: "2em",
                color: "#fff",
                textAlign: "center",
                position: "relative",
                top: "-40px",
                textTransform: "uppercase",
              }}
            >
              Forgot Password
            </h1>

            <div className="inputbox">
              <ion-icon name="mail-outline"></ion-icon>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                required
              />

              <label htmlFor="email">Email</label>
            </div>

            <button type="submit">Reset Password</button>
            
            {message && ( <p style={{ color: message.includes("not registered") ? "red" : "green" }}> {message} </p> )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
