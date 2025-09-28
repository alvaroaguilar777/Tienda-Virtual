import { Link } from "react-router-dom";

export default function Admin() {
  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(to right, #7e22ce, #ec4899, #ef4444)",
    },
    box: {
      background: "white",
      padding: "40px",
      borderRadius: "20px",
      width: "400px",
      textAlign: "center",
      boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "bold",
      marginBottom: "20px",
      background: "linear-gradient(to right, #7e22ce, #ec4899)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    link: {
      display: "block",
      padding: "15px",
      margin: "10px 0",
      borderRadius: "10px",
      textDecoration: "none",
      color: "white",
      fontWeight: "bold",
      background: "linear-gradient(to right, #7e22ce, #ec4899)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      transition: "0.3s",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>Panel Administrativo</h1>
        <Link to="/admin/tiendas" style={styles.link}>Administrar Tiendas</Link>
        <Link to="/admin/productos" style={styles.link}>Administrar Productos</Link>
        <Link to="/admin/usuarios" style={styles.link}>Administrar Usuarios</Link>
        <Link to="/?" style={styles.link}>Salir De Administrador</Link>
      </div>
    </div>
  );
}
