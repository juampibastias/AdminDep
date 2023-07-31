import React, { useState } from "react";

const Formulario = ({ zonasDepilar, fechasDisponibles }) => {
  const [selecciones, setSelecciones] = useState([]);

  const handleSeleccion = (e) => {
    const zonaSeleccionada = e.target.value;
    setSelecciones((prevSelecciones) => [...prevSelecciones, zonaSeleccionada]);
  };

  const eliminarSeleccion = (index) => {
    setSelecciones((prevSelecciones) =>
      prevSelecciones.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nombre = e.target.nombre.value;
    const apellido = e.target.apellido.value;
    const fechaDisponible = e.target.fechasDisponibles.value;
    const zonasDepilar = selecciones;

    const reservaData = {
      nombre,
      apellido,
      fechaDisponible,
      zonasDepilar,
    };

    try {
      const response = await fetch("/api/reserva/[id]", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservaData),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      const reservaGuardada = await response.json();
      console.log("Reserva guardada:", reservaGuardada);
      alert("¡Reserva exitosa!");

      setSelecciones([]);
      e.target.reset();
    } catch (error) {
      console.error("Error al guardar la reserva", error);
      alert("Error al guardar la reserva. Por favor, intenta nuevamente.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" required />
      </div>

      <div>
        <label htmlFor="apellido">Apellido:</label>
        <input type="text" id="apellido" name="apellido" required />
      </div>

      <div>
        <label htmlFor="fechasDisponibles">Fechas disponibles:</label>
        <select id="fechasDisponibles" name="fechasDisponibles" required>
          <option value="">Selecciona una fecha</option>
          {fechasDisponibles.map((fecha) => (
            <option
              key={fecha._id}
              value={`${formatDate(fecha.desde)} - ${formatDate(fecha.hasta)}`}
            >
              {`${formatDate(fecha.desde)} - ${formatDate(fecha.hasta)}`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="zonasDepilar">Zonas a depilar:</label>
        <select
          id="zonasDepilar"
          name="zonasDepilar"
          required
          onChange={handleSeleccion}
        >
          <option value="">Selecciona una zona</option>
          {zonasDepilar.map((zona) => (
            <option key={zona._id} value={`${zona.zona} $${zona.precio}`}>
              {`${zona.zona} $${zona.precio}`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3>Selecciones realizadas:</h3>
        <ul>
          {selecciones.map((seleccion, index) => (
            <li key={index}>
              {seleccion}{" "}
              <button onClick={() => eliminarSeleccion(index)}>X</button>
            </li>
          ))}
        </ul>
      </div>

      <button type="submit">Reservar</button>
    </form>
  );
};

function formatDate(dateString) {
  const dateObj = new Date(dateString);
  return dateObj.toLocaleDateString("es-ES");
}

export default Formulario;
