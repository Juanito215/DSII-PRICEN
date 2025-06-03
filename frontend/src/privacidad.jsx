import React from 'react';
import './privacidad.css'; // Asegúrate de tener este archivo

const Privacidad = () => {
  return (
    <div className="privacidad-container">
      <h1 className="privacidad-titulo">Política de Privacidad</h1>

      <section className="privacidad-seccion">
        <h2>1. Información que recopilamos</h2>
        <p>Recopilamos datos como nombre, correo electrónico, ubicación y hábitos de compra cuando usas nuestra plataforma.</p>
      </section>

      <section className="privacidad-seccion">
        <h2>2. Uso de la información</h2>
        <p>Utilizamos la información para personalizar la experiencia del usuario, mejorar nuestros servicios y ofrecer recompensas.</p>
      </section>

      <section className="privacidad-seccion">
        <h2>3. Compartir datos</h2>
        <p>No compartimos tu información personal con terceros sin tu consentimiento, salvo por requerimientos legales.</p>
      </section>

      <section className="privacidad-seccion">
        <h2>4. Seguridad</h2>
        <p>Protegemos tus datos mediante cifrado, autenticación y buenas prácticas de seguridad.</p>
      </section>

      <section className="privacidad-seccion">
        <h2>5. Derechos del usuario</h2>
        <p>Tienes derecho a acceder, corregir o eliminar tus datos personales desde tu perfil o contactando con soporte.</p>
      </section>

      <section className="privacidad-seccion">
        <h2>6. Cambios en la política</h2>
        <p>Nos reservamos el derecho de modificar esta política. Te notificaremos sobre cambios importantes.</p>
      </section>
    </div>
  );
};

export default Privacidad;
