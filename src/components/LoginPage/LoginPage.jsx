import { useState } from "react";
import "./LoginPage.css";

// ✅ UPDATED - Use environment variable instead of hardcoded localhost
const API_URL = 
  import.meta.env?.VITE_API_URL ||        // For Vite
  process.env.REACT_APP_API_URL ||        // For Create React App
  'http://localhost:5000';                // Fallback for local dev

export default function LoginPage({ onNext, setEmailOrPhone }) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOtp = async () => {
    if (!value) {
      setError("Please enter email or phone number");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // ✅ UPDATED - Use API_URL variable
      const res = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: value }),
      });

      if (!res.ok) throw new Error();

      setEmailOrPhone(value); // ✅ PASS UP
      onNext(); // go to OTP page
    } catch {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="left-section">
        <div className="product-badge">Product</div>

        <div className="card">
          <img src="/images.jpg" alt="Runner" className="runner-img" />
          <p className="card-text">Uplist your product to market</p>
        </div>
      </div>

      <div className="right-section">
        <h2>Login to your Product Account</h2>

        <label>Email or Phone number</label>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter email or phone number"
        />

        {error && <p className="error">{error}</p>}

        <button onClick={sendOtp} disabled={loading}>
          {loading ? "Sending OTP..." : "Login"}
        </button>
      </div>
    </div>
  );
}
