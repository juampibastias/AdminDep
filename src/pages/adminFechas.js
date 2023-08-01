import React, { useState, useEffect } from "react";
import { format, parse } from "date-fns";
import { FaTrash } from "react-icons/fa";
import Link from "next/link";

const AdminPage = () => {
  const [dia, setDia] = useState("");
  const [horaInicio, setHoraInicio] = useState(""); // Estado para almacenar la hora de inicio
  const [horaFin, setHoraFin] = useState(""); // Estado para almacenar la hora de fin
  const [fechasGuardadas, setFechasGuardadas] = useState([]);

  useEffect(() => {
    fetchFechas();
  }, []);

  const fetchFechas = () => {
    fetch("/api/fechas/[id]")
      .then((response) => response.json())
      .then((data) => setFechasGuardadas(data))
      .catch((error) => console.error("Error al obtener las fechas", error));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/fechas/[id]", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dia,
          horaInicio, // Usar el estado de horaInicio
          horaFin, // Usar el estado de horaFin
        }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar la fecha");
      }

      setDia("");

      // Llamar explícitamente a fetchFechas para sincronizar el estado local con la API
      fetchFechas();

      alert("Fecha agregada correctamente");

      // Recargar la página después de mostrar el mensaje de alerta
      window.location.reload();
    } catch (error) {
      console.error("Error al agregar la fecha", error);
      alert("Error al agregar la fecha");
    }
  };

  const handleDeleteFecha = async (id) => {
    try {
      const response = await fetch(`/api/fechas/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la fecha");
      }

      // Actualiza la lista de fechas guardadas después de eliminar
      setFechasGuardadas((prevFechas) =>
        prevFechas.filter((fecha) => fecha._id !== id)
      );

      alert("Fecha eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar la fecha", error);
      alert("Error al eliminar la fecha");
    }
  };

  return (
    <div>
      <h1>Administración de Fechas</h1>
      <div className="col-md-4">
        <Link href="/adminDep">
          <span className="btn btn-primary btn-block mb-3">Volver</span>
        </Link>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="dia">Día:</label>
          <input
            type="date"
            id="dia"
            value={dia}
            onChange={(e) => setDia(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="inicio">Hora Inicio:</label>
          <input
            type="time"
            id="inicio"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)} // Actualizar el estado de horaInicio
            required
          />
        </div>
        <div>
          <label htmlFor="fin">Hora Fin:</label>
          <input
            type="time"
            id="fin"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)} // Actualizar el estado de horaFin
            required
          />
        </div>

        <button type="submit">Agregar Fecha</button>
      </form>
      <div>
        <h2>Fechas guardadas:</h2>
        <ul>
          {fechasGuardadas.map((fecha) => (
            <li key={fecha._id}>
              {`${format(new Date(fecha.dia), "dd/MM/yyyy")} | Inicia: ${
                fecha.horaInicio
              } Finaliza: ${fecha.horaFin}`}
              {/* Resto del código sin cambios */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
