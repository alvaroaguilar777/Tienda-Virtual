import React, { useEffect, useState } from "react";

export default function AdminTiendas() {
  const [stores, setStores] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Cargar tiendas existentes al montar el componente
  useEffect(() => {
    fetch("http://localhost:3000/api/admin/stores")
      .then((res) => res.json())
      .then((data) => setStores(data))
      .catch((err) => console.error("Error cargando tiendas:", err));
  }, []);

  // Agregar nueva tienda
  const handleAddStore = async (e) => {
    e.preventDefault();
    setMensaje("");

    const res = await fetch("http://localhost:3000/api/admin/stores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    const data = await res.json();
    if (res.ok) {
      setStores([...stores, data]);
      setMensaje("✅ Tienda agregada con éxito");
      setName("");
      setDescription("");
    } else {
      setMensaje("❌ Error: " + (data.error || "No se pudo agregar"));
    }
  };

  // Eliminar tienda
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta tienda?")) return;

    const res = await fetch(`http://localhost:3000/api/admin/stores/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setStores(stores.filter((s) => s.id !== id));
      setMensaje("🗑️ Tienda eliminada");
    } else {
      setMensaje("❌ No se pudo eliminar");
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h2 style={styles.title}>Administrar Tiendas</h2>

        {mensaje && <p style={styles.message}>{mensaje}</p>}

        {/* Formulario */}
        <form onSubmit={handleAddStore} style={styles.form}>
          <input
            type="text"
            placeholder="Nombre de la tienda"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
          <textarea
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
          ></textarea>
          <button type="submit" style={styles.buttonPrimary}>
            ➕ Agregar Tienda
          </button>
        </form>

        {/* Lista de tiendas */}
        <h3 style={styles.subtitle}>Tiendas registradas</h3>
        <div style={styles.grid}>
          {stores.map((store) => (
            <div key={store.id} style={styles.card}>
              <h4 style={styles.cardTitle}>{store.name}</h4>
              <p style={styles.cardText}>{store.description}</p>
              <button
                style={styles.buttonDanger}
                onClick={() => handleDelete(store.id)}
              >
                🗑️ Eliminar
              </button>
            </div>
          ))}
        </div>

        {/* Botón volver */}
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

// 🎨 Estilos en JS
const styles = {
  background: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "30px",
    background: "linear-gradient(135deg, #a011cbff 0%, #2575fc 100%)", // 🌈 Degradado
  },
  container: {
    background: "rgba(255,255,255,0.95)",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "900px",
  },
  title: {
    textAlign: "center",
    color: "#2c3e50",
    marginBottom: "20px",
  },
  subtitle: {
    marginTop: "30px",
    color: "#34495e",
  },
  message: {
    background: "#f1f1f1",
    padding: "10px",
    borderRadius: "6px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  textarea: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    minHeight: "80px",
    fontSize: "16px",
  },
  buttonPrimary: {
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    background: "#3498db",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
  },
  buttonDanger: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    background: "#e74c3c",
    color: "#fff",
    cursor: "pointer",
    marginTop: "10px",
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
    marginTop: "15px",
  },
  card: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    margin: "0 0 8px 0",
    color: "#2c3e50",
  },
  cardText: {
    margin: "0",
    color: "#555",
  },
};
