import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './reportarPrecio.css';

function ReportarPrecio() {
  const navigate = useNavigate();
  const location = useLocation();
  const producto = location.state?.producto;

  const [precio, setPrecio] = useState('');
  const [supermercadoId, setSupermercadoId] = useState('');
  const [supermercados, setSupermercados] = useState([]);

  useEffect(() => {
    const fetchSupermercados = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/supermercados');
        const data = await res.json();
        setSupermercados(data);
      } catch (error) {
        console.error("❌ Error al cargar supermercados:", error);
      }
    };

    fetchSupermercados();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Debes iniciar sesión.");
      return navigate("/login");
    }

    try {
      const res = await fetch('http://localhost:3000/api/reportes-precios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          producto_id: producto.id,
          supermercado_id: supermercadoId,
          precio_reportado: parseFloat(precio)
        })
      });

      const text = await res.text();
      let result;

      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error("⚠️ Respuesta no válida del backend:", text);
        alert("Error inesperado al procesar la respuesta del servidor.");
        return;
      }

      if (res.ok) {
        alert('✅ Precio reportado con éxito');
        navigate('/carnes'); // Ajusta según categoría
      } else {
        alert(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      console.error("❌ Error al enviar el reporte:", error);
      alert("Error al enviar el reporte.");
    }
  };

  if (!producto) return <div>Producto no encontrado</div>;

  return (
    <div className="reportar-precio-page">
      <h1>Reportar precio para: {producto.nombre}</h1>
      <form onSubmit={handleSubmit}>
        <label>Supermercado:</label>
        <select
          value={supermercadoId}
          onChange={(e) => setSupermercadoId(e.target.value)}
          required
        >
          <option value="">Seleccione</option>
          {supermercados.map(s => (
            <option key={s.id} value={s.id}>{s.nombre}</option>
          ))}
        </select>

        <label>Nuevo Precio:</label>
        <input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          step="0.01"
          min="0"
          required
        />

        <button type="submit">Enviar reporte</button>
      </form>
    </div>
  );
}

export default ReportarPrecio;
