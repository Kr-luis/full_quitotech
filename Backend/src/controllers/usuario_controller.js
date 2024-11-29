import Propietario from "../models/usuario.js"
import Tienda from "../models/tienda.js"
import Producto from "../models/producto.js"
import { sendMailToAdmin,sendMailToUser2, sendMailToRecoveryPassword } from "../config/nodemailer.js"
import generarJWT from "../helpers/crearJWT.js"
import mongoose from "mongoose";


const registro = async (req,res)=>{
    const {nombre, apellido,email,password,numero} = req.body
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const verificarEmailBDD = await Propietario.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"El email ya se encuentra registrado, intente con uno diferente"})
    const nuevoUsuario = new Propietario(req.body)
    nuevoUsuario.password = await nuevoUsuario.encrypPassword(password)
    nuevoUsuario.crearToken()
    await nuevoUsuario.save()
    const token = nuevoUsuario.crearToken()
    await sendMailToUser2(email,token)
    await nuevoUsuario.save()
    res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})
}

const confirmEmail = async (req,res)=>{
    //: ACTIVIDAD 1
    if(!(req.params.token)) return res.status(400).json({msg:"Lo sentimos, no se puede validar la cuenta"})

    const UsuarioBDD = await Propietario.findOne({token:req.params.token})
    if(!UsuarioBDD?.token) return res.status(404).json({msg:"Algo ha ocurrido, parece que la cuenta ya ha sido confirmada"})

    UsuarioBDD.token = null
    UsuarioBDD.confirmEmail=true
    await UsuarioBDD.save()

    res.status(200).json({msg:"Felicidades su cuenta ha sido confirmada, puede iniciar sesion"}) 
} // * BIEN
const actualizarPerfil = async (req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:'Lo sentimos, debe ser un id válido'});
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const UsuarioBDD = await Propietario.findById(id)
    if(!UsuarioBDD) return res.status(404).json({msg:`Lo sentimos, el Usuario ${id} no existe!`})
    if (UsuarioBDD.email !=  req.body.email)
    {
        const UsuarioBDDMail = await Propietario.findOne({email:req.body.email})
        if (UsuarioBDDMail)
        {
            return res.status(404).json({msg:"Lo sentimos, el perfil ya se encuentra registrado"})  
        }
    }
	UsuarioBDD.nombre = req.body.nombre || UsuarioBDD?.nombre
    UsuarioBDD.apellido = req.body.apellido  || UsuarioBDD?.apellido
    UsuarioBDD.direccion = req.body.direccion || UsuarioBDD?.direccion
    UsuarioBDD.telefono = req.body.telefono || UsuarioBDD?.telefono
    UsuarioBDD.email = req.body.email || UsuarioBDD?.email
    await UsuarioBDD.save()
    res.status(200).json({msg:"Perfil actualizado correctamente"})
} // * BIEN
const actualizarPassword = async (req,res)=>{
    const UsuarioBDD = await Propietario.findById(req.UsuarioBDD._id)
    if(!UsuarioBDD) return res.status(404).json({msg:`Lo sentimos, no existe el Usuario ${id}`})
    const verificarPassword = await UsuarioBDD.matchPassword(req.body.passwordactual)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, la contraseña actual no es la correcta"})
    UsuarioBDD.password = await UsuarioBDD.encrypPassword(req.body.passwordnuevo)
    await UsuarioBDD.save()
    res.status(200).json({msg:"Password actualizado correctamente"})
} // * BIEN
const recuperarPassword = async (req,res)=>{
    const {email} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const UsuarioBDD = await Propietario.findOne({email})
    if(!UsuarioBDD) return res.status(404).json({msg:"Lo sentimos, el Usuario no se encuentra registrado"})
    const token = UsuarioBDD.crearToken()
    UsuarioBDD.token=token
    await sendMailToRecoveryPassword(email,token)
    await UsuarioBDD.save()
    res.status(200).json({msg:"Revisa tu correo electrónico para recuperar tu contraseña"})
}// * BIEN
const comprobarTokenPasword = async (req,res)=>{
 
    if(!(req.params.token)) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    const UsuarioBDD = await Propietario.findOne({token:req.params.token})
    if(UsuarioBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    await UsuarioBDD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes crear tu nueva contraseña"}) 
}// * BIEN
const nuevoPassword = async (req,res)=>{
    const{password,confirmpassword} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    if(password != confirmpassword) return res.status(404).json({msg:"Lo sentimos, las contraseñas no coinciden"})
    const UsuarioBDD = await Propietario.findOne({token:req.params.token})
    if(UsuarioBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
        UsuarioBDD.token = null
    UsuarioBDD.password = await UsuarioBDD.encrypPassword(password)
    await UsuarioBDD.save()
    res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nueva contrase;a"}) 
}// * BIEN
const actualizarEmail =async (req,res)=>{
    const {email}= req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const verifyemailUser = Usuario.findOne({email})
    if (verifyemailUser?.email) return res.status(409).json({msg:"Lo sentimos, el email ya esta registrado"})

    const newUsuarioBDD = await Propietario.findOne(req.UsuarioBDD._id)
    newUsuarioBDD.email=email
    await newUsuarioBDD.save()
    res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo email"}) 
}// * BIEN
const login = async(req,res)=>{
    const {email,password} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const UsuarioBDD = await Propietario.findOne({email})
    if(UsuarioBDD?.confirmEmail===false) return res.status(403).json({msg:"Lo sentimos, debe verificar su cuenta"})
    if(!UsuarioBDD) return res.status(404).json({msg:"Lo sentimos, el Usuario no se encuentra registrado"})
    const verificarPassword = await UsuarioBDD.matchPassword(password)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})
    const token = generarJWT(UsuarioBDD._id,"Usuario")
		const {nombre,apellido,direccion,telefono,_id} = UsuarioBDD
    res.status(200).json({
        token,
        nombre,
        apellido,
        direccion,
        telefono,
        _id,
        email:UsuarioBDD.email,
        Usuario:UsuarioBDD.Usuario})
} // * BIEN
const perfil = (req,res)=>{
    delete req.UsuarioBDD.token
    delete req.UsuarioBDD.tokentienda
    delete req.UsuarioBDD.confirmEmail
    delete req.UsuarioBDD.createdAt
    delete req.UsuarioBDD.updatedAt
    delete req.UsuarioBDD.__v
    res.status(200).json(req.UsuarioBDD)
} // * BIEN

// ! ENDPOINTS TIENDA
const confirmarTienda = async (req,res)=>{
    const { tokentienda } = req.params;
    //: ACTIVIDAD 1
    if(!tokentienda) return res.status(400).json({msg:"Lo sentimos, no se puede validar la tienda"})
    //: ACTIVIDAD 2
    const Usuario = await Propietario.findOne({ tokentienda });
    if(!Usuario) return res.status(404).json({msg:"Token inválido o Usuario no encontrado"})
    //: ACTIVIDAD 3
    if(Usuario.Usuario === true) return res.status(404).json({msg:"Usuario ya posee una tienda"})

    const tienda = await Tienda.findOne({ id_Usuario : Usuario._id });
    
    if(!tienda)return res.status(404).json({ msg: "Tienda no encontrada" });
   
    tienda.Verificado = true;
    Usuario.tokentienda = null;
    Usuario.Usuario = true;
    
    await tienda.save();
    await Propietario.save();
    res.status(200).json({msg:"Negocio verificado, la tienda ha sido aprovada!"}) 
} // * BIEN
const solicitarTienda = async (req, res) => {
    try {
        // Extraer datos del cuerpo de la solicitud
        const { Nombre, Direccion, email, id_Usuario } = req.body;

        // Buscar Usuario en la base de datos por email
        const UsuarioBDD = await Propietario.findOne({ email });

        // Verificar si el Usuario fue encontrado
        if (!UsuarioBDD) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        // Verificar que todos los campos estén presentes
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
        }

        // Verificar si el email pertenece al Usuario
        if (UsuarioBDD.email !== email) {
            return res.status(400).json({ msg: "Lo sentimos, debe ser un email tuyo" });
        }

        // Verificar si el Usuario ya posee una tienda
        if (UsuarioBDD.Usuario) {
            return res.status(400).json({ msg: "Usuario ya posee una tienda" });
        }
        console.log(req.body);
        // Crear nueva tienda
        const nuevaTienda = new Tienda({
            Nombre : Nombre,
            Direccion : Direccion,
            id_propietario : id_Usuario
        });
        // ! UsuarioBDD.tokentienda = tokenTienda;

        // Guardar los cambios en la base de datos
        await nuevaTienda.save();
        await UsuarioBDD.save();

        // Enviar correo de confirmación
        // ! await sendMailToAdmin(email, tokenTienda);

        // Responder al cliente
        res.status(200).json({ msg: "Tu solicitud será revisada por nuestros administradores, pronto recibirás una confirmación!!" });
    } catch (error) {
        // Manejar errores inesperados
        console.error(error);
        res.status(500).json({ msg: "Error del servidor, por favor intente nuevamente más tarde." });
    }
};


const obtenerTiendaConProductos = async (req, res) => {
    const { id } = req.params;
  
    // Validar que el ID sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID de tienda inválido" });
    }
  
    try {
      // Buscar la tienda
      const tienda = await Tienda.findById(id).select('-createdAt -updatedAt -__v');
      if (!tienda) {
        return res.status(404).json({ msg: "La tienda no existe" });
      }
  
      // Buscar los productos asociados a la tienda
      const productos = await Producto.find({ id_tienda: id })
        .select('-createdAt -updatedAt -__v');
  
      // Responder con los datos de la tienda y sus productos
      res.status(200).json({ tienda, productos });
    } catch (error) {
      console.error("Error al obtener la tienda con productos:", error);
      res.status(500).json({ msg: "Hubo un error al obtener los datos" });
    }
  };

// * BIEN
const listarTiendas = async (req,res)=>{ 
    const tiendas = await Tienda.find({Verificado:true}).where('Tienda').equals(req.TiendaBDD).select("-salida -createdAt -updatedAt -__v").populate('Nombre_tienda Direccion id_Usuario _id')
    res.status(200).json(tiendas)
}// * BIEN
const listarproductosIDtienda = async (req, res) => {
    const { id_tienda } = req.params;
    
    try {
        // Buscar productos por id_tienda
        const productos = await Producto.find({ id_tienda })
            .select("-salida -createdAt -updatedAt -__v")
            .populate('id_tienda', 'Nombre_tienda')  // Asegúrate de que el campo y el modelo referenciado sean correctos
            .populate('Nombre_producto Categoria');

        res.status(200).json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Hubo un error en el servidor", error: error.message });
    }
};//BIEN

const listarTiendasproductos = async (req, res) => {
    try {
      const tiendas = await Tienda.find({ Verificado: true })
        .where('Tienda').equals(req.TiendaBDD)
        .select('Nombre_tienda _id') // Solo selecciona 'Nombre_tienda' y '_id'
        .populate('Nombre_tienda Direccion');
  
      res.status(200).json(tiendas);
    } catch (error) {
      res.status(500).json({ message: "Error al listar tiendas", error });
    }
  };
  const obtenerTiendaDelUsuario = async (req, res) => {
    const { id_Usuario } = req.params;
    
    try {
      const tienda = await Tienda.findOne({ id_Usuario });
      
      if (!tienda) {
        return res.status(404).json({ msg: 'No se encontró una tienda asociada a este Usuario' });
      }
      
      res.status(200).json({ tienda });
    } catch (error) {
      res.status(500).json({ msg: 'Error al obtener la tienda', error });
    }
};


export {
    // ! Rutas de Usuario
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
}