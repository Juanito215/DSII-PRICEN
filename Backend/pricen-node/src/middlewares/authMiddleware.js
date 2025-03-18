const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.header("Authorization"); // 🔹 Leer el token desde el header

  if (!token) {
    return res.status(403).json({ message: "Acceso denegado. Token requerido." });
  }

  try {
    const tokenParts = token.split(" "); // 🔹 Separa "Bearer" del token
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(401).json({ message: "Formato de token inválido." });
    }

    const verified = jwt.verify(tokenParts[1], process.env.JWT_SECRET);
    req.user = verified; // ✅ Guardar info del usuario en req.user
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido." });
  }
};
