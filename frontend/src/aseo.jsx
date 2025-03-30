import React from 'react';
import './aseo.css';
import logo from './assets/logos/logo.png';
import homeIcon from './assets/logos/home icon.svg';
import userIcon from './assets/logos/user icon.svg';
import notesIcon from './assets/logos/list icon.svg';
import featuredProductImage from './assets/aseo/producto1.png';
import cheapProductImage from './assets/aseo/producto2.png';
import product1 from './assets/aseo/producto3.png';
import product2 from './assets/aseo/producto4.jpg';
import product3 from './assets/aseo/producto5.png';
import product4 from './assets/aseo/producto6.jpg';
import product5 from './assets/aseo/producto7.png';


function Aseo() {
  const handleHomeClick = () => {
    // Redirigir al home (usar react-router)
    window.location.href = '/';
  };

  const handleNotesClick = () => {
    alert('Desplegando notas...');
  };

  const handleLoginClick = () => {
    alert('Redirigiendo al login...');
  };

  return (
    <div className="cleaning-page">
      {/* Header con logo y botones */}
      <header className="cleaning-header">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="header-buttons">
          <button onClick={handleHomeClick} className="header-button">
            <img src={homeIcon} alt="Home" />
            <span>Home</span>
          </button>
          <button onClick={handleNotesClick} className="header-button">
            <img src={notesIcon} alt="Notas" />
          </button>
          <button onClick={handleLoginClick} className="header-button">
            <img src={userIcon} alt="Perfil" />
          </button>
        </div>
      </header>

      {/* Hero Section con imagen de fondo */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Aseo</h1>
          <h2 className="hero-subtitle">Limpieza en cada producto</h2>
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Buscar prodcutos de aseo..." 
              className="search-input"
            />
            <button className="search-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Producto destacado */}
      <section className="featured-product">
        <div className="product-info">
          <h2>Producto más visto</h2>
          <p className="product-description">Producto de limpieza de alta calidad! Deja el piso brillando y a los visitantes sorprendidos..</p>
          <button className="action-button">Anotar</button>
        </div>
        <div className="product-image-container">
          <img src={featuredProductImage} alt="Producto destacado" className="product-image" />
        </div>
        <div className="product-price">
          <span className="price">$2,000</span>
          <span className="store">D1</span>
        </div>
      </section>

      {/* Producto más económico */}
      <section className="cheap-product">
        <div className="product-image-container">
          <img src={cheapProductImage} alt="Producto económico" className="product-image" />
        </div>
        <div className="product-info">
          <h2>Producto más económico</h2>
          <p className="product-description">Producto de limpieza ideal para limpiar.</p>
          <button className="action-button">Anotar</button>
        </div>
        <div className="product-price">
          <span className="price">$3,500</span>
          <span className="store">ARA</span>
        </div>
      </section>

      {/* Lista de productos */}
      <section className="products-section">
        <h2 className="section-title">Nuestros productos</h2>
        <div className="products-grid">
          {/* Producto 1 */}
          <div className="product-card">
            <img src={product1} alt="Carne de res" className="product-image" />
            <h3 className="product-name">Brilla King</h3>
            <div className="product-meta">
              <span className="product-price">$1,500</span>
              <span className="product-store">D1</span>
            </div>
          </div>

          {/* Producto 2 */}
          <div className="product-card">
            <img src={product2} alt="Carne de cerdo" className="product-image" />
            <h3 className="product-name">Brilla King - Bicarbonato</h3>
            <div className="product-meta">
              <span className="product-price">$2,000</span>
              <span className="product-store">D1  </span>
            </div>
          </div>

          {/* Producto 3 */}
          <div className="product-card">
            <img src={product3} alt="Pollo" className="product-image" />
            <h3 className="product-name">Detergente - Bonaropa</h3>
            <div className="product-meta">
              <span className="product-price">$4,000</span>
              <span className="product-store">Ara</span>
            </div>
          </div>

          {/* Producto 4 */}
          <div className="product-card">
            <img src={product4} alt="Carne molida" className="product-image" />
            <h3 className="product-name">Brilla King - Limon</h3>
            <div className="product-meta">
              <span className="product-price">$1,700</span>
              <span className="product-store">D1</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Aseo;