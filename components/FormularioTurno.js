import React, { useState } from "react";

const Formulario = ({ zonasDepilar, fechasDisponibles }) => {
  const [selecciones, setSelecciones] = useState([]);
  const [sumaAcumulada, setSumaAcumulada] = useState({ precio: 0, tiempo: 0 });

  const handleSeleccion = (e) => {
    const zonaSeleccionada = e.target.value;
    const [zona, precio, tiempo] = zonaSeleccionada.split(" | ");

    // Verificar si es la segunda zona seleccionada
    if (selecciones.length >= 1) {
      // Restar 7 minutos al tiempo acumulado
      setSumaAcumulada((prevSuma) => ({
        precio: prevSuma.precio + parseInt(precio),
        tiempo: prevSuma.tiempo + parseInt(tiempo) - 10,
      }));
    } else {
      // Es la primera zona seleccionada, no restar tiempo
      setSumaAcumulada((prevSuma) => ({
        precio: prevSuma.precio + parseInt(precio),
        tiempo: prevSuma.tiempo + parseInt(tiempo),
      }));
    }

    setSelecciones((prevSelecciones) => [...prevSelecciones, zonaSeleccionada]);
  };

  const eliminarSeleccion = (index) => {
    const zonaSeleccionada = selecciones[index];
    const [zona, precio, tiempo] = zonaSeleccionada.split(" | ");
    setSelecciones((prevSelecciones) =>
      prevSelecciones.filter((_, i) => i !== index)
    );

    // Agregar 7 minutos al tiempo acumulado si hay más de una selección restante
    if (selecciones.length > 1) {
      setSumaAcumulada((prevSuma) => ({
        precio: prevSuma.precio - parseInt(precio),
        tiempo: prevSuma.tiempo - parseInt(tiempo) + 10,
      }));
    } else {
      // Solo hay una selección restante, no agregar tiempo extra
      setSumaAcumulada((prevSuma) => ({
        precio: prevSuma.precio - parseInt(precio),
        tiempo: prevSuma.tiempo - parseInt(tiempo),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const nombre = e.target.nombre.value;
    const apellido = e.target.apellido.value;
    const fechaDisponible = e.target.fechasDisponibles.value;
    const zonasDepilar = selecciones;
  
    // Calcular precio y tiempo acumulado
    let precioAcumulado = 0;
    let tiempoAcumulado = 0;
    for (const zonaSeleccionada of zonasDepilar) {
      const [, precio, tiempo] = zonaSeleccionada.split(" | ");
      precioAcumulado += parseInt(precio);
      tiempoAcumulado += parseInt(tiempo);
    }
  
    const reservaData = {
      nombre,
      apellido,
      fechaDisponible,
      zonasDepilar,
      precioAcumulado: sumaAcumulada.precio,
      tiempoAcumulado: sumaAcumulada.tiempo,
    };

    console.log(reservaData)
  
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
    <form onSubmit={handleSubmit} style={{ width: "600px" }}>
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
            <option
              key={zona._id}
              value={`${zona.zona} | ${zona.precio} | ${zona.tiempo}`}
            >
              {`${zona.zona} $${zona.precio} ${zona.tiempo}''`}
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
      <div>
        <h3>Suma acumulada:</h3>
        <p>Precio total: ${sumaAcumulada.precio}</p>
        <p>Tiempo total: {sumaAcumulada.tiempo}''</p>
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
