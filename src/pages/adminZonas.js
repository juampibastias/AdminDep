import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";

const AdminPage = () => {
  const [zona, setZona] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [precio, setPrecio] = useState("");
  const [zonasGuardadas, setZonasGuardadas] = useState([]);

  useEffect(() => {
    fetchZonas();
  }, []);

  const fetchZonas = () => {
    fetch("/api/zonas/[id]")
      .then((response) => response.json())
      .then((data) => setZonasGuardadas(data))
      .catch((error) => console.error("Error al obtener las zonas", error));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/zonas/[id]", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          zona,
          tiempo,
          precio,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar la zona");
      }

      setZona("");
      setTiempo("");
      setPrecio("");

      // Actualizar la lista de zonas con la nueva zona agregada
      const nuevaZona = await response.json();
      setZonasGuardadas([...zonasGuardadas, nuevaZona]);

      alert("Zona agregada correctamente");

      // Actualizar la tabla después de agregar la zona
      fetchZonas();
    } catch (error) {
      console.error("Error al agregar la zona", error);
      alert("Error al agregar la zona");
    }
  };

  const handleDelete = async (zonaId) => {
    try {
      const response = await fetch(`/api/zonas/${zonaId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la zona");
      }

      // Elimina la zona eliminada de la lista local
      setZonasGuardadas((prevZonas) =>
        prevZonas.filter((zona) => zona.id !== zonaId)
      );

      alert("Zona eliminada correctamente");

      // Actualizar la tabla después de eliminar la zona
      fetchZonas();
    } catch (error) {
      console.error("Error al eliminar la zona", error);
      alert("Error al eliminar la zona");
    }
  };

  return (
    <div>
      <h1 className="mt-2" style={{textAlign: "center"}}>Administración de Zonas a Depilar</h1>
      <div className="col-md-4">
        <Link href="/adminDep">
          <span className="btn btn-primary btn-block mb-3 mt-3">Volver</span>
        </Link>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="zona">Zona:</label>
          <input
            type="text"
            id="zona"
            value={zona}
            onChange={(e) => setZona(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="tiempo">Tiempo:</label>
          <input
            type="text"
            id="tiempo"
            value={tiempo}
            onChange={(e) => setTiempo(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="precio">Precio:</label>
          <input
            type="number"
            id="precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">Agregar Zona</button>
      </form>

      <div className="mt-5">
        <h2>Zonas Guardadas</h2>
        <table
          style={{
            textAlign: "center",
            marginTop: "1rem",
            display: "block",
            justifyContent: "space-around",
          }}
        >
          <thead>
            <tr>
              <th>Zona</th>
              <th>Tiempo</th>
              <th>Precio</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {zonasGuardadas.map((zona) => (
              <tr key={zona._id}>
                <td>{zona.zona}</td>
                <td>{zona.tiempo}</td>
                <td>{zona.precio}</td>
                <td>
                  <button className="btn btn-primary btn-block" onClick={() => handleDelete(zona._id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
