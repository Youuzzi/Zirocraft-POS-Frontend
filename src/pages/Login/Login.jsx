import React, { useState, useContext } from "react";
import "./Login.css";
import { login } from "../../Service/AuthService";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import ziroIcon from "../../assets/favicon.ico";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setToken, setUserName } = useContext(AppContext); // Ambil setUserName
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data && data.token) {
        // UPDATE GLOBAL STATE (Inilah kuncinya!)
        setToken(data.token);
        setUserName(data.name);

        toast.success(`Login Berhasil! Selamat datang, ${data.name}.`);
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Email atau Password salah!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src={ziroIcon} alt="icon" className="header-icon-img" />
          <div className="brand-wrapper">
            <h2>ZiroShop</h2>
          </div>
          <p>Silakan login untuk mulai transaksi hari ini</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="nama@zirocraft.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "MENGHUBUNGKAN..." : "MASUK KE DASHBOARD"}
          </button>
        </form>
        <div className="login-footer">
          <p>BY ZIROCRAFT STUDIO</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
