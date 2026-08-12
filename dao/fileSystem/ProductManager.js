import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Esta es la implementacion de las primeras clases, con persistencia en archivo.
// La dejo porque la consigna pide no borrarla, pero la app usa la version de Mongo.
class ProductManagerFS {

  constructor() {
    this.path = join(__dirname, "../../data/productos.json");
  }

  async leerArchivo() {

    try {
      const contenido = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(contenido);
    } catch (error) {
      // si el archivo todavia no existe devuelvo un array vacio
      return [];
    }
  }

  async guardarArchivo(productos) {
    await fs.promises.writeFile(this.path, JSON.stringify(productos, null, 2));
  }

  // el id lo genero sumando 1 al ultimo
  generarId(productos) {

    if (productos.length === 0) return 1;

    return Math.max(...productos.map(p => p.id)) + 1;
  }

  async getProducts() {
    return await this.leerArchivo();
  }

  async getProductById(id) {

    const productos = await this.leerArchivo();

    return productos.find(p => p.id === Number(id));
  }

  async addProduct(datos) {

    const productos = await this.leerArchivo();

    if (productos.find(p => p.code === datos.code)) {
      throw new Error("Ya existe un producto con ese code");
    }

    const nuevo = {
      id: this.generarId(productos),
      title: datos.title,
      description: datos.description,
      code: datos.code,
      price: datos.price,
      status: datos.status !== undefined ? datos.status : true,
      stock: datos.stock,
      category: datos.category,
      thumbnails: datos.thumbnails || []
    };

    productos.push(nuevo);

    await this.guardarArchivo(productos);

    return nuevo;
  }

  async updateProduct(id, campos) {

    const productos = await this.leerArchivo();

    const indice = productos.findIndex(p => p.id === Number(id));

    if (indice === -1) return null;

    delete campos.id;

    productos[indice] = { ...productos[indice], ...campos };

    await this.guardarArchivo(productos);

    return productos[indice];
  }

  async deleteProduct(id) {

    const productos = await this.leerArchivo();

    const indice = productos.findIndex(p => p.id === Number(id));

    if (indice === -1) return null;

    const borrado = productos[indice];

    productos.splice(indice, 1);

    await this.guardarArchivo(productos);

    return borrado;
  }

}

export default ProductManagerFS;
