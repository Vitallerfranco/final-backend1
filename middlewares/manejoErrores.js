// Middleware de manejo de errores, va siempre al final de todo en app.js
export default (error, req, res, next) => {

  console.log("Error:", error.message);

  let status = 500;
  let mensaje = "Error interno del servidor";

  // el id no tiene el formato de un ObjectId de mongo
  if (error.name === "CastError") {
    status = 400;
    mensaje = "El ID enviado no es valido";
  }

  // campo unico repetido (por ejemplo el code)
  if (error.code === 11000) {
    status = 400;
    mensaje = "Ya existe un producto con ese code";
  }

  if (error.name === "ValidationError") {
    status = 400;
    mensaje = error.message;
  }

  // la api responde json y las vistas muestran la pantalla de error
  if (req.originalUrl.startsWith("/api")) {

    return res.status(status).json({
      status: "error",
      message: mensaje
    });
  }

  return res.status(status).render("error", { mensaje });
};
