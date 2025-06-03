import React, { useState } from 'react';
import './preguntasFrecuentes.css';

const faqs = [
  {
    pregunta: '¿Cómo puedo reportar un nuevo precio de producto?',
    respuesta: 'Debes iniciar sesión, ir al producto deseado y presionar "Reportar precio". Luego ingresas el precio y seleccionas el supermercado.',
  },
  {
    pregunta: '¿Cómo gano puntos en la plataforma?',
    respuesta: 'Ganas puntos al reportar precios. Recibes 10 puntos por cada reporte y 50 puntos adicionales si tu precio coincide con el que se actualiza como común.',
  },
  {
    pregunta: '¿Dónde veo mis puntos acumulados?',
    respuesta: 'Puedes ver tus puntos totales y el historial en la sección de perfil, donde se muestra cada punto ganado por reporte.',
  },
  {
    pregunta: '¿Qué puedo hacer con mis puntos?',
    respuesta: 'Puedes canjearlos por recompensas o descuentos disponibles en la sección de recompensas.',
  },
  {
    pregunta: '¿Cómo contacto con soporte?',
    respuesta: 'Puedes escribirnos a soporte@tuapp.com o usar el formulario de contacto en la sección de Ayuda.',
  },
];

const PreguntasFrecuentes = () => {
  const [activa, setActiva] = useState(null);

  const toggleFAQ = (index) => {
    setActiva(activa === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1 className="faq-title">Preguntas Frecuentes</h1>
      <div className="faq-lista">
        {faqs.map((faq, index) => (
          <div
            className={`faq-item ${activa === index ? 'activa' : ''}`}
            key={index}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-pregunta">{faq.pregunta}</div>
            <div className={`faq-respuesta ${activa === index ? 'mostrar' : ''}`}>
              {faq.respuesta}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreguntasFrecuentes;
