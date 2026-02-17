import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Auth.css";
import { FcGoogle } from "react-icons/fc";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from "firebase/auth";

import { auth, googleProvider } from "./firebase";


export default function Auth() {
  const { mode } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setActiveTab(mode === "signup" ? "signup" : "login");
  }, [mode]);

  const handleSubmit = async () => {
    setError("");

    // Basic validation
    if (!email || !password || (activeTab === "signup" && !name)) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      // LOGIN
      if (activeTab === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/dashboard");
      }

      // SIGNUP
      if (activeTab === "signup") {
        const userCred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await updateProfile(userCred.user, {
          displayName: name
        });

        alert("Account created successfully. Please login.");
        navigate("/auth/login");
      }
    } catch (err) {
      setError(err.message.replace("Firebase:", ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err) {
      setError("Google sign-in failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="brand">CareerLens</h1>
        <p className="tagline">
          Bridging the gap between talent and opportunity.
        </p>

        <div className="auth-tabs">
          <span
            className={activeTab === "login" ? "active" : ""}
            onClick={() => navigate("/auth/login")}
          >
            Login
          </span>
          <span
            className={activeTab === "signup" ? "active" : ""}
            onClick={() => navigate("/auth/signup")}
          >
            Sign Up
          </span>
        </div>

        <form
          className="auth-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {activeTab === "signup" && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="auth-error">{error}</p>}

          <button className="primary-btn" disabled={loading}>
            {loading
              ? "Please wait..."
              : activeTab === "login"
              ? "Login"
              : "Create Account"}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button className="social-btn google" onClick={handleGoogleLogin}>
          <FcGoogle size={20} /> Continue with Google
        </button>
      </div>
    </div>
  );
}
