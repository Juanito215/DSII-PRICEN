import React from 'react';
import './terminosYcondiciones.css'; // Asegúrate de tener este archivo para estilos


const TerminosYCondiciones = () => {
  return (
    <div className="terminos-container">
    <h1 className="terminos-title">Términos y Condiciones</h1>

    <section className="terminos-section">
        <p>Al acceder y utilizar esta aplicación, aceptas cumplir con los presentes términos y condiciones de uso...</p>
    </section>
        <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
        
        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">1. Aceptación de los Términos</h2>
            <p>
            Al acceder y utilizar esta aplicación, aceptas cumplir con los presentes términos y condiciones de uso.
            Si no estás de acuerdo con alguno de estos términos, no deberás utilizar este sitio web.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">2. Uso de la Aplicación</h2>
            <p>
            Esta plataforma está destinada al uso personal de los usuarios para consultar, comparar y reportar precios
            de productos. El uso indebido, incluyendo el uso fraudulento de los datos o la suplantación de identidad,
            será motivo de suspensión o eliminación de la cuenta.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">3. Registro de Usuario</h2>
            <p>
            Para acceder a ciertas funciones, deberás crear una cuenta. Es tu responsabilidad mantener la confidencialidad
            de tu contraseña y los datos de acceso. No nos hacemos responsables por actividades realizadas desde tu cuenta
            sin tu autorización.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">4. Recolección de Datos</h2>
            <p>
            Los datos proporcionados por los usuarios se tratan conforme a nuestra Política de Privacidad. Al usar esta app,
            aceptas la recolección y uso de información conforme a dicha política.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">5. Modificaciones</h2>
            <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos mediante la
            aplicación o correo electrónico cuando esto ocurra. El uso continuado de la app implica tu aceptación
            de los nuevos términos.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">6. Responsabilidad</h2>
            <p>
            Hacemos lo posible por mantener la información actualizada y precisa, pero no garantizamos su veracidad al 100%.
            Los precios pueden variar según el supermercado y el momento de la consulta.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">7. Contacto</h2>
            <p>
            Si tienes preguntas sobre estos términos, puedes contactarnos a través del correo: <strong>soporte@pricen.com</strong>.
            </p>
        </section>

        <p className="text-sm text-gray-500 mt-10 text-center">Última actualización: 2 de junio de 2025</p>
        </div>
        <p className="terminos-footer">Última actualización: 2 de junio de 2025</p>
    </div>
  );
};

export default TerminosYCondiciones;
