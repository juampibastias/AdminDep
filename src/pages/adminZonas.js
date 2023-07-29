import React, { useState, useEffect } from "react";
import Link from "next/link";

const AdminPage = () => {
  const [zona, setZona] = useState("");
  const [tiempo, setTiempo] = useState("");
  const [precio, setPrecio] = useState("");
  const [zonasGuardadas, setZonasGuardadas] = useState([]);

  useEffect(() => {
    fetch("/api/zonas/[id]")
      .then((response) => response.json())
      .then((data) => setZonasGuardadas(data));
  }, []);

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

      alert("Zona agregada correctamente");
    } catch (error) {
      console.error("Error al agregar la zona", error);
      alert("Error al agregar la zona");
    }
  };

  return (
    <div>
      <h1>Administración de Zonas a Depilar</h1>
      <div className="col-md-4">
          <Link href="/adminDep">
            <span className="btn btn-primary btn-block mb-3">
              Volver
            </span>
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

        <button type="submit">Agregar Zona</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Zona</th>
            <th>Tiempo</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {zonasGuardadas.map((zona) => (
            <tr key={zona.id}>
              <td>{zona.zona}</td>
              <td>{zona.tiempo}</td>
              <td>{zona.precio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
