import express from "express";
import CartManager from "../dao/mongo/CartManager.js";
import ProductManager from "../dao/mongo/ProductManager.js";

const router = express.Router();

const cartManager = new CartManager();
const productManager = new ProductManager();

// ==========================
// CREAR CARRITO
// ==========================
router.post("/", async (req, res, next) => {

  try {

    const carrito = await cartManager.createCart();

    res.status(201).json({
      status: "success",
      payload: carrito
    });

  } catch (error) {
    next(error);
  }

});

// ==========================
// LISTAR PRODUCTOS DEL CARRITO (con populate)
// ==========================
router.get("/:cid", async (req, res, next) => {

  try {

    const carrito = await cartManager.getCartById(req.params.cid);

    if (!carrito) {

      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado"
      });
    }

    res.json({
      status: "success",
      payload: carrito.products
    });

  } catch (error) {
    next(error);
  }

});

// ==========================
// AGREGAR PRODUCTO AL CARRITO
// ==========================
router.post("/:cid/products/:pid", async (req, res, next) => {

  try {

    const { cid, pid } = req.params;

    // primero me fijo que el producto exista
    const producto = await productManager.getProductById(pid);

    if (!producto) {

      return res.status(404).json({
        status: "error",
        message: "El producto no existe"
      });
    }

    const carrito = await cartManager.addProductToCart(cid, pid);

    if (!carrito) {

      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado"
      });
    }

    res.json({
      status: "success",
      payload: carrito
    });

  } catch (error) {
    next(error);
  }

});

// ==========================
// ELIMINAR UN PRODUCTO DEL CARRITO
// ==========================
router.delete("/:cid/products/:pid", async (req, res, next) => {

  try {

    const { cid, pid } = req.params;

    const carrito = await cartManager.deleteProductFromCart(cid, pid);

    if (!carrito) {

      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado"
      });
    }

    res.json({
      status: "success",
      message: "Producto eliminado del carrito",
      payload: carrito
    });

  } catch (error) {
    next(error);
  }

});

// ==========================
// ACTUALIZAR TODOS LOS PRODUCTOS DEL CARRITO
// ==========================
router.put("/:cid", async (req, res, next) => {

  try {

    const productos = req.body.products;

    if (!Array.isArray(productos)) {

      return res.status(400).json({
        status: "error",
        message: "Hay que mandar un arreglo products con product y quantity"
      });
    }

    for (const item of productos) {

      if (!item.product || !item.quantity) {

        return res.status(400).json({
          status: "error",
          message: "Cada item tiene que tener product y quantity"
        });
      }
    }

    const carrito = await cartManager.updateCart(req.params.cid, productos);

    if (!carrito) {

      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado"
      });
    }

    res.json({
      status: "success",
      payload: carrito
    });

  } catch (error) {
    next(error);
  }

});

// ==========================
// ACTUALIZAR SOLO LA CANTIDAD
// ==========================
router.put("/:cid/products/:pid", async (req, res, next) => {

  try {

    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || isNaN(Number(quantity)) || Number(quantity) < 1) {

      return res.status(400).json({
        status: "error",
        message: "La cantidad tiene que ser un numero mayor a 0"
      });
    }

    const carrito = await cartManager.updateProductQuantity(cid, pid, quantity);

    if (carrito === null) {

      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado"
      });
    }

    if (carrito === "sin producto") {

      return res.status(404).json({
        status: "error",
        message: "Ese producto no esta en el carrito"
      });
    }

    res.json({
      status: "success",
      payload: carrito
    });

  } catch (error) {
    next(error);
  }

});

// ==========================
// VACIAR EL CARRITO
// ==========================
router.delete("/:cid", async (req, res, next) => {

  try {

    const carrito = await cartManager.clearCart(req.params.cid);

    if (!carrito) {

      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado"
      });
    }

    res.json({
      status: "success",
      message: "Carrito vaciado",
      payload: carrito
    });

  } catch (error) {
    next(error);
  }

});

export default router;
