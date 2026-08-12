import Carrito from "../../models/Carrito.js";

class CartManager {

  async createCart() {

    const carrito = new Carrito({ products: [] });

    await carrito.save();

    return carrito;
  }

  // trae el carrito con la info completa de los productos
  async getCartById(cid) {

    return await Carrito
      .findById(cid)
      .populate("products.product")
      .lean();
  }

  async addProductToCart(cid, pid) {

    const carrito = await Carrito.findById(cid);

    if (!carrito) return null;

    const indice = carrito.products.findIndex(
      p => p.product.toString() === pid
    );

    if (indice === -1) {
      carrito.products.push({ product: pid, quantity: 1 });
    } else {
      carrito.products[indice].quantity++;
    }

    await carrito.save();

    return carrito;
  }

  async deleteProductFromCart(cid, pid) {

    const carrito = await Carrito.findById(cid);

    if (!carrito) return null;

    carrito.products = carrito.products.filter(
      p => p.product.toString() !== pid
    );

    await carrito.save();

    return carrito;
  }

  // reemplaza todo el arreglo de productos
  async updateCart(cid, productos) {

    return await Carrito.findByIdAndUpdate(
      cid,
      { products: productos },
      { new: true }
    );
  }

  async updateProductQuantity(cid, pid, quantity) {

    const carrito = await Carrito.findById(cid);

    if (!carrito) return null;

    const indice = carrito.products.findIndex(
      p => p.product.toString() === pid
    );

    if (indice === -1) return "sin producto";

    carrito.products[indice].quantity = Number(quantity);

    await carrito.save();

    return carrito;
  }

  async clearCart(cid) {

    return await Carrito.findByIdAndUpdate(
      cid,
      { products: [] },
      { new: true }
    );
  }

}

export default CartManager;
