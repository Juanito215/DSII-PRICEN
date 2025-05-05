import React, { useState } from 'react';
import axios from 'axios';
import './adminProductos.css';

const AdminProductos = () => {
  const [vista, setVista] = useState('crear');

  // Estados para crear producto
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagen, setImagen] = useState(null);

  const handleCrear = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('categoria', categoria);
    formData.append('peso', 0);
    formData.append('unidad', 'kg');
    formData.append('marca', 'Sin Marca');
    formData.append('imagen', imagen);

    try {
      await axios.post('http://localhost:3000/api/productos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Producto creado exitosamente');
    } catch (err) {
      console.error(err);
      alert('Error al crear el producto');
    }
  };

  return (
    <div className="admin-productos-container">
      <h2>Gestión de Productos</h2>

      <div className="admin-tabs">
        <button onClick={() => setVista('crear')} className={vista === 'crear' ? 'activo' : ''}>Crear</button>
        <button onClick={() => setVista('actualizar')} className={vista === 'actualizar' ? 'activo' : ''}>Actualizar</button>
        <button onClick={() => setVista('eliminar')} className={vista === 'eliminar' ? 'activo' : ''}>Eliminar</button>
      </div>

      {vista === 'crear' && (
        <form onSubmit={handleCrear} className="admin-form">
          <input type="text" placeholder="Nombre" onChange={e => setNombre(e.target.value)} />
          <textarea placeholder="Descripción" onChange={e => setDescripcion(e.target.value)} />
          <input type="float" placeholder="peso" onChange={e => setPeso(e.target.value)} />
            <input type="text" placeholder="Unidad" onChange={e => setUnidad(e.target.value)} />
            <input type="text" placeholder="Marca" onChange={e => setMarca(e.target.value)} />  
          
          <select onChange={e => setCategoria(e.target.value)}>
            <option value="">Seleccione una categoría</option>
            <option value="carnes">Carnes</option>
            <option value="lacteos">Lácteos</option>
            <option value="aseo">Aseo</option>
            <option value="alcohol">Alcohol</option>
            <option value="frutas y verduras">Frutas y Verduras</option>
            <option value="cuidado personal">Cuidado Personal</option>
          </select>

          <input type="file" accept="image/*" onChange={e => setImagen(e.target.files[0])} />
          <button type="submit">Crear producto</button>
        </form>
      )}

      {vista === 'actualizar' && (
        <div className="admin-form">
          <p>Aquí va el formulario para actualizar productos.</p>
          {/* Aquí irá la lógica y los campos para actualizar productos */}
        </div>
      )}

      {vista === 'eliminar' && (
        <div className="admin-form">
          <p>Aquí va la interfaz para eliminar productos.</p>
          {/* Aquí irá la lógica y los controles para eliminar productos */}
        </div>
      )}
    </div>
  );
};

export default AdminProductos;
// adminProductos.css