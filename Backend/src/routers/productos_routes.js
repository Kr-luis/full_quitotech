import { Router } from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import {
    detalleProducto,
    registrarProducto,
    actualizarProducto,
    eliminarProducto,
    cambiarEstado,
    obtenerProductos,
    ProductosInactivos,
    listarproductosporCategoria
} from "../controllers/productos_controller.js";
import verificarAutenticacion from "../middlewares/autenticacion.js";

const router = Router();


router.post('/producto/registro',verificarAutenticacion, registrarProducto);
router.get('/producto/:id', detalleProducto);
router.get('/productos/enstock', obtenerProductos);
router.get('/productos/enstock/:Categoria', listarproductosporCategoria);
router.get('/productos/sinstock', ProductosInactivos);
router.put('/producto/:id', verificarAutenticacion,actualizarProducto);
router.put('/producto/estado/:id', verificarAutenticacion,cambiarEstado);
router.delete('/producto/:id', verificarAutenticacion,eliminarProducto);

export default router;
