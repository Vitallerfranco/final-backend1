import mongoose from "mongoose";
import Producto from "./models/Producto.js";

// Script para cargar productos de prueba y poder probar la paginación.
// Se corre con: npm run seed

const productos = [
  { title: "Remera básica blanca", description: "Remera de algodón peinado, corte regular", code: "REM001", price: 12500, status: true, stock: 40, category: "remeras", thumbnails: [] },
  { title: "Remera oversize negra", description: "Remera oversize de algodón, unisex", code: "REM002", price: 15900, status: true, stock: 25, category: "remeras", thumbnails: [] },
  { title: "Remera rayada azul", description: "Remera manga corta con rayas horizontales", code: "REM003", price: 14200, status: true, stock: 18, category: "remeras", thumbnails: [] },
  { title: "Musculosa deportiva", description: "Musculosa de secado rápido para entrenamiento", code: "REM004", price: 11800, status: false, stock: 0, category: "remeras", thumbnails: [] },
  { title: "Jean recto azul", description: "Jean de tiro medio, corte recto", code: "PAN001", price: 38900, status: true, stock: 22, category: "pantalones", thumbnails: [] },
  { title: "Jogging de frisa gris", description: "Jogging con puño elastizado y bolsillos", code: "PAN002", price: 29500, status: true, stock: 30, category: "pantalones", thumbnails: [] },
  { title: "Pantalón cargo verde", description: "Pantalón cargo con bolsillos laterales", code: "PAN003", price: 34700, status: true, stock: 12, category: "pantalones", thumbnails: [] },
  { title: "Short de gabardina", description: "Short de gabardina con cordón ajustable", code: "PAN004", price: 19900, status: true, stock: 16, category: "pantalones", thumbnails: [] },
  { title: "Campera de jean", description: "Campera de jean clásica con botones", code: "CAM001", price: 52000, status: true, stock: 9, category: "camperas", thumbnails: [] },
  { title: "Buzo canguro negro", description: "Buzo con capucha y bolsillo canguro", code: "CAM002", price: 41500, status: true, stock: 20, category: "camperas", thumbnails: [] },
  { title: "Campera rompeviento", description: "Campera impermeable liviana con capucha", code: "CAM003", price: 47800, status: true, stock: 7, category: "camperas", thumbnails: [] },
  { title: "Chaleco inflable", description: "Chaleco acolchado sin mangas", code: "CAM004", price: 44300, status: false, stock: 0, category: "camperas", thumbnails: [] },
  { title: "Zapatillas urbanas blancas", description: "Zapatillas de lona con suela de goma", code: "CAL001", price: 62000, status: true, stock: 14, category: "calzado", thumbnails: [] },
  { title: "Zapatillas running", description: "Zapatillas con amortiguación para correr", code: "CAL002", price: 78900, status: true, stock: 11, category: "calzado", thumbnails: [] },
  { title: "Borcegos de cuero", description: "Borcegos de cuero vacuno con cordones", code: "CAL003", price: 89500, status: true, stock: 5, category: "calzado", thumbnails: [] },
  { title: "Ojotas de goma", description: "Ojotas livianas para verano", code: "CAL004", price: 9800, status: true, stock: 50, category: "calzado", thumbnails: [] },
  { title: "Gorra trucker", description: "Gorra con visera curva y cierre regulable", code: "ACC001", price: 13400, status: true, stock: 35, category: "accesorios", thumbnails: [] },
  { title: "Cinturón de cuero", description: "Cinturón de cuero con hebilla metálica", code: "ACC002", price: 17600, status: true, stock: 21, category: "accesorios", thumbnails: [] },
  { title: "Mochila urbana", description: "Mochila con compartimento para notebook", code: "ACC003", price: 45200, status: true, stock: 13, category: "accesorios", thumbnails: [] },
  { title: "Medias pack x3", description: "Pack de tres pares de medias de algodón", code: "ACC004", price: 8900, status: true, stock: 60, category: "accesorios", thumbnails: [] }
];

const cargarDatos = async () => {

  try {

    await mongoose.connect("mongodb://localhost:27017/ecommerce");

    console.log("MongoDB conectado");

    await Producto.deleteMany({});

    console.log("Colección products vaciada");

    await Producto.insertMany(productos);

    console.log("Se cargaron " + productos.length + " productos");

    await mongoose.disconnect();

    console.log("Listo");

  } catch (error) {
    console.log(error.message);
  }

};

cargarDatos();
