import React, { useState } from 'react';
import axios from 'axios';
import './adminProductos.css';

const AdminProductos = () => {
  const [vista, setVista] = useState('crear');

  // Estados para crear producto
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [peso, setPeso] = useState('');
  const [unidad, setUnidad] = useState('');
  const [marca, setMarca] = useState('');
  const [imagen, setImagen] = useState(null);

  // Nuevos estados para precio
  const [precio, setPrecio] = useState('');
  const [supermercado, setSupermercado] = useState('');

  const handleCrear = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('categoria', categoria);
    formData.append('peso', peso);
    formData.append('unidad_medida', unidad);
    formData.append('marca', marca);
    formData.append('imagen', imagen); // 👈 Imagen enviada correctamente

    try {
      const token = localStorage.getItem('token');

      // 1. Crear producto
      const resProducto = await axios.post('http://localhost:3000/api/productos/registerProduct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      const productoId = resProducto.data.producto.id;

      // 2. Registrar precio
      await axios.post('http://localhost:3000/api/precios', {
        producto_id: productoId,
        supermercado_id: supermercado,
        precio
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('Producto y precio creados exitosamente');
    } catch (err) {
      console.error(err);
      alert('Error al crear el producto o el precio');
    }
  };

  return (
    <div className="admin-productos-container">
      <h2>Gestión de Productos</h2>
      <div className="navbar">Panel de Administración</div>

      
      <div className="admin-tabs">
        <button onClick={() => setVista('crear')} className={vista === 'crear' ? 'activo' : ''}>Crear</button>
        {/*<button onClick={() => setVista('actualizar')} className={vista === 'actualizar' ? 'activo' : ''}>Actualizar</button>
        <button onClick={() => setVista('eliminar')} className={vista === 'eliminar' ? 'activo' : ''}>Eliminar</button>*/}
      </div>

      {vista === 'crear' && (
        <form onSubmit={handleCrear} className="admin-form">
          <input type="text" placeholder="Nombre" onChange={e => setNombre(e.target.value)} required />
          <textarea placeholder="Descripción" onChange={e => setDescripcion(e.target.value)} required />
          <input type="number" placeholder="Peso" onChange={e => setPeso(e.target.value)} required />
          <input type="text" placeholder="Unidad" onChange={e => setUnidad(e.target.value)} required />
          <input type="text" placeholder="Marca" onChange={e => setMarca(e.target.value)} required />

          <select onChange={e => setCategoria(e.target.value)} required>
            <option value="">Seleccione una categoría</option>
            <option value="carnes">Carnes</option>
            <option value="lacteos">Lácteos</option>
            <option value="aseo">Aseo</option>
            <option value="alcohol">Alcohol</option>
            <option value="frutas y verduras">Frutas y Verduras</option>
            <option value="cuidado personal">Cuidado Personal</option>
          </select>

          {/* Input de imagen */}
          <input
            type="file"
            name="imagen"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
            required
          />

          {/* Nuevos campos */}
          <input
            type="number"
            step="0.01"
            placeholder="Precio"
            onChange={(e) => setPrecio(e.target.value)}
            required
          />

          <select onChange={e => setSupermercado(e.target.value)} required>
            <option value="">Seleccione un supermercado</option>
            <option value="1">Supermercado Éxito</option>
            <option value="3">Tiendas D1</option>
            <option value="4">Tiendas Ara</option>
          </select>

          <button type="submit">Crear producto</button>
        </form>
      )}
      {/*}
      {vista === 'actualizar' && (
        <div className="admin-form">
          <p>Aquí va el formulario para actualizar productos.</p>
        </div>
      )}

      {vista === 'eliminar' && (
        <div className="admin-form">
          <p>Aquí va la interfaz para eliminar productos.</p>
        </div>
      )}
        */}
    </div>
  );
};

export default AdminProductos;
