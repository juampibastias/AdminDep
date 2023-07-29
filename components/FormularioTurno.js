import React from "react";

const Formulario = ({ zonasDepilar }) => {
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
          {/* Agrega aquí las opciones de fechas disponibles */}
        </select>
      </div>

      <div>
        <label htmlFor="zonasDepilar">Zonas a depilar:</label>
        <select id="zonasDepilar" name="zonasDepilar" required>
          <option value="">Selecciona una zona</option>
          {zonasDepilar.map((zona) => (
            <option key={zona._id} value={`${zona.zona} $${zona.precio}`}>
              {`${zona.zona} $${zona.precio}`}
            </option>
          ))}
        </select>
      </div>

      <button type="submit">Reservar</button>
    </form>
  );
};

export default Formulario;
