import { useState } from "react";

export default function Registro() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(to right, #7e22ce, #ec4899, #ef4444)",
      fontFamily: "Arial, Helvetica, sans-serif",
      padding: "20px",
      boxSizing: "border-box",
    },
    box: {
      width: "100%",
      maxWidth: "420px",
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(8px)",
      borderRadius: "20px",
      padding: "36px",
      boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
    },
    title: {
      textAlign: "center",
      fontSize: "2.2rem",
      fontWeight: "800",
      marginBottom: "20px",
      background: "linear-gradient(to right, #7e22ce, #ec4899)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "14px",
    },
    label: {
      fontSize: "0.9rem",
      fontWeight: "700",
      color: "#333",
      marginBottom: "6px",
      display: "block",
    },
    input: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #d0d0d0",
      outline: "none",
      fontSize: "1rem",
      transition: "box-shadow .15s, border-color .15s",
    },
    inputFocus: {
      borderColor: "#ec4899",
      boxShadow: "0 0 8px rgba(236,72,153,0.12)",
    },
    button: {
      width: "100%",
      padding: "13px",
      border: "none",
      borderRadius: "10px",
      background: "linear-gradient(to right, #7e22ce, #ec4899)",
      color: "white",
      fontSize: "1.05rem",
      fontWeight: "700",
      cursor: "pointer",
      boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
    },
    hintRow: {
      marginTop: "12px",
      textAlign: "center",
      fontSize: "0.9rem",
      color: "#444",
    },
    link: {
      color: "#ec4899",
      fontWeight: "700",
      textDecoration: "none",
      marginLeft: "6px",
    },
    messageError: {
      marginTop: "8px",
      color: "#b00020",
      fontWeight: 600,
    },
    messageSuccess: {
      marginTop: "8px",
      color: "#137f25",
      fontWeight: 600,
    },
  };

  // simple email validation
  function isValidEmail(mail) {
    return /\S+@\S+\.\S+/.test(mail);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !password || !confirm) {
      setError("Completa todos los campos.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Ingresa un correo válido.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        // el backend puede devolver mensaje en data.error
        throw new Error(data.error || "Error al registrar el usuario");
      }

      setSuccess("Usuario registrado con éxito ✅. Redirigiendo a login...");
      // opcional: limpiar campos
      setName(""); setEmail(""); setPassword(""); setConfirm("");

      // redirigir al login después de 1s
      setTimeout(() => {
        window.location.href = "/?";
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>Crear cuenta ✨</h1>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div>
            <label style={styles.label} htmlFor="name">Nombre</label>
            <input
              id="name"
              style={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre completo"
            />
          </div>

          <div>
            <label style={styles.label} htmlFor="email">Correo</label>
            <input
              id="email"
              type="email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div>
            <label style={styles.label} htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label style={styles.label} htmlFor="confirm">Confirmar contraseña</label>
            <input
              id="confirm"
              type="password"
              style={styles.input}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repite la contraseña"
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Creando..." : "Registrarse"}
          </button>
        </form>

        {error && <div role="alert" style={styles.messageError}>{error}</div>}
        {success && <div role="status" style={styles.messageSuccess}>{success}</div>}

        <p style={styles.hintRow}>
          ¿Ya tienes cuenta?
          <a href="/?" style={styles.link}>Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}
