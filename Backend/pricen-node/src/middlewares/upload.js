const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const categoria = req.body.categoria;
    const rutaDestino = path.join(__dirname, '../../../../frontend/src/assets/', categoria); // ✅ corregido a "frontend"

    // Crear carpeta si no existe
    if (!fs.existsSync(rutaDestino)) {
      fs.mkdirSync(rutaDestino, { recursive: true });
    }

    cb(null, rutaDestino);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nombreUnico = Date.now() + ext;
    cb(null, nombreUnico);
  }
});

const upload = multer({ storage });

module.exports = upload;
