import './App.css'
import { PaginaInicial } from './pages/PaginaInicial.jsx'
import { Productos } from './pages/Productos.jsx'
import Ingresar from './pages/Ingresar.jsx'
import { Registrar } from './pages/Registrar.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../context/AuthProvider'
import Auth from './layout/Auth'
import { PrivateRoute } from './routes/PrivateRoute.jsx'
import Forgot from './pages/Forgot.jsx'
import { NoEncontrada } from './pages/NoEncontrada.jsx'
import { Confirmar } from './pages/ConfirmarEmail'
import { Confirmartienda } from './pages/confirmartienda.jsx'
import Restablecer from './pages/Restablecer'
import Listar from './pages/Listar.jsx'
import Crear from './pages/Crear.jsx'
import BuscarProducto from './pages/BuscarProducto.jsx'
import Dashboard from './layout/Dashboard.jsx'
import Listartienda from './pages/Listartienda.jsx'
import Confirmacion_registro_tienda from './pages/Confirmacion_registro_tienda.jsx'
import CrearProducto from './pages/CrearProductos.jsx'
import AdministrarTienda from './pages/AdministrarTienda.jsx'
import AdministrarProducto from './pages/AdministrarProducto.jsx'
import Terminos from './pages/Terminos.jsx'
import ApkDownload from './pages/ApkDownload.jsx'
import Moderadores from './pages/Moderadores.jsx'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route index element={<PaginaInicial />} />
          <Route path="/" element={<Auth />}>
            <Route path="ingresar" element={<Ingresar />} />
            <Route path="registrar" element={<Registrar />} />
            <Route path="usuario/confirmar/:token" element={<Confirmar />} />
            <Route path="/confirmartienda/:tokentienda" element={<Confirmartienda />} />
            <Route path="forgot/:id" element={<Forgot />} />
            <Route path="/usuario/recuperar-password/:token" element={<Restablecer />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="dashboard/listar" element={<Listar />} />
            <Route path="dashboard/confirmacion" element={<Confirmacion_registro_tienda />} />
            <Route path="dashboard/crear" element={<Crear />} />
            <Route path="dashboard/listartienda" element={<Listartienda />} />
            <Route path="dashboard/buscar" element={<BuscarProducto />} />
            <Route path="dashboard/crearproducto" element={<CrearProducto />} />
            <Route path="dashboard/administrartienda" element={<AdministrarTienda />} />
            <Route path="dashboard/actualizarproducto" element={<AdministrarProducto />} />
            
            {/* Nuevas rutas añadidas */}
            <Route path="terminos" element={<Terminos />} />
            <Route path="apk-download" element={<ApkDownload />} />
            <Route path="moderadores" element={<Moderadores />} />
            
            <Route path="*" element={<NoEncontrada />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
