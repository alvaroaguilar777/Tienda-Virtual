import React, { useEffect, useState } from "react";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // Cargar usuarios al montar
  useEffect(() => {
    fetch("http://localhost:3000/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => setMensaje("❌ Error cargando usuarios"));
  }, []);

  // Eliminar usuario
  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;

    const res = await fetch(`http://localhost:3000/api/admin/users/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setUsuarios(usuarios.filter((u) => u.id !== id));
      setMensaje("🗑️ Usuario eliminado");
    } else {
      setMensaje("❌ No se pudo eliminar");
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h2 style={styles.title}>Administrar Usuarios 👥</h2>
        {mensaje && <p style={styles.message}>{mensaje}</p>}
        <ul style={styles.list}>
          {usuarios.map((u) => (
            <li key={u.id} style={styles.card}>
              <div>
                <b>{u.name || "Sin nombre"}</b>
                <div style={{ color: "#555" }}>{u.email}</div>
              </div>
              <button
                style={styles.buttonDanger}
                onClick={() => eliminarUsuario(u.id)}
              >
                🗑️ Eliminar
              </button>
            </li>
          ))}
        </ul>
        <button
          style={styles.buttonBack}
          onClick={() => (window.location.href = "/admin")}
        >
          🔙 Volver al Panel
        </button>
      </div>
    </div>
  );
}

// 🎨 Estilos
const styles = {
  background: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "30px",
    background: "linear-gradient(135deg, #a011cbff 0%, #2575fc 100%)",
  },
  container: {
    background: "rgba(255,255,255,0.95)",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "700px",
  },
  title: {
    textAlign: "center",
    color: "#2c3e50",
    marginBottom: "20px",
  },
  message: {
    background: "#f1f1f1",
    padding: "10px",
    borderRadius: "6px",
    textAlign: "center",
    marginBottom: "15px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "grid",
    gap: "15px",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },
  buttonDanger: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    background: "#e74c3c",
    color: "#fff",
    cursor: "pointer",
    fontSize: "15px",
  },
  buttonBack: {
    marginTop: "30px",
    display: "block",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    background: "#95a5a6",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
  },
};