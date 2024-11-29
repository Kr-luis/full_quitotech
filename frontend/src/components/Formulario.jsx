import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export const Formulario = ({ tienda }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    Nombre: tienda?.Nombre ?? "",
    Direccion: tienda?.Direccion ?? "",
    email: localStorage.getItem("email") || "",
    id_Usuario: localStorage.getItem("id_usuario") || "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones de campos vacíos
    if (Object.values(form).some((field) => field.trim() === "")) {
      Swal.fire({
        title: "Error",
        text: "Todos los campos son obligatorios",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Swal.fire({
        title: "Error",
        text: "El correo electrónico no es válido",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    // Verificación del email almacenado
    const storedEmail = localStorage.getItem("email");
    if (form.email !== storedEmail) {
      Swal.fire({
        title: "Error",
        text: "El correo electrónico no coincide con tu cuenta",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = tienda?._id
        ? `${import.meta.env.VITE_BACKEND_URL}/usuario/tienda/${tienda._id}`
        : `${import.meta.env.VITE_BACKEND_URL}/usuario/solicitud`;
      const method = tienda?._id ? "put" : "post";

      await axios[method](url, form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        title: "Éxito",
        text: tienda?._id
          ? "La tienda se ha actualizado correctamente"
          : "Tu solicitud ha sido enviada. Pronto recibirás una respuesta",
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      if (!tienda?._id) localStorage.clear();

      navigate("/dashboard");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.msg || "Hubo un problema al procesar tu solicitud",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="Nombre"
          className="text-slate-400 uppercase font-bold text-sm"
        >
          Nombre de la Tienda:{" "}
        </label>
        <input
          id="Nombre"
          type="text"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
          placeholder="Nombre de tu tienda"
          name="Nombre"
          value={form.Nombre}
          onChange={handleChange}
        />
      </div>
      <div>
        <label
          htmlFor="Direccion"
          className="text-slate-400 uppercase font-bold text-sm"
        >
          Dirección de la Tienda:{" "}
        </label>
        <input
          id="Direccion"
          type="text"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
          placeholder="Dirección de la tienda"
          name="Direccion"
          value={form.Direccion}
          onChange={handleChange}
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="text-slate-400 uppercase font-bold text-sm"
        >
          Email de Confirmación:{" "}
        </label>
        <input
          id="email"
          type="email"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md mb-5"
          placeholder="Email registrado"
          name="email"
          value={form.email}
          onChange={handleChange}
          readOnly
        />
      </div>
      <input
        type="submit"
        className="bg-purple-500 w-full p-3 text-slate-300 uppercase font-bold rounded-lg hover:bg-gray-900 cursor-pointer transition-all"
        value={tienda?._id ? "Actualizar Tienda" : "Mandar Solicitud de Tienda"}
      />
    </form>
  );
};
