import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './adminProductos.css';

const AdminProductos = () => {
  const [vista, setVista] = useState('crear');

  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Campos comunes para crear/actualizar
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [peso, setPeso] = useState('');
  const [unidad, setUnidad] = useState('');
  const [marca, setMarca] = useState('');
  const [imagen, setImagen] = useState(null);

  // Solo para crear producto + precio
  const [precio, setPrecio] = useState('');
  const [supermercado, setSupermercado] = useState('');

  const token = localStorage.getItem('token');

  // Cargar productos al cambiar vista (actualizar o eliminar)
  useEffect(() => {
    if (vista === 'actualizar' || vista === 'eliminar') {
      obtenerProductos();
    }
    setProductoSeleccionado(null);
    resetFormulario();
  }, [vista]);

  // Limpiar formulario
  const resetFormulario = () => {
    setNombre('');
    setDescripcion('');
    setCategoria('');
    setPeso('');
    setUnidad('');
    setMarca('');
    setImagen(null);
    setPrecio('');
    setSupermercado('');
  };

  // Obtener productos del backend
  const obtenerProductos = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/productos/getProduct', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductos(res.data);
    } catch (err) {
      console.error('Error al obtener productos', err);
      alert('Error al cargar productos');
    }
  };

  // Cuando se selecciona un producto para actualizar o eliminar
  const seleccionarProducto = (id) => {
    const prod = productos.find(p => p.id === Number(id));
    if (prod) {
      setProductoSeleccionado(prod);
      setNombre(prod.nombre || '');
      setDescripcion(prod.descripcion || '');
      setCategoria(prod.categoria || '');
      setPeso(prod.peso || '');
      setUnidad(prod.unidad_medida || '');
      setMarca(prod.marca || '');
      setImagen(null);
      // No seteamos precio ni supermercado porque no están en producto directamente
      setPrecio('');
      setSupermercado('');
    } else {
      setProductoSeleccionado(null);
      resetFormulario();
    }
  };

  // Crear producto y precio asociados
  const handleCrear = async (e) => {
    e.preventDefault();

    if (!imagen) {
      alert('La imagen es obligatoria');
      return;
    }
    if (!supermercado) {
      alert('Seleccione un supermercado');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('categoria', categoria);
    formData.append('peso', peso);
    formData.append('unidad_medida', unidad);
    formData.append('marca', marca);
    formData.append('imagen', imagen);

    try {
      const resProducto = await axios.post('http://localhost:3000/api/productos/registerProduct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      const productoId = resProducto.data.producto.id;

      await axios.post('http://localhost:3000/api/precios', {
        producto_id: productoId,
        supermercado_id: supermercado,
        precio,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Producto y precio creados exitosamente');
      resetFormulario();
    } catch (err) {
      console.error(err);
      alert('Error al crear el producto o el precio');
    }
  };

  // Actualizar producto seleccionado
  const handleActualizar = async (e) => {
    e.preventDefault();
    if (!productoSeleccionado) {
      alert('Selecciona un producto para actualizar');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('categoria', categoria);
    formData.append('peso', peso);
    formData.append('unidad_medida', unidad);
    formData.append('marca', marca);
    if (imagen) formData.append('imagen', imagen);

    try {
      await axios.put(`http://localhost:3000/api/productos/${productoSeleccionado.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Producto actualizado con éxito');
      obtenerProductos();
      setProductoSeleccionado(null);
      resetFormulario();
    } catch (error) {
      console.error(error);
      alert('Error al actualizar el producto');
    }
  };

  // Eliminar producto seleccionado
  const handleEliminar = async () => {
    if (!productoSeleccionado) {
      alert('Selecciona un producto para eliminar');
      return;
    }

    const confirmDelete = window.confirm(`¿Estás seguro de eliminar "${productoSeleccionado.nombre}"?`);
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/api/productos/${productoSeleccionado.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Producto eliminado correctamente');
      obtenerProductos();
      setProductoSeleccionado(null);
      resetFormulario();
    } catch (error) {
      console.error(error);
      alert('Error al eliminar el producto');
    }
  };

  return (
    <div className="admin-productos-container">
      <h2>Gestión de Productos</h2>
      <div className="navbar">Panel de Administración</div>

      <div className="admin-tabs">
        <button onClick={() => setVista('crear')} className={vista === 'crear' ? 'activo' : ''}>
          Crear
        </button>
        <button onClick={() => setVista('actualizar')} className={vista === 'actualizar' ? 'activo' : ''}>
          Actualizar
        </button>
        <button onClick={() => setVista('eliminar')} className={vista === 'eliminar' ? 'activo' : ''}>
          Eliminar
        </button>
      </div>

      {vista === 'crear' && (
        <form onSubmit={handleCrear} className="admin-form" encType="multipart/form-data">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
          <textarea
            placeholder="Descripción"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Peso"
            value={peso}
            onChange={e => setPeso(e.target.value)}
            required
            min="0"
          />
          <input
            type="text"
            placeholder="Unidad"
            value={unidad}
            onChange={e => setUnidad(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Marca"
            value={marca}
            onChange={e => setMarca(e.target.value)}
            required
          />
          <select
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            required
          >
            <option value="">Seleccione una categoría</option>
            <option value="carnes">Carnes</option>
            <option value="lacteos">Lácteos</option>
            <option value="aseo">Aseo</option>
            <option value="alcohol">Alcohol</option>
            <option value="frutas y verduras">Frutas y Verduras</option>
            <option value="cuidado personal">Cuidado Personal</option>
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={e => setImagen(e.target.files[0])}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Precio"
            value={precio}
            onChange={e => setPrecio(e.target.value)}
            required
            min="0"
          />
          <select
            value={supermercado}
            onChange={e => setSupermercado(e.target.value)}
            required
          >
            <option value="">Seleccione un supermercado</option>
            <option value="1">Supermercado Éxito</option>
            <option value="3">Tiendas D1</option>
            <option value="4">Tiendas Ara</option>
          </select>
          <button type="submit">Crear producto</button>
        </form>
      )}

      {vista === 'actualizar' && (
        <div className="admin-form">
          <select
            onChange={(e) => seleccionarProducto(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              Selecciona un producto para actualizar
            </option>
            {productos.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.nombre} - {prod.marca}
              </option>
            ))}
          </select>

          <form onSubmit={handleActualizar} encType="multipart/form-data">
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
              placeholder="Nombre"
              disabled={!productoSeleccionado}
            />
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              required
              placeholder="Descripción"
              disabled={!productoSeleccionado}
            />
            <input
              type="number"
              value={peso}
              onChange={e => setPeso(e.target.value)}
              required
              min="0"
              placeholder="Peso"
              disabled={!productoSeleccionado}
            />
            <input
              type="text"
              value={unidad}
              onChange={e => setUnidad(e.target.value)}
              required
              placeholder="Unidad"
              disabled={!productoSeleccionado}
            />
            <input
              type="text"
              value={marca}
              onChange={e => setMarca(e.target.value)}
              required
              placeholder="Marca"
              disabled={!productoSeleccionado}
            />
            <select
              value={categoria}
              onChange={e => setCategoria(e.target.value)}
              required
              disabled={!productoSeleccionado}
            >
              <option value="">Seleccione una categoría</option>
              <option value="carnes">Carnes</option>
              <option value="lacteos">Lácteos</option>
              <option value="aseo">Aseo</option>
              <option value="alcohol">Alcohol</option>
              <option value="frutas y verduras">Frutas y Verduras</option>
              <option value="cuidado personal">Cuidado Personal</option>
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={e => setImagen(e.target.files[0])}
              disabled={!productoSeleccionado}
            />
            <button type="submit" disabled={!productoSeleccionado}>
              Actualizar producto
            </button>
          </form>
        </div>
      )}


      {vista === 'eliminar' && (
        <div className="admin-form">
          <select
            onChange={(e) => seleccionarProducto(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              Selecciona un producto para eliminar
            </option>
            {productos.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.nombre} - {prod.marca}
              </option>
            ))}
          </select>

          <div>
            <p>
              {productoSeleccionado
                ? `¿Seguro que deseas eliminar "${productoSeleccionado.nombre}"?`
                : 'Selecciona un producto para poder eliminarlo.'}
            </p>
            <button
              onClick={handleEliminar}
              disabled={!productoSeleccionado}
            >
              Eliminar producto
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProductos;
