import UsuarioMovil from "../models/usuariomovil.js"
import mongoose from "mongoose";


const registro = async (req,res)=>{
    const {nombre,email,password, acepta_terminos} = req.body
    if(acepta_terminos === "false") return res.status(400).json({msg:"Para continuar debe aceptar nuestros terminos y condiciones"})
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const verificarEmailBDD = await UsuarioMovil.findOne({email})
    if(verificarEmailBDD) return res.status(400).json({msg:"El email ya se encuentra registrado, intente con uno diferente"})
    const nuevoUsuario = new UsuarioMovil(req.body)
    nuevoUsuario.password = await nuevoUsuario.encrypPassword(password)
    await nuevoUsuario.save()
    await nuevoUsuario.save()
    res.status(200).json({msg:"Tu cuenta fue creada exitosamente"})
}
const login = async (req, res) => {
    const { email, password } = req.body;
    // Verificar si hay campos vacíos
    if (Object.values(req.body).includes("")) {
        return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }
    try {
        // Buscar usuario por email
        const UsuarioBDD = await UsuarioMovil.findOne({ email });
        // Verificar si el usuario existe
        if (!UsuarioBDD) {
            return res.status(404).json({ msg: "Lo sentimos, el Usuario no se encuentra registrado" });
        }
        // Verificar contraseña
        const verificarPassword = await UsuarioBDD.matchPassword(password);
        if (!verificarPassword) {
            return res.status(404).json({ msg: "Lo sentimos, el password no es el correcto" });
        }
        // Desestructurar propiedades del usuario
        const { _id, nombre } = UsuarioBDD;
        // Enviar respuesta con el id del usuario incluido
        res.status(200).json({
            id: _id,  // Incluye el ID en la respuesta
            nombre,
            email: UsuarioBDD.email,
        });
    } catch (error) {
        res.status(500).json({ msg: "Hubo un error en el servidor", error });
    }
};
const actualizarPassword = async (req, res) => {
    const { nuevopassword, confirmarpassword, id } = req.body;

    // Verificar que todos los campos estén presentes
    if (Object.values(req.body).includes("")) {
        return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    try {
        const usuarioBDD = await UsuarioMovil.findById(id);
        if (!usuarioBDD) {
            return res.status(404).json({ msg: `Lo sentimos, no existe el Usuario ${id}` });
        }
        if (nuevopassword !== confirmarpassword) {
            return res.status(400).json({ msg: "Lo sentimos, las contraseñas no coinciden" });
        }
        const hashedPassword = await usuarioBDD.encrypPassword(nuevopassword);
        await UsuarioMovil.findByIdAndUpdate(
            id,
            { password: hashedPassword },
            { new: true }
        );
        res.status(200).json({ msg: "Contraseña actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        res.status(500).json({ msg: "Error del servidor, por favor intente nuevamente más tarde." });
    }
};
const olvidoPassword = async (req, res) => {
    const { nuevopassword, confirmarpassword, email } = req.body;

    if (!nuevopassword || !confirmarpassword || !email) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    try {
        const usuarioBDD = await UsuarioMovil.findOne({ email });
        if (!usuarioBDD) {
            return res.status(404).json({ msg: `Lo sentimos, no existe el usuario con el email ${email}` });
        }

        if (nuevopassword !== confirmarpassword) {
            return res.status(400).json({ msg: "Lo sentimos, las contraseñas no coinciden" });
        }

        // Generar hash de la contraseña
        const hashedPassword = await usuarioBDD.encrypPassword(nuevopassword);

        await UsuarioMovil.findByIdAndUpdate(
            usuarioBDD._id,
            { password: hashedPassword },
            { new: true }
        );

        res.status(200).json({ msg: "Contraseña actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        res.status(500).json({ msg: "Error del servidor, por favor intente nuevamente más tarde." });
    }
};

export {
    registro,
    login,
    actualizarPassword,
    olvidoPassword
}