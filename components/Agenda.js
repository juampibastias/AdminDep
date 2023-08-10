import React, { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";

const AgendaCalendar = ({ diasDisponibles, reservas }) => {
  console.log(reservas);
  const [selectedDate, setSelectedDate] = useState(null);
  const reservasPorFecha = {};

  // Organizar las reservas en el objeto por fecha
  reservas.forEach((reserva) => {
    const [dia, mes, anio] = reserva.fechaDisponible.split("/");
    const fechaDisponible = new Date(`${anio}-${mes}-${dia}`);
    const fechaKey = format(fechaDisponible, "yyyy-MM-dd");

    if (!reservasPorFecha[fechaKey]) {
      reservasPorFecha[fechaKey] = [];
    }

    reservasPorFecha[fechaKey].push(reserva);
  });

  // Ordenar las reservas por horario en cada fecha
  Object.keys(reservasPorFecha).forEach((fechaKey) => {
    reservasPorFecha[fechaKey].sort((a, b) => {
      const horarioA = a.horariosSeleccionados[0];
      const horarioB = b.horariosSeleccionados[0];
      return horarioA.localeCompare(horarioB);
    });
  });

  const colorPalette = [
    "#77aadd",
    "#77dd77",
    "#7777dd",
    "#78deab",
    "#dd77dd",
    "#ddaa77",
    // Agrega más colores según sea necesario
  ];

  const maxContentHeight = Math.max(
    ...reservas.map((reserva) => {
      const contentHeight =
        (reserva.horariosSeleccionados.length +
          `${reserva.nombre} ${reserva.apellido}`.length +
          reserva.zonasDepilar.length +
          `${reserva.precioAcumulado}`.length +
          "Estado de pago: Total".length) *
        7; // Estimación de altura por línea

      return contentHeight;
    })
  );

  // Establecer la altura máxima en píxeles
  const maxHeight = `${maxContentHeight}px`;

  return (
    <div style={{ marginTop: "10px" }}>
      <h2 style={{ marginBottom: "10px" }}>Agenda</h2>
      <Link href="/adminDep">
        <span className="btn btn-primary btn-block mb-3">Volver</span>
      </Link>
      {Object.keys(reservasPorFecha).map((fechaKey) => (
        <div key={fechaKey} style={{ marginBottom: "20px" }}>
          <h3>{format(new Date(fechaKey), "dd-MM-yyyy")}</h3>
          {selectedDate === fechaKey && (
            <div className="reservas-content"
              style={{
                marginTop: "20px",
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)", // Columnas para la versión web
                gap: "20px",
              }}
            >
              {reservasPorFecha[fechaKey].map((reserva, index) => (
                <div
                  key={reserva._id}
                  style={{
                    background: colorPalette[index % colorPalette.length],
                    padding: "10px",
                    marginBottom: "10px",
                    height: maxHeight,
                    borderRadius: "10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    textAlign: "center"
                  }}
                >
                  <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {reserva.horariosSeleccionados}
                  </div>
                  <div>{`${reserva.nombre} ${reserva.apellido}`}</div>
                  <div style={{ fontSize: "15px", fontWeight: "600", color: "white" }}>
                    {reserva.zonasDepilar.map((zonaDepilar, index) => (
                      <React.Fragment key={index}>
                        {zonaDepilar.split(" | ")[0]}
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                    ${reserva.precioAcumulado}
                  </div>
                  <div>
                    <p style={{ fontSize: "12px", margin: "0" }}>
                      Estado de pago: <b>Total</b>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => setSelectedDate(fechaKey)}>
            Mostrar Reservas
          </button>
        </div>
      ))}
    </div>
    
  );
};

export default AgendaCalendar;
