import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { FaTrash } from "react-icons/fa";
import Link from "next/link";

const AdminPage = () => {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [fechasGuardadas, setFechasGuardadas] = useState([]);

  useEffect(() => {
    console.log(fechasGuardadas)
    fetch("/api/fechas/[id]")
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setFechasGuardadas(data)});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/fechas/[id]", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          desde,
          hasta,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar la fecha");
      }

      setDesde("");
      setHasta("");

      const nuevaFecha = await response.json();
      setFechasGuardadas([...fechasGuardadas, nuevaFecha]);

      alert("Fecha agregada correctamente");
    } catch (error) {
      console.error("Error al agregar la fecha", error);
      alert("Error al agregar la fecha");
    }
  };

  const handleDeleteFecha = async (id) => {
    console.log("Eliminar fecha con ID:", id);
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
            <span className="btn btn-primary btn-block mb-3">
              Volver
            </span>
          </Link>
        </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="desde">Desde:</label>
          <input
            type="date"
            id="desde"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="hasta">Hasta:</label>
          <input
            type="date"
            id="hasta"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
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
              {`${format(new Date(fecha.desde), "dd/MM/yyyy")} - ${format(
                new Date(fecha.hasta),
                "dd/MM/yyyy"
              )}`}
              <button
                onClick={() => handleDeleteFecha(fecha._id)}
                style={{ marginLeft: "10px" }}
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
