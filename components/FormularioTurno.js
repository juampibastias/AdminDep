import React, { useState } from "react";

const Formulario = ({ zonasDepilar, fechasDisponibles }) => {
  console.log("fechas: ", fechasDisponibles);

  // Estado para almacenar las selecciones realizadas
  const [selecciones, setSelecciones] = useState([]);

  // Función para manejar la selección de una zona
  const handleSeleccion = (e) => {
    const zonaSeleccionada = e.target.value;
    setSelecciones((prevSelecciones) => [...prevSelecciones, zonaSeleccionada]);
  };

  // Función para eliminar una selección
  const eliminarSeleccion = (index) => {
    setSelecciones((prevSelecciones) =>
      prevSelecciones.filter((_, i) => i !== index)
    );
  };

  return (
    <form>
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
          onChange={handleSeleccion} // Manejar la selección de la zona
        >
          <option value="">Selecciona una zona</option>
          {zonasDepilar.map((zona) => (
            <option key={zona._id} value={`${zona.zona} $${zona.precio}`}>
              {`${zona.zona} $${zona.precio}`}
            </option>
          ))}
        </select>
      </div>

      {/* Mostrar las selecciones realizadas */}
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

// Función para formatear la fecha en "dd/mm/aaaa"
function formatDate(dateString) {
  const dateObj = new Date(dateString);
  return dateObj.toLocaleDateString("es-ES");
}

export default Formulario;
