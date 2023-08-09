import React, { useState, useEffect } from "react";

const Formulario = ({ zonasDepilar, fechasDisponibles }) => {
  const [selecciones, setSelecciones] = useState([]);
  const [sumaAcumulada, setSumaAcumulada] = useState({ precio: 0, tiempo: 0 });
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [tiempoAcumuladoMinutos, setTiempoAcumuladoMinutos] = useState(0);

  useEffect(() => {
    const updateHorarios = async () => {
      const horarios = await filtrarHorariosDisponibles(
        fechasDisponibles[0].fraccionamientoArray,
        sumaAcumulada.tiempo
      );
      setHorariosDisponibles(horarios);
    };

    updateHorarios();
  }, [sumaAcumulada.tiempo, fechasDisponibles]);

  const filtrarHorariosDisponibles = (horarios, tiempoAcumulado) => {
    const horariosFiltrados = [];
    const [horaInicioPrimera, minutosInicioPrimera] =
      horarios[0]?.split(":") || [];
    const [horaFinUltima, minutosFinUltima] =
      horarios[horarios.length - 1]?.split(":") || [];

    // Convertimos la hora de inicio y fin en minutos para facilitar los cálculos
    const minutosInicioTotal =
      parseInt(horaInicioPrimera) * 60 + parseInt(minutosInicioPrimera);
    const minutosFinTotal =
      parseInt(horaFinUltima) * 60 + parseInt(minutosFinUltima);

    // Si tiempoAcumulado es un número, lo convertimos a cadena
    const tiempoAcumuladoStr =
      typeof tiempoAcumulado === "number"
        ? tiempoAcumulado.toString()
        : tiempoAcumulado;

    // Calculamos el tiempo acumulado necesario en minutos
    const tiempoAcumuladoMinutos = parseInt(tiempoAcumuladoStr.split(" ")[0]);
    console.log(tiempoAcumuladoMinutos);

    // Creamos una función para determinar si una franja horaria es válida para el tiempo acumulado
    const esFranjaValida = (inicio, fin) => {
      return (
        fin - inicio >= tiempoAcumuladoMinutos &&
        inicio >= minutosInicioTotal &&
        fin <= minutosFinTotal &&
        fin <= 20 * 60 // 20:00 en minutos
      );
    };

    let minutosInicio = minutosInicioTotal;
    let minutosFin = minutosInicio + sumaAcumulada.tiempo;

    while (minutosFin <= minutosFinTotal && minutosFin <= 20 * 60) {
      if (esFranjaValida(minutosInicio, minutosFin)) {
        const horaInicio = Math.floor(minutosInicio / 60);
        const minutosInicioFraccion = minutosInicio % 60;
        const horaFin = Math.floor(minutosFin / 60);
        const minutosFinFraccion = minutosFin % 60;
        const franjaHoraria = `${horaInicio
          .toString()
          .padStart(2, "0")}:${minutosInicioFraccion
          .toString()
          .padStart(2, "0")} a ${horaFin
          .toString()
          .padStart(2, "0")}:${minutosFinFraccion.toString().padStart(2, "0")}`;
        horariosFiltrados.push(franjaHoraria);
      }

      // Avanzamos al siguiente intervalo de tiempo utilizando sumaAcumulada.tiempo
      minutosInicio += sumaAcumulada.tiempo;
      minutosFin = minutosInicio + sumaAcumulada.tiempo;

      // Asegurémonos de no entrar en un bucle infinito si sumaAcumulada.tiempo es 0
      if (sumaAcumulada.tiempo === 0) {
        break;
      }
    }

    return horariosFiltrados;
  };

  const handleSeleccion = (e) => {
    const zonaSeleccionada = e.target.value;
    const [zona, precio, tiempo] = zonaSeleccionada.split(" | ");

    // Actualizar tiempo acumulado
    setSumaAcumulada((prevSuma) => ({
      precio: prevSuma.precio + parseInt(precio),
      tiempo: prevSuma.tiempo + parseInt(tiempo),
    }));

    setSelecciones((prevSelecciones) => [...prevSelecciones, zonaSeleccionada]);
  };

  const eliminarSeleccion = (index) => {
    const zonaSeleccionada = selecciones[index];
    const [zona, precio, tiempo] = zonaSeleccionada.split(" | ");

    // Actualizar tiempo acumulado
    setSumaAcumulada((prevSuma) => ({
      precio: prevSuma.precio - parseInt(precio),
      tiempo: prevSuma.tiempo - parseInt(tiempo),
    }));

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

    console.log(reservaData);

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
            <option key={fecha._id} value={`${formatDate(fecha.dia)}`}>
              {`${formatDate(fecha.dia)}`}
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
        <label htmlFor="horariosDisponibles">Horarios disponibles:</label>
        <select id="horariosDisponibles" name="horariosDisponibles" required>
          <option value="">Selecciona un horario</option>
          {horariosDisponibles.map((horario, index) => (
            <option key={index} value={horario}>
              {horario}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3>Zonas seleccionadas:</h3>
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
        <h3>Totales</h3>
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
