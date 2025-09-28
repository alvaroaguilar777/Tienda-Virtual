import React, { useEffect, useState } from "react";

export default function AdminProductos() {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [storeId, setStoreId] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Cargar tiendas y productos
  useEffect(() => {
    fetch("http://localhost:3000/api/admin/stores")
      .then((res) => res.json())
      .then((data) => setStores(data))
      .catch((err) => console.error("Error cargando tiendas:", err));

    fetch("http://localhost:3000/api/admin/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  // Agregar producto
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMensaje("");

    // Convierte price a número
    const priceInt = parseInt(price, 10);
    const storeIdInt = parseInt(storeId, 10);

    const res = await fetch("http://localhost:3000/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ store_id: storeIdInt, name, type, price_cents: priceInt }),
    });

    const data = await res.json();
    if (res.ok) {
      setProducts([...products, data]);
      setMensaje("✅ Producto agregado con éxito");
      setName("");
      setType("");
      setStoreId("");
      setPrice("");
    } else {
      setMensaje("❌ Error: " + (data.error || "No se pudo agregar"));
    }
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

    const res = await fetch(`http://localhost:3000/api/admin/products/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setProducts(products.filter((p) => p.id !== id));
      setMensaje("🗑️ Producto eliminado");
    } else {
      setMensaje("❌ No se pudo eliminar");
    }
  };

  // 🔢 Formato moneda COP
  const formatCOP = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <h2 style={styles.title}>Administrar Productos</h2>

        {mensaje && <p style={styles.message}>{mensaje}</p>}

        {/* Formulario */}
        <form onSubmit={handleAddProduct} style={styles.form}>
          {/* Selector de tienda */}
          <select
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            required
            style={styles.input}
          >
            <option value="">Seleccione una tienda</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>

          {/* Nombre del producto */}
          <input
            type="text"
            placeholder="Nombre del producto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />

          {/* Precio del producto con $ y COP */}
          <div style={styles.priceWrapper}>
            <span style={styles.pricePrefix}>$</span>
            <input
              type="number"
              placeholder="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              style={styles.priceInput}
            />
            <span style={styles.priceSuffix}>COP</span>
          </div>

          {/* Selector de tipo */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            style={styles.input}
          >
            <option value="">Seleccione el tipo</option>
            <option value="Comida">Comida</option>
            <option value="Muebles">Muebles</option>
            <option value="Electrónicos">Electrónicos</option>
            <option value="Medicina">Medicina</option>
            <option value="Riesgoso">Riesgoso</option>
            <option value="Vestuario">Vestuario</option>
            <option value="Asesoríos">Asesoríos</option>
            <option value="Belleza">Belleza</option>
            <option value="Otros">Otros</option>
          </select>

          <button type="submit" style={styles.buttonPrimary}>
            ➕ Agregar Producto
          </button>
        </form>

        {/* Lista de productos */}
        <h3 style={styles.subtitle}>Productos registrados</h3>
        <div style={styles.grid}>
          {products.map((product) => (
            <div key={product.id} style={styles.card}>
              <h4 style={styles.cardTitle}>{product.name}</h4>
              <p style={styles.cardText}>
                <b>Tienda:</b>{" "}
                {stores.find((s) => s.id === product.store_id)?.name || "N/A"}
              </p>
              <p style={styles.cardText}>
                <b>Precio:</b> {formatCOP(product.price_cents)}
              </p>
              <p style={styles.cardText}>
                <b>Tipo:</b> {product.type}
              </p>
              <button
                style={styles.buttonDanger}
                onClick={() => handleDelete(product.id)}
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

// 🎨 Estilos
const styles = {
  background: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "30px",
    background: "linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)",
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
  priceWrapper: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "6px",
    padding: "5px 10px",
  },
  pricePrefix: {
    marginRight: "5px",
    fontWeight: "bold",
    color: "#333",
  },
  priceInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "16px",
    padding: "8px",
  },
  priceSuffix: {
    marginLeft: "5px",
    fontWeight: "bold",
    color: "#333",
  },
  buttonPrimary: {
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    background: "#3498db",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
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
