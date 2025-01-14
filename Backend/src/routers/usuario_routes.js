import { Router } from "express";
import verificarAutenticacion from '../middlewares/autenticacion.js'


import {
    // ! Rutas de usuario

    login,
    perfil,
    registro,
    confirmEmail,
    actualizarPerfil,
    actualizarEmail,
    actualizarPassword,
	recuperarPassword,
    comprobarTokenPasword,
	nuevoPassword,

    // ! Rutas de tienda

    solicitarTienda,
    confirmarTienda,
    listarTiendas,
    listarTiendasproductos,
    obtenerTiendaDelUsuario,
    obtenerTiendaConProductos
} from "../controllers/usuario_controller.js";

const router =Router()

// ! Rutas usuario

router.post('/usuario/login',login) //OK
router.post('/usuario/registro',registro) //OK
router.get('/usuario/confirmar/:token',confirmEmail) //OK
router.post('/usuario/recuperar-password',recuperarPassword) //OK
router.get('/usuario/recuperar-password/:token',comprobarTokenPasword) //OK
router.post('/usuario/nuevo-password/:token',nuevoPassword) //OK
router.get('/usuario/perfil',verificarAutenticacion,perfil) //OK
router.put('/usuario/actualizaremail',verificarAutenticacion,actualizarEmail) //OK
router.put('/usuario/actualizarpassword',verificarAutenticacion,actualizarPassword) //OK
router.put('/usuario/:id',verificarAutenticacion,actualizarPerfil) //OK
router.get('/usuario/tienda/:id_propietario', obtenerTiendaDelUsuario);


// ! Rutas tienda 

router.post('/usuario/solicitud/',verificarAutenticacion,solicitarTienda) //OK
router.get('/confirmartienda/:tokentienda',confirmarTienda) //OK
router.get('/listartiendas',verificarAutenticacion,listarTiendas) //OK
router.get('/tienda/:id',verificarAutenticacion,obtenerTiendaConProductos) //OK
router.get('/listartiendasopciones',verificarAutenticacion,listarTiendasproductos) // OK



export default router
