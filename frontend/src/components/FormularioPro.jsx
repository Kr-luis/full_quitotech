import { useState, useEffect } from "react";
import axios from 'axios';
import Mensaje from './Alertas';
import Swal from 'sweetalert2';

export const FormularioPro = () => {
  const [mensaje, setMensaje] = useState({});
  const [form, setForm] = useState({
    Nombre_producto: "",
    Categoria: "",
    Cantidad: "",
    imagen: null,
  });
  const [tiendaUsuario, setTiendaUsuario] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchTiendaUsuario = async () => {
      try {
        const idUsuario = localStorage.getItem('id_usuario');
        setUserId(idUsuario);
        const url = `${import.meta.env.VITE_BACKEND_URL}/usuario/tienda/${idUsuario}`;
        const respuesta = await axios.get(url);
        setTiendaUsuario(respuesta.data.tienda);
        console.log(respuesta.data.tienda);
      } catch (error) {
        console.error('Error al obtener la tienda del usuario:', error);
      }
    };

    fetchTiendaUsuario();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tiendaUsuario) {
      setMensaje({ respuesta: "No tienes una tienda asociada para registrar productos", tipo: false });
      return;
    }

    if (!form.imagen) {
      setMensaje({ respuesta: "Debes seleccionar una imagen para el producto", tipo: false });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = `${import.meta.env.VITE_BACKEND_URL}/producto/registro`;
      
      const formData = new FormData();
      formData.append('Nombre', form.Nombre_producto);
      formData.append('Categoria', form.Categoria);
      formData.append('Cantidad', form.Cantidad);
      formData.append('id_tienda', tiendaUsuario._id);  // Asegúrate de que _id sea el campo correcto de la tienda
      formData.append('imagen', form.imagen);

      const options = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(url, formData, options);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Producto registrado exitosamente",
        showConfirmButton: false,
        timer: 2100,
      });

      setForm({
        Nombre_producto: "",
        Categoria: "",
        Cantidad: "",
        imagen: null,
      });
    } catch (error) {
      console.error(error);
      setMensaje({ respuesta: error.response?.data?.msg || "Error al registrar el producto", tipo: false });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
      
      <div>
        <label htmlFor='nombre' className='text-slate-400 uppercase font-bold text-sm'>Nombre del Producto: </label>
        <input
          id='Nombre_producto'
          type="text"
          className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
          placeholder='Nombre del producto'
          name='Nombre_producto'
          value={form.Nombre_producto}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label htmlFor='categoria' className='text-slate-400 uppercase font-bold text-sm'>Categoría: </label>
        <select
          id='Categoria'
          name='Categoria'
          className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
          value={form.Categoria}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar Categoría</option>
          <option value="Mandos">Mandos</option>
          <option value="Consolas">Consolas</option>
          <option value="Videojuegos">Videojuegos</option>
          <option value="Perifericos">Perifericos</option>
          <option value="ComponentesPC">ComponentesPC</option>
          <option value="Otros">Otros</option>
        </select>
      </div>

      <div>
        <label htmlFor='cantidad' className='text-slate-400 uppercase font-bold text-sm'>Cantidad: </label>
        <input
          id='Cantidad'
          type="number"
          className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
          placeholder='Cantidad del producto'
          name='Cantidad'
          value={form.Cantidad}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor='imagen' className='text-slate-400 uppercase font-bold text-sm'>Imagen del Producto: </label>
        <input
          id='imagen'
          type="file"
          className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5'
          name='imagen'
          accept='image/*'
          onChange={handleChange}
          required
        />
      </div>

      <input
        type="submit"
        className='bg-purple-500 w-full p-3 
            text-slate-300 uppercase font-bold rounded-lg 
            hover:bg-gray-900 cursor-pointer transition-all'
        value='Registrar Producto'
      />
    </form>
  );
};
