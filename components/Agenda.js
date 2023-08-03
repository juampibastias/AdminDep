import React, { useState } from "react";
import { format, parseISO, addMinutes } from "date-fns";
import Link from "next/link";

const AgendaCalendar = ({ diasDisponibles }) => {
  const [expandedDay, setExpandedDay] = useState(null);

  // Función para generar los intervalos de 15 minutos
  const generateTimeSlots = (horaInicio, horaFin) => {
    const timeSlots = [];
    const interval = 15;

    const startTime = parseISO(`2023-01-01T${horaInicio}`);
    const endTime = parseISO(`2023-01-01T${horaFin}`);

    let currentTime = startTime;

    while (currentTime <= endTime) {
      timeSlots.push(currentTime);
      currentTime = addMinutes(currentTime, interval);
    }

    return timeSlots;
  };

  // Función para manejar el clic en un día
  const handleDayClick = (diaId) => {
    if (expandedDay === diaId) {
      // Si el día ya está expandido, lo colapsamos al hacer clic nuevamente
      setExpandedDay(null);
    } else {
      // Si el día no está expandido, lo marcamos como expandido
      setExpandedDay(diaId);
    }
  };

  // Ordenar las fechas por orden cronológico
  diasDisponibles.sort((a, b) => new Date(a.dia) - new Date(b.dia));

  return (
    <div>
      <h2 style={{ marginBottom: "10px" }}>Agenda</h2>
      <Link href="/adminDep">
        <span className="btn btn-primary btn-block mb-3">Volver</span>
      </Link>
      <div>
        {/* Renderizar las fechas */}
        {diasDisponibles.map((diaDisponible) => (
          <div key={diaDisponible._id} style={{ marginBottom: "10px" }}>
            <div
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                cursor: "pointer",
                background:
                  expandedDay === diaDisponible._id ? "#f0f0f0" : "transparent",
              }}
              onClick={() => handleDayClick(diaDisponible._id)}
            >
              <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                {format(parseISO(diaDisponible.dia), "dd-MM-yyyy")}
              </div>
            </div>
            {expandedDay === diaDisponible._id && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "10px",
                  border: "1px solid #ddd",
                  padding: "10px",
                }}
              >
                {generateTimeSlots(
                  diaDisponible.horaInicio,
                  diaDisponible.horaFin
                ).map((timeSlot) => (
                  <div key={timeSlot.toISOString()}>
                    {format(timeSlot, "HH:mm")}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgendaCalendar;
