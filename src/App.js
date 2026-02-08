import { useEffect, useState } from "react";
import LoginPage from "./components/LoginPage/LoginPage";
import OtpPage from "./components/OtpPage/OtpPage";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  const [step, setStep] = useState("login");
  const [emailOrPhone, setEmailOrPhone] = useState("");

  // 🔒 Protect dashboard (SAFE WAY)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (step === "dashboard" && !token) {
      setStep("login");
    }
  }, [step]);

  return (
    <>
      {step === "login" && (
        <LoginPage
          setEmailOrPhone={setEmailOrPhone}
          onNext={() => setStep("otp")}
        />
      )}

      {step === "otp" && (
        <OtpPage
          emailOrPhone={emailOrPhone}
          onVerify={() => setStep("dashboard")}
        />
      )}

      {step === "dashboard" && <Dashboard />}
    </>
  );
}

export default App;
