import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom"; // ✅ Import Link

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin} className="form">
      <h2>Login</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>

      {/* ✅ Register link */}
      <p style={{ marginTop: "1rem" }}>
        New user?{" "}
        <Link to="/register" style={{ color: "#007bff", textDecoration: "underline" }}>
          Register here
        </Link>
      </p>
    </form>
  );
}
