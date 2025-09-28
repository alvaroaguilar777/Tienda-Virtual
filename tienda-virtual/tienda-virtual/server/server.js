import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET = "supersecreto"; 
const PORT = 3000;

// Inicializar Express
const app = express();
app.use(cors());
app.use(express.json());

// Conexión SQLite
const db = new Database("tienda.db");


// AUTENTICACIÓN 
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const exists = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (exists) {
    return res.status(400).json({ error: "El correo ya está registrado" });
  }

  const hashed = bcrypt.hashSync(password, 10);
  const info = db
    .prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)")
    .run(name, email, hashed);

  res.status(201).json({ id: info.lastInsertRowid, name, email });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ error: "Contraseña incorrecta" });

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
    expiresIn: "2h",
  });

  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// ADMIN USERS 
app.get("/api/admin/users", (req, res) => {
  const rows = db.prepare("SELECT id, name, email FROM users").all();
  res.json(rows);
});

app.delete("/api/admin/users/:id", (req, res) => {
  const { id } = req.params;
  const info = db.prepare("DELETE FROM users WHERE id = ?").run(id);
  if (info.changes === 0)
    return res.status(404).json({ error: "Usuario no encontrado" });

  res.json({ message: "Usuario eliminado" });
});

// ADMIN STORES 
app.get("/api/admin/stores", (req, res) => {
  const rows = db.prepare("SELECT * FROM stores").all();
  res.json(rows);
});

app.post("/api/admin/stores", (req, res) => {
  const { name, description, image_url } = req.body;
  if (!name) return res.status(400).json({ error: "Nombre es obligatorio" });

  const info = db
    .prepare("INSERT INTO stores (name, description, image_url) VALUES (?, ?, ?)")
    .run(name, description || "", image_url || "");

  res
    .status(201)
    .json({ id: info.lastInsertRowid, name, description, image_url });
});

app.put("/api/admin/stores/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, image_url } = req.body;

  const info = db
    .prepare("UPDATE stores SET name=?, description=?, image_url=? WHERE id=?")
    .run(name, description || "", image_url || "", id);

  if (info.changes === 0)
    return res.status(404).json({ error: "Tienda no encontrada" });

  res.json({ message: "Tienda actualizada" });
});

app.delete("/api/admin/stores/:id", (req, res) => {
  const { id } = req.params;
  const info = db.prepare("DELETE FROM stores WHERE id=?").run(id);
  if (info.changes === 0)
    return res.status(404).json({ error: "Tienda no encontrada" });

  res.json({ message: "Tienda eliminada" });
});

// ADMIN PRODUCTS 
app.get("/api/admin/products", (req, res) => {
  const rows = db
    .prepare(
      `SELECT p.*, s.name as store_name
       FROM products p
       JOIN stores s ON s.id = p.store_id`
    )
    .all();
  res.json(rows);
});
 
app.post("/api/admin/products", (req, res) => {
  const { store_id, name, price_cents, type, image_url } = req.body;
  if (!store_id || !name || !price_cents || !type) {
    return res.status(400).json({ error: "Faltan campos" });
  }

  const info = db
    .prepare(
      "INSERT INTO products (store_id, name, price_cents, type, image_url) VALUES (?, ?, ?, ?, ?)"
    )
    .run(store_id, name, parseInt(price_cents), type, image_url || "");

  res.status(201).json({
    id: info.lastInsertRowid,
    store_id,
    name,
    price_cents,
    type,
    image_url,
  });
});

app.put("/api/admin/products/:id", (req, res) => {
  const { id } = req.params;
  const { store_id, name, price_cents, type, image_url } = req.body;

  const info = db
    .prepare(
      "UPDATE products SET store_id=?, name=?, price_cents=?, type=?, image_url=? WHERE id=?"
    )
    .run(store_id, name, parseInt(price_cents), type, image_url || "", id);

  if (info.changes === 0)
    return res.status(404).json({ error: "Producto no encontrado" });

  res.json({ message: "Producto actualizado" });
});

app.delete("/api/admin/products/:id", (req, res) => {
  const { id } = req.params;
  const info = db.prepare("DELETE FROM products WHERE id=?").run(id);
  if (info.changes === 0)
    return res.status(404).json({ error: "Producto no encontrado" });

  res.json({ message: "Producto eliminado" });
});

// ORDENES 
app.post("/api/orders", (req, res) => {
  const { buyerName, paymentMethod, total, items } = req.body;

  if (!buyerName || !paymentMethod || !items || items.length === 0) {
    return res.status(400).json({ error: "Faltan datos o carrito vacío" });
  }

  try {
    const trx = db.transaction(() => {
      const orderInfo = db
        .prepare(
          "INSERT INTO orders (buyer_name, payment_method, total_cents) VALUES (?, ?, ?)"
        )
        .run(buyerName, paymentMethod, total);

      const orderId = orderInfo.lastInsertRowid;

      const stmt = db.prepare(
        "INSERT INTO order_items (order_id, product_id, quantity, price_cents) VALUES (?, ?, ?, ?)"
      );

      for (const item of items) {
        stmt.run(orderId, item.product_id, item.quantity, item.price_cents);
      }

      return orderId;
    });

    const orderId = trx();

    return res.status(201).json({
      message: "Compra exitosa",
      receipt: {
        orderId,
        buyerName,
        paymentMethod,
        total_cents: total,
        items,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al procesar compra" });
  }
});

app.get("/api/me/orders", (req, res) => {
  const orders = db.prepare("SELECT * FROM orders ORDER BY id DESC").all();

  const itemsStmt = db.prepare(
    `SELECT oi.*, p.name as product_name 
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id 
     WHERE order_id = ?`
  );

  const result = orders.map((o) => ({
    ...o,
    items: itemsStmt.all(o.id),
  }));

  res.json(result);
});

// PUBLIC STORES & PRODUCTS 

// Listar todas las tiendas (público)
app.get("/api/stores", (req, res) => {
  const rows = db.prepare("SELECT id, name, description FROM stores").all();
  res.json(rows);
});

// Listar productos de una tienda en específico (público)
app.get("/api/stores/:id/products", (req, res) => {
  const { id } = req.params;
  const rows = db
    .prepare(
      `SELECT p.id, p.name, p.price_cents, p.type, p.image_url
       FROM products p
       WHERE p.store_id = ?`
    )
    .all(id);

  res.json(rows);
});


// START SERVER 
app.listen(PORT, () => {
  console.log(`✅ API lista en http://localhost:${PORT}`);
});
