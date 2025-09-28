import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Tiendas from "./pages/Tiendas";
import Carrito from "./pages/Carrito";
import CompraExitosa from "./pages/CompraExitosa";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminTiendas from "./pages/AdminTiendas";
import AdminProductos from "./pages/AdminProductos";
import AdminUsuarios from "./pages/AdminUsuarios";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/tiendas" element={<Tiendas />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/compra-exitosa" element={<CompraExitosa />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/tiendas" element={<AdminTiendas />} />
        <Route path="/admin/productos" element={<AdminProductos />} />
        <Route path="/admin/usuarios" element={<AdminUsuarios />} />
      </Routes>
    </Router>
  );
}

export default App;
