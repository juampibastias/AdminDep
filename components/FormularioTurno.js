import React, { useState, useEffect } from "react";

const Formulario = ({ zonasDepilar, fechasDisponibles }) => {
  const [selecciones, setSelecciones] = useState([]);
  const [sumaAcumulada, setSumaAcumulada] = useState({ precio: 0, tiempo: 0 });
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [horariosSeleccionados, setHorariosSeleccionados] = useState([]);
  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(""); // Agregado: estado para la fecha seleccionada

  useEffect(() => {
    const updateHorarios = async () => {
      if (fechaSeleccionada) {
        const horarios = await filtrarHorariosDisponibles(
          fechasDisponibles.find(
            (fecha) => formatDate(fecha.dia) === fechaSeleccionada
          ).fraccionamientoArray,
          sumaAcumulada.tiempo
        );
        setHorariosDisponibles(horarios);
      }
    };

    updateHorarios();
  }, [sumaAcumulada.tiempo, fechaSeleccionada]);

  useEffect(() => {
    const obtenerHorariosOcupados = async (fechaSeleccionada) => {
      try {
        const response = await fetch(
          `/api/reserva/[id]?fecha=${fechaSeleccionada}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const horariosOcupados = data
            .map((reserva) => reserva.horariosSeleccionados)
            .flat();
          setHorariosOcupados(horariosOcupados);
        } else {
          console.error("Error en la respuesta del servidor");
        }
      } catch (error) {
        console.error("Error al obtener horarios ocupados", error);
      }
    };

    obtenerHorariosOcupados(fechaSeleccionada);
  }, [fechaSeleccionada]);

  const filtrarHorariosDisponibles = (horarios, tiempoAcumulado) => {
    const horariosFiltrados = [];
    const [horaInicioPrimera, minutosInicioPrimera] =
      horarios[0]?.split(":") || [];
    const [horaFinUltima, minutosFinUltima] =
      horarios[horarios.length - 1]?.split(":") || [];

    const minutosInicioTotal =
      parseInt(horaInicioPrimera) * 60 + parseInt(minutosInicioPrimera);
    const minutosFinTotal =
      parseInt(horaFinUltima) * 60 + parseInt(minutosFinUltima);

    const tiempoAcumuladoStr =
      typeof tiempoAcumulado === "number"
        ? tiempoAcumulado.toString()
        : tiempoAcumulado;
    const tiempoAcumuladoMinutos = parseInt(tiempoAcumuladoStr.split(" ")[0]);

    const esFranjaValida = (inicio, fin) => {
      return (
        fin - inicio >= tiempoAcumuladoMinutos &&
        inicio >= minutosInicioTotal &&
        fin <= minutosFinTotal &&
        fin <= 20 * 60
      );
    };

    let minutosInicio = minutosInicioTotal;
    let minutosFin = minutosInicio + tiempoAcumuladoMinutos;

    while (minutosFin <= minutosFinTotal && minutosFin <= 20 * 60) {
      let franjaDisponible = true;

      for (const horarioOcupado of horariosOcupados) {
        const [horaOcupadaInicio, minutosOcupadosInicio] =
          horarioOcupado.split(" ")[0]?.split(":") || [];
        const [horaOcupadaFin, minutosOcupadosFin] =
          horarioOcupado.split(" ")[2]?.split(":") || [];

        const minutosOcupadosInicioTotal =
          parseInt(horaOcupadaInicio) * 60 + parseInt(minutosOcupadosInicio);
        const minutosOcupadosFinTotal =
          parseInt(horaOcupadaFin) * 60 + parseInt(minutosOcupadosFin);

        if (
          (minutosInicio >= minutosOcupadosInicioTotal &&
            minutosInicio < minutosOcupadosFinTotal) ||
          (minutosFin > minutosOcupadosInicioTotal &&
            minutosFin <= minutosOcupadosFinTotal)
        ) {
          franjaDisponible = false;
          break;
        }
      }

      if (franjaDisponible) {
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

      minutosInicio += sumaAcumulada.tiempo;
      minutosFin = minutosInicio + tiempoAcumuladoMinutos;

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

  const handleSeleccionHorarios = (e) => {
    const horarioSeleccionado = e.target.value;
    setHorariosSeleccionados((prevHorarios) => [
      ...prevHorarios,
      horarioSeleccionado,
    ]);
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
      horariosSeleccionados: horariosSeleccionados,
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
      alert("¡Reserva exitosa!");

      setSelecciones([]);
      e.target.reset();
      setSumaAcumulada({ precio: 0, tiempo: 0 });
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
        <select
          id="fechasDisponibles"
          name="fechasDisponibles"
          required
          onChange={(e) => setFechaSeleccionada(e.target.value)}
        >
          <option value="">Selecciona una fecha</option>
          {fechasDisponibles.map((fecha) => (
            <option key={fecha._id} value={formatDate(fecha.dia)}>
              {formatDate(fecha.dia)}
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
        <select
          id="horariosDisponibles"
          name="horariosDisponibles"
          required
          onChange={handleSeleccionHorarios} // Usa la nueva función para horarios
        >
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

      <button className="btn btn-primary btn-block" type="submit">Reservar</button>
    </form>
  );
};

// Función para formatear la fecha en "dd/mm/aaaa"
function formatDate(dateString) {
  const dateObj = new Date(dateString);
  return dateObj.toLocaleDateString("es-ES");
}

export default Formulario;
