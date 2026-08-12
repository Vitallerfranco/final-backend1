import express from "express";
import ProductManager from "../dao/mongo/ProductManager.js";
import CartManager from "../dao/mongo/CartManager.js";

const router = express.Router();

const productManager = new ProductManager();
const cartManager = new CartManager();

// los mismos links de paginacion pero para las vistas
function armarLink(req, pagina) {

  if (!pagina) return null;

  const { limit, query, sort } = req.query;

  let link = `/products?page=${pagina}`;

  if (limit) link += `&limit=${limit}`;
  if (query) link += `&query=${query}`;
  if (sort) link += `&sort=${sort}`;

  return link;
}

// ==========================
// HOME
// ==========================
router.get("/", (req, res) => {
  res.redirect("/products");
});

// ==========================
// LISTADO CON PAGINACION
// ==========================
router.get("/products", async (req, res, next) => {

  try {

    const { limit, page, query, sort } = req.query;

    const resultado = await productManager.getProducts({ limit, page, query, sort });

    res.render("productos", {
      productos: resultado.docs,
      page: resultado.page,
      totalPages: resultado.totalPages,
      hasPrevPage: resultado.hasPrevPage,
      hasNextPage: resultado.hasNextPage,
      prevLink: armarLink(req, resultado.prevPage),
      nextLink: armarLink(req, resultado.nextPage),
      queryActual: query || "",
      sortActual: sort || "",
      limitActual: limit || ""
    });

  } catch (error) {
    next(error);
  }

});

// ==========================
// DETALLE DEL PRODUCTO
// ==========================
router.get("/products/:pid", async (req, res, next) => {

  try {

    const producto = await productManager.getProductById(req.params.pid);

    if (!producto) {

      return res.status(404).render("error", {
        mensaje: "Producto no encontrado"
      });
    }

    res.render("detalle", { producto });

  } catch (error) {
    next(error);
  }

});

// ==========================
// VISTA DEL CARRITO
// ==========================
router.get("/carts/:cid", async (req, res, next) => {

  try {

    const carrito = await cartManager.getCartById(req.params.cid);

    if (!carrito) {

      return res.status(404).render("error", {
        mensaje: "Carrito no encontrado"
      });
    }

    // calculo el total sumando precio por cantidad
    let total = 0;

    carrito.products.forEach(item => {

      if (item.product) {
        total += item.product.price * item.quantity;
      }

    });

    res.render("carrito", {
      cartId: carrito._id,
      productos: carrito.products,
      total,
      vacio: carrito.products.length === 0
    });

  } catch (error) {
    next(error);
  }

});

// ==========================
// TIEMPO REAL
// ==========================
router.get("/realtimeproducts", async (req, res, next) => {

  try {

    const productos = await productManager.getAll();

    res.render("tiempoReal", { productos });

  } catch (error) {
    next(error);
  }

});

export default router;
