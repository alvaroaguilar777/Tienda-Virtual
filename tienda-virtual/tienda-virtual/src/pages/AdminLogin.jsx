import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "1234") {
      navigate("/admin");
    } else {
      setError("Contraseña incorrecta ❌");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(to right, #f97316, #ef4444)"
    }}>
      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "15px",
        width: "350px",
        textAlign: "center",
        boxShadow: "0 8px 20px rgba(0,0,0,0.2)"
      }}>
        <h2>Acceso Administrador 🔑</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "10px",
              background: "linear-gradient(to right, #ef4444, #f97316)",
              color: "white",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: "pointer"
            }}
          >
            Ingresar
          </button>
        </form>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>
    </div>
  );
}
