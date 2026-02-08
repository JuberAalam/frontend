import { useEffect, useState } from "react";
import "./OtpPage.css";

// ✅ UPDATED - Use environment variable instead of hardcoded localhost
const API_URL = 
  import.meta.env?.VITE_API_URL ||        // For Vite
  process.env.REACT_APP_API_URL ||        // For Create React App
  'http://localhost:5000';                // Fallback for local dev

export default function OtpPage({ onVerify, emailOrPhone }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [canResend, setCanResend] = useState(false);

  // ⏳ TIMER
  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // ✅ VERIFY OTP - UPDATED with API_URL
  const verifyOtp = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter complete OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // ✅ UPDATED - Use API_URL variable
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone, otp: otpValue }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid OTP");
        return;
      }

      localStorage.setItem("token", data.token);
      onVerify(); // 👉 Dashboard
    } catch {
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 RESEND OTP - UPDATED with API_URL
  const resendOtp = async () => {
    try {
      // ✅ UPDATED - Use API_URL variable
      await fetch(`${API_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone }),
      });

      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(20);
      setCanResend(false);
      setError("");
    } catch {
      setError("Failed to resend OTP");
    }
  };

  return (
    <div className="login-wrapper">
      {/* LEFT */}
      <div className="left-section">
        <div className="product-badge">Product</div>
        <div className="card">
          <img src="/images.jpg" alt="Runner" className="runner-img" />
          <p className="card-text">Uplist your product to market</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="right-section">
        <h2>Login to your Product Account</h2>

        <label>Enter OTP</label>

        <div className="otp-inputs">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
            />
          ))}
        </div>

        {error && <p className="error">{error}</p>}

        <button onClick={verifyOtp} disabled={loading}>
          {loading ? "Verifying..." : "Enter your OTP"}
        </button>

        <p className="resend">
          {!canResend ? (
            <>Didn't receive OTP? <span>Resend in {timeLeft}s</span></>
          ) : (
            <>
              Didn't receive OTP?{" "}
              <span className="resend-link" onClick={resendOtp}>
                Resend OTP
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
