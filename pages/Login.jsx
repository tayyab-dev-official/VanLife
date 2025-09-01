import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser, createUser } from "../api";

export default function Login() {
  const [formData, setFormData] = React.useState({ email: "", password: "" });
  const [status, setStatus] = React.useState("idle");
  const [error, setError] = React.useState(null);
  const [isNewUser, setIsNewUser] = React.useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from || "/host";

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    if (!formData.email || !formData.password) {
      setError({ message: "Please provide both email and password" });
      setStatus("idle");
      return;
    }

    if (formData.password.length < 6) {
      setError({ message: "Password must be at least 6 characters long" });
      setStatus("idle");
      return;
    }

    try {
      if (isNewUser) {
        // Create new user
        const { user, error } = await createUser(
          formData.email,
          formData.password
        );
        if (error) {
          setError({ message: error });
          setStatus("idle");
          return;
        }
        // Automatically log in after successful signup
        navigate(from, { replace: true });
      } else {
        // Login existing user
        const { user, error } = await loginUser(
          formData.email,
          formData.password
        );
        if (error) {
          setError({ message: error });
          setStatus("idle");
          return;
        }
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setError({ message: error.message || "Authentication failed" });
    } finally {
      setStatus("idle");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div className="login-container">
      {location.state?.message && (
        <h3 className="login-error">{location.state.message}</h3>
      )}
      <h1>Sign in to your account</h1>
      {error?.message && <h3 className="login-error">{error.message}</h3>}

      <form onSubmit={handleSubmit} className="login-form">
        <input
          name="email"
          onChange={handleChange}
          type="email"
          placeholder="Email address"
          value={formData.email}
        />
        <input
          name="password"
          onChange={handleChange}
          type="password"
          placeholder="Password"
          value={formData.password}
        />
        <button disabled={status === "submitting"}>
          {status === "submitting"
            ? isNewUser
              ? "Signing up..."
              : "Logging in..."
            : isNewUser
            ? "Sign up"
            : "Log in"}
        </button>
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          {isNewUser ? "Already have an account? " : "Don't have an account? "}
          <button
            type="button"
            onClick={() => setIsNewUser(!isNewUser)}
            style={{
              background: "none",
              border: "none",
              color: "#FF8C38",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            {isNewUser ? "Log in" : "Sign up"}
          </button>
        </p>
      </form>
    </div>
  );
}
