import React, { useEffect, useState } from "react";
import "./recompensas.css";

const recompensasDisponibles = [
  {
    id: 1,
    nombre: "10% de descuento en Carnes",
    descripcion: "Obtén un 10% de descuento en productos de la categoría 'Carnes'",
    puntosRequeridos: 100,
  },
  {
    id: 2,
    nombre: "Cupón de $5.000 en Aseo",
    descripcion: "Redime este cupón por $5.000 en productos de aseo",
    puntosRequeridos: 200,
  },
  {
    id: 3,
    nombre: "Regalo sorpresa",
    descripcion: "Recibe un producto sorpresa gratis con tu próxima compra",
    puntosRequeridos: 300,
  },
];

const Recompensas = () => {
  const [puntos, setPuntos] = useState(0);
  const [reclamadas, setReclamadas] = useState([]);

  // 🔸 Cargar puntos y recompensas reclamadas desde localStorage
  useEffect(() => {
    const puntosGuardados = parseInt(localStorage.getItem("puntosUsuario")) || 40;
    const recompensasGuardadas = JSON.parse(localStorage.getItem("recompensasReclamadas")) || [];
    setPuntos(puntosGuardados);
    setReclamadas(recompensasGuardadas);
  }, []);

  // 🔹 Función para reclamar recompensa
  const reclamarRecompensa = (recompensa) => {
    if (puntos < recompensa.puntosRequeridos) {
      alert("No tienes suficientes puntos para reclamar esta recompensa.");
      return;
    }

    // Verificar si ya fue reclamada
    if (reclamadas.find((r) => r.id === recompensa.id)) {
      alert("Ya reclamaste esta recompensa.");
      return;
    }

    const nuevosPuntos = puntos - recompensa.puntosRequeridos;
    const nuevasReclamadas = [...reclamadas, recompensa];

    setPuntos(nuevosPuntos);
    setReclamadas(nuevasReclamadas);
    localStorage.setItem("puntosUsuario", nuevosPuntos);
    localStorage.setItem("recompensasReclamadas", JSON.stringify(nuevasReclamadas));
    alert("¡Recompensa reclamada!");
  };

  return (
    <div className="recompensas-container">
      <h2 className="titulo">🎁 Recompensas</h2>
      <p className="puntos">Tienes <strong>{puntos}</strong> puntos</p>

      <div className="lista-recompensas">
        {recompensasDisponibles.map((recompensa) => (
          <div key={recompensa.id} className="recompensa-card">
            <h3>{recompensa.nombre}</h3>
            <p>{recompensa.descripcion}</p>
            <p>Puntos requeridos: <strong>{recompensa.puntosRequeridos}</strong></p>
            <button
              onClick={() => reclamarRecompensa(recompensa)}
              disabled={puntos < recompensa.puntosRequeridos || reclamadas.find((r) => r.id === recompensa.id)}
            >
              {reclamadas.find((r) => r.id === recompensa.id) ? "Ya reclamada" : "Reclamar"}
            </button>
          </div>
        ))}
      </div>

      <div className="recompensas-reclamadas">
        <h3>🎉 Recompensas Reclamadas</h3>
        {reclamadas.length === 0 ? (
          <p>No has reclamado ninguna recompensa aún.</p>
        ) : (
          <ul>
            {reclamadas.map((r) => (
              <li key={r.id}>{r.nombre}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Recompensas;
