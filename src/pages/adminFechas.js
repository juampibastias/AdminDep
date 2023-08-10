import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { FaTrash } from "react-icons/fa";
import Link from "next/link";

const AdminPage = () => {
  const [dia, setDia] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [fraccionamiento, setFraccionamiento] = useState("15");
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
      // Calcular el fraccionamiento de horas
      const intervaloEnMinutos = parseInt(fraccionamiento, 10);
      const fraccionamientoEnMilisegundos = intervaloEnMinutos * 60000;
      const startDate = new Date(`${dia}T${horaInicio}`);
      const endDate = new Date(`${dia}T${horaFin}`);

      const fraccionamientoArray = [];
      while (startDate <= endDate) {
        fraccionamientoArray.push(
          startDate.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        );
        startDate.setTime(startDate.getTime() + fraccionamientoEnMilisegundos);
      }

      console.log(fraccionamientoArray);

      const response = await fetch("/api/fechas/[id]", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dia,
          horaInicio,
          horaFin,
          fraccionamientoArray,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar la fecha");
      }

      setDia("");
      setHoraInicio("");
      setHoraFin("");

      // Llamar explícitamente a fetchFechas para sincronizar el estado local con la API
      fetchFechas();

      alert("Fecha agregada correctamente");
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
          <span className="btn btn-primary btn-block mb-3 mt-3">Volver</span>
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
        <div>
          <label htmlFor="fraccionamiento">Fraccionamiento en minutos:</label>
          <input
            type="number"
            id="fraccionamiento"
            value={fraccionamiento}
            onChange={(e) => setFraccionamiento(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary btn-block" type="submit">
          Agregar Fecha
        </button>
      </form>
      <div>
        <h2>Fechas guardadas:</h2>
        <ul>
          {fechasGuardadas.map((fecha) => (
            <li key={fecha._id}>
              {`${format(new Date(fecha.dia), "dd/MM/yyyy")} | Inicia: ${
                fecha.horaInicio
              } Finaliza: ${fecha.horaFin}`}
              <button
                className="m-1 btn btn-primary btn-block"
                onClick={() => handleDeleteFecha(fecha._id)}
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
