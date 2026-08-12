import express from "express";
import ProductManager from "../dao/mongo/ProductManager.js";
import validarProducto from "../middlewares/validarProducto.js";

const router = express.Router();

const productManager = new ProductManager();

// arma los links de anterior y siguiente manteniendo los filtros
function armarLink(req, pagina) {

  if (!pagina) return null;

  const { limit, query, sort } = req.query;

  let link = `${req.protocol}://${req.get("host")}/api/products?page=${pagina}`;

  if (limit) link += `&limit=${limit}`;
  if (query) link += `&query=${query}`;
  if (sort) link += `&sort=${sort}`;

  return link;
}

// ==========================
// LISTAR + PAGINACION + FILTROS
// ==========================
router.get("/", async (req, res, next) => {

  try {

    const { limit, page, query, sort } = req.query;

    const resultado = await productManager.getProducts({ limit, page, query, sort });

    res.json({
      status: "success",
      payload: resultado.docs,
      totalPages: resultado.totalPages,
      prevPage: resultado.prevPage,
      nextPage: resultado.nextPage,
      page: resultado.page,
      hasPrevPage: resultado.hasPrevPage,
      hasNextPage: resultado.hasNextPage,
      prevLink: armarLink(req, resultado.prevPage),
      nextLink: armarLink(req, resultado.nextPage)
    });

  } catch (error) {
    next(error);
  }

});

// ==========================
// TRAER UNO POR ID
// ==========================
router.get("/:pid", async (req, res, next) => {

  try {

    const producto = await productManager.getProductById(req.params.pid);

    if (!producto) {

      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado"
      });
    }

    res.json({
      status: "success",
      payload: producto
    });

  } catch (error) {
    next(error);
  }

});

// ==========================
// CREAR
// ==========================
router.post("/", validarProducto, async (req, res, next) => {

  try {

    const producto = await productManager.addProduct(req.body);

    // aviso por socket asi se actualiza la vista de tiempo real
    const io = req.app.get("io");
    io.emit("listaProductos", await productManager.getAll());

    res.status(201).json({
      status: "success",
      payload: producto
    });

  } catch (error) {
    next(error);
  }

});

// ==========================
// ACTUALIZAR
// ==========================
router.put("/:pid", async (req, res, next) => {

  try {

    const producto = await productManager.updateProduct(req.params.pid, req.body);

    if (!producto) {

      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado"
      });
    }

    const io = req.app.get("io");
    io.emit("listaProductos", await productManager.getAll());

    res.json({
      status: "success",
      payload: producto
    });

  } catch (error) {
    next(error);
  }

});

// ==========================
// ELIMINAR
// ==========================
router.delete("/:pid", async (req, res, next) => {

  try {

    const producto = await productManager.deleteProduct(req.params.pid);

    if (!producto) {

      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado"
      });
    }

    const io = req.app.get("io");
    io.emit("listaProductos", await productManager.getAll());

    res.json({
      status: "success",
      message: "Producto eliminado",
      payload: producto
    });

  } catch (error) {
    next(error);
  }

});

export default router;
