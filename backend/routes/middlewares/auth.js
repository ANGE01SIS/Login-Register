import jwt from "jsonwebtoken";
import AppError from "../../errors/AppError.js";
const secretKey = "ALO_HIHI";

function auth(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1]; // Formato: "Bearer token"

  if (!token) return next(new AppError("Token no proporcionado", 401));

  try {
    const data = jwt.verify(token, secretKey);
    req.user = data;
    next();
  } catch {
    next(new AppError("Token inválido o expirado", 403));
  }
}

export default auth;
