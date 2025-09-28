import React, { useEffect, useState } from "react";

function Tiendas() {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [cart, setCart] = useState({});

  // Cargar tiendas
  useEffect(() => {
    fetch("http://localhost:3000/api/admin/stores")
      .then((res) => res.json())
      .then(setStores)
      .catch((err) => console.error("Error cargando tiendas", err));
  }, []);

  // Cargar productos de la tienda seleccionada
  useEffect(() => {
    if (selectedStore) {
      fetch("http://localhost:3000/api/admin/products")
        .then((res) => res.json())
        .then((data) => {
          const filtered = data.filter((p) => p.store_id == selectedStore);
          setProducts(filtered);
        })
        .catch((err) => console.error("Error cargando productos", err));
    } else {
      setProducts([]);
    }
  }, [selectedStore]);

  // Agregar producto al carrito
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev[product.id] || { ...product, quantity: 0 };
      return {
        ...prev,
        [product.id]: { ...existing, quantity: existing.quantity + 1 },
      };
    });
  };

  // Quitar producto del carrito
  const removeFromCart = (product) => {
    setCart((prev) => {
      const existing = prev[product.id];
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        const copy = { ...prev };
        delete copy[product.id];
        return copy;
      }
      return {
        ...prev,
        [product.id]: { ...existing, quantity: existing.quantity - 1 },
      };
    });
  };

  // Calcular total
  const total = Object.values(cart).reduce(
    (sum, item) => sum + item.price_cents * item.quantity,
    0
  );

  // Formato de moneda
  const formatCOP = (cents) =>
    `$${cents.toLocaleString("es-CO")} COP`;

  // Filtrar productos por tipo y precio
  const filteredProducts = products.filter((p) => {
    let ok = true;
    if (selectedType && p.type !== selectedType) ok = false;
    if (priceMin && p.price_cents < parseInt(priceMin)) ok = false;
    if (priceMax && p.price_cents > parseInt(priceMax)) ok = false;
    return ok;
  });

  const selectedStoreData = stores.find((s) => s.id == selectedStore);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        background: "linear-gradient(to right, #6ee7b7, #3b82f6)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", fontSize: "36px", fontWeight: "bold" }}>
        🛒 TIENDA-VIRTUAL
      </h1>

      {/* Filtros */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          margin: "20px 0",
        }}
      >
        <select
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          style={{ padding: "8px", borderRadius: "6px" }}
        >
          <option value="">Selecciona una tienda</option>
          {stores.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={{ padding: "8px", borderRadius: "6px" }}
        >
          <option value="">Todos los tipos</option>
          <option value="Comida">Comida</option>
          <option value="Electronicos">Electrónicos</option>
          <option value="Medicina">Medicina</option>
          <option value="Riesgoso">Riesgoso</option>
          <option value="Vestuario">Vestuario</option>
          <option value="Asesoríos">Asesoríos</option>
          <option value="Belleza">Belleza</option>
          <option value="Otros">Otros</option>
        </select>

        <input
          type="number"
          placeholder="Precio mín"
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
          style={{ padding: "8px", borderRadius: "6px", width: "120px" }}
        />
        <input
          type="number"
          placeholder="Precio máx"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
          style={{ padding: "8px", borderRadius: "6px", width: "120px" }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr 1fr",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {/* Descripción de tienda */}
        <div
          style={{
            background: "#f1ecdaff",
            padding: "15px",
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
          }}
        >
          {selectedStoreData ? (
            <>
              <h2 style={{ marginBottom: "10px" }}>{selectedStoreData.name}</h2>
              <p>{selectedStoreData.description}</p>
            </>
          ) : (
            <p>Selecciona una tienda para ver su descripción</p>
          )}
        </div>

        {/* Productos */}
        <div
          style={{
            background: "#c5fdfdff",
            padding: "15px",
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          <h2>Productos</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "15px",
              marginTop: "10px",
            }}
          >
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                style={{
                  border: "1px solid #2663f2ff",
                  padding: "15px",
                  borderRadius: "8px",
                  background: "white",
                  textAlign: "center",
                }}
              >
                <h3 style={{ fontSize: "18px", marginBottom: "5px" }}>
                  {p.name}
                </h3>
                <p>Tipo: {p.type}</p>
                <p>Precio: {formatCOP(p.price_cents)}</p>
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                  <button
                    onClick={() => removeFromCart(p)}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    -
                  </button>
                  <span>
                    {cart[p.id]?.quantity || 0}
                  </span>
                  <button
                    onClick={() => addToCart(p)}
                    style={{
                      background: "#22c55e",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carrito */}
        <div
          style={{
            background: "#fdf6e3",
            padding: "15px",
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          <h2
            style={{
              background: "#3b82f6",
              color: "white",
              padding: "8px",
              borderRadius: "6px",
              textAlign: "center",
            }}
          >
            Carrito
          </h2>
          <ul>
            {Object.values(cart).map((item) => (
              <li key={item.id}>
                {item.quantity} × {item.name} ={" "}
                {formatCOP(item.price_cents * item.quantity)}
              </li>
            ))}
          </ul>
          <h3 style={{ marginTop: "10px", fontWeight: "bold" }}>
            Total: {formatCOP(total)}
          </h3>
          <button
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "10px",
              width: "100%",
              fontSize: "16px",
            }}
            onClick={() => alert("Comprar aún no implementado")}
          >
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Tiendas;
