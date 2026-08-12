import express from "express";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import productosRoutes from "./routes/productos.js";
import carritosRoutes from "./routes/carritos.js";
import vistasRoutes from "./routes/vistas.js";

import multiplicar from "./helpers/multiplicar.js";
import ifEquals from "./helpers/ifEquals.js";

import manejoErrores from "./middlewares/manejoErrores.js";
import ProductManager from "./dao/mongo/ProductManager.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 8080;

// __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));

// Handlebars
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    helpers: {
      multiplicar,
      ifEquals
    }
  })
);

app.set("view engine", "handlebars");
app.set("views", join(__dirname, "views"));

// MongoDB
mongoose.connect("mongodb://localhost:27017/ecommerce")
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log(err));

// guardo io en la app para poder emitir desde los routers
app.set("io", io);

// Routes
app.use("/api/products", productosRoutes);
app.use("/api/carts", carritosRoutes);
app.use("/", vistasRoutes);

// 404
app.use((req, res) => {

  // si la ruta era de la api devuelvo json, si no muestro la vista de error
  if (req.originalUrl.startsWith("/api")) {

    return res.status(404).json({
      status: "error",
      message: "Ruta no encontrada"
    });
  }

  res.status(404).render("error", {
    mensaje: "Página no encontrada"
  });
});

// manejo de errores
app.use(manejoErrores);

// ==========================
// WEBSOCKETS
// ==========================
const productManager = new ProductManager();

io.on("connection", async (socket) => {

  console.log("Cliente conectado:", socket.id);

  // apenas se conecta le mando la lista actual
  socket.emit("listaProductos", await productManager.getAll());

  socket.on("nuevoProducto", async (datos) => {

    try {

      await productManager.addProduct(datos);

      // se la mando a todos los clientes conectados
      io.emit("listaProductos", await productManager.getAll());

    } catch (error) {
      socket.emit("errorProducto", "No se pudo crear el producto: " + error.message);
    }

  });

  socket.on("borrarProducto", async (id) => {

    try {

      await productManager.deleteProduct(id);

      io.emit("listaProductos", await productManager.getAll());

    } catch (error) {
      socket.emit("errorProducto", "No se pudo borrar el producto");
    }

  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });

});

server.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
