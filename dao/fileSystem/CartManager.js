import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Implementacion de carritos con FileSystem (queda como respaldo del proyecto viejo)
class CartManagerFS {

  constructor() {
    this.path = join(__dirname, "../../data/carritos.json");
  }

  async leerArchivo() {

    try {
      const contenido = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(contenido);
    } catch (error) {
      return [];
    }
  }

  async guardarArchivo(carritos) {
    await fs.promises.writeFile(this.path, JSON.stringify(carritos, null, 2));
  }

  generarId(carritos) {

    if (carritos.length === 0) return 1;

    return Math.max(...carritos.map(c => c.id)) + 1;
  }

  async createCart() {

    const carritos = await this.leerArchivo();

    const nuevo = {
      id: this.generarId(carritos),
      products: []
    };

    carritos.push(nuevo);

    await this.guardarArchivo(carritos);

    return nuevo;
  }

  async getCartById(id) {

    const carritos = await this.leerArchivo();

    return carritos.find(c => c.id === Number(id));
  }

  async addProductToCart(cid, pid) {

    const carritos = await this.leerArchivo();

    const indice = carritos.findIndex(c => c.id === Number(cid));

    if (indice === -1) return null;

    const productos = carritos[indice].products;

    const indiceProd = productos.findIndex(p => p.product === Number(pid));

    if (indiceProd === -1) {
      productos.push({ product: Number(pid), quantity: 1 });
    } else {
      productos[indiceProd].quantity++;
    }

    await this.guardarArchivo(carritos);

    return carritos[indice];
  }

}

export default CartManagerFS;
