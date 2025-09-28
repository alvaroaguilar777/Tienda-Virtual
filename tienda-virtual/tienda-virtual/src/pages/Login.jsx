import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(to right, #7e22ce, #ec4899, #ef4444)",
      fontFamily: "Arial, Helvetica, sans-serif",
    },
    box: {
      width: "100%",
      maxWidth: "400px",
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(8px)",
      borderRadius: "20px",
      padding: "40px",
      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
    },
    title: {
      textAlign: "center",
      fontSize: "2.5rem",
      fontWeight: "800",
      marginBottom: "30px",
      background: "linear-gradient(to right, #7e22ce, #ec4899)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    label: {
      fontSize: "0.9rem",
      fontWeight: "bold",
      color: "#444",
      marginBottom: "5px",
      display: "block",
    },
    input: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #ccc",
      outline: "none",
      fontSize: "1rem",
    },
    button: {
      width: "100%",
      padding: "14px",
      border: "none",
      borderRadius: "10px",
      background: "linear-gradient(to right, #7e22ce, #ec4899)",
      color: "white",
      fontSize: "1.1rem",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "0.3s",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    },
    registerText: {
      textAlign: "center",
      marginTop: "20px",
      fontSize: "0.9rem",
      color: "#444",
    },
    link: {
      color: "#ec4899",
      fontWeight: "bold",
      textDecoration: "none",
    },
    error: {
      color: "red",
      textAlign: "center",
      fontSize: "0.9rem",
      marginBottom: "10px",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al iniciar sesión");
        return;
      }

      // Guardamos token y user en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirigir al dashboard o página principal
      navigate("/tiendas");
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>Bienvenido 👋</h1>
        {error && <p style={styles.error}>{error}</p>}
        <form style={styles.form} onSubmit={handleSubmit}>
          <div>
            <label style={styles.label}>Correo</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={styles.button}>
            Ingresar
          </button>
        </form>
        <p style={styles.registerText}>
          ¿No tienes cuenta?{" "}
          <a href="/registro" style={styles.link}>
            Regístrate
          </a>
        </p>
                {/* 🔥 Botón para admin */}
        <button 
          style={styles.adminButton} 
          onClick={() => navigate("/admin-login")}
        >
          Entrar como Administrador
        </button>
      </div>
    </div>
  );
}
