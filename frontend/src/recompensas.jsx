import React, { useEffect, useState } from "react";
import "./recompensas.css";

const Recompensas = () => {
  const [recompensas, setRecompensas] = useState([]);
  const [reclamadas, setReclamadas] = useState([]);
  const [puntos, setPuntos] = useState(0);

  const token = localStorage.getItem("token");

  // 🔸 Obtener recompensas disponibles desde el backend
  useEffect(() => {
    const fetchRecompensas = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/recompensas");
        const data = await res.json();
        setRecompensas(data);
      } catch (error) {
        console.error("Error al cargar recompensas:", error);
      }
    };

    fetchRecompensas();
  }, []);

  // 🔹 Obtener puntos totales del usuario
  useEffect(() => {
    const fetchPuntos = async () => {
      if (!token) return;
      try {
        const res = await fetch("http://localhost:3000/api/historial/total", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setPuntos(data.totalPuntos || 0);
      } catch (error) {
        console.error("Error al obtener puntos:", error);
      }
    };

    fetchPuntos();
  }, [token]);

  // 🔸 Obtener recompensas canjeadas por el usuario
  useEffect(() => {
  const fetchReclamadas = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:3000/api/canjes/historial", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Respuesta del historial de canjes:", data); // ✅ DEBUG

      const canjesArray = Array.isArray(data)
        ? data
        : Array.isArray(data.canjes)
        ? data.canjes
        : [];

      const ids = canjesArray.map((canje) => canje.recompensa_id);
      setReclamadas(ids);
    } catch (error) {
      console.error("Error al cargar recompensas canjeadas:", error);
    }
  };

  fetchReclamadas();
}, [token]);


  // 🔹 Función para reclamar recompensa
  const reclamarRecompensa = async (recompensaId, puntosRequeridos) => {
    if (!token) {
      alert("Debes iniciar sesión para canjear una recompensa.");
      return;
    }

    if (puntos < puntosRequeridos) {
      alert("No tienes suficientes puntos.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/canjes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recompensa_id: recompensaId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al canjear recompensa.");
        return;
      }

      // Actualizar estado local
      setPuntos((prev) => prev - puntosRequeridos);
      setReclamadas((prev) => [...prev, recompensaId]);
      alert("¡Recompensa canjeada con éxito!");
    } catch (error) {
      console.error("Error al canjear:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="recompensas-container">
      <h2 className="titulo">🎁 Recompensas</h2>
      <p className="puntos">
        Tienes <strong>{puntos}</strong> puntos
      </p>

      <div className="lista-recompensas">
        {recompensas.length === 0 ? (
          <p>Cargando recompensas...</p>
        ) : (
          recompensas.map((recompensa) => (
            <div key={recompensa.id} className="recompensa-card">
              <h3>{recompensa.nombre}</h3>
              <p>{recompensa.descripcion}</p>
              <p>
                Puntos requeridos:{" "}
                <strong>{recompensa.puntos_necesarios}</strong>
              </p>
              <button
                onClick={() =>
                  reclamarRecompensa(recompensa.id, recompensa.puntos_necesarios)
                }
                disabled={
                  puntos < recompensa.puntos_necesarios ||
                  reclamadas.includes(recompensa.id)
                }
              >
                {reclamadas.includes(recompensa.id)
                  ? "Ya reclamada"
                  : "Reclamar"}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="recompensas-reclamadas">
        <h3>🎉 Recompensas Reclamadas</h3>
        {reclamadas.length === 0 ? (
          <p>No has canjeado ninguna recompensa aún.</p>
        ) : (
          <ul>
            {recompensas
              .filter((r) => reclamadas.includes(r.id))
              .map((r) => (
                <li key={r.id}>{r.nombre}</li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Recompensas;
