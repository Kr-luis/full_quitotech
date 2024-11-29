import {Schema, model} from 'mongoose'
import mongoose from 'mongoose'

const ReservaSchema = new Schema({
    id_producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
    },
    id_usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    id_propietario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Propietario',
    }
},{
    timestamps:true
})

export default model('Reserva',ReservaSchema)