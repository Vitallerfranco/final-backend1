import Producto from "../../models/Producto.js";

class ProductManager {

  // ==========================
  // FILTRO
  // ==========================
  // el query puede venir como "remeras", "category:calzado" o "available:true"
  armarFiltro(query) {

    if (!query) return {};

    if (query.includes(":")) {

      const [clave, valor] = query.split(":");

      if (clave === "category") {
        return { category: valor };
      }

      if (clave === "available" || clave === "status") {
        return { status: valor === "true" };
      }

      if (clave === "stock") {
        return { stock: { $gt: 0 } };
      }

      return {};
    }

    if (query === "true" || query === "false") {
      return { status: query === "true" };
    }

    return { category: query };
  }

  // ==========================
  // LISTAR CON PAGINACION
  // ==========================
  async getProducts({ limit = 10, page = 1, query, sort }) {

    limit = Number(limit) || 10;
    page = Number(page) || 1;

    const skip = (page - 1) * limit;

    const filtro = this.armarFiltro(query);

    const orden = {};

    if (sort === "asc") {
      orden.price = 1;
    }

    if (sort === "desc") {
      orden.price = -1;
    }

    const productos = await Producto
      .find(filtro)
      .sort(orden)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Producto.countDocuments(filtro);

    const totalPages = Math.ceil(total / limit);

    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    return {
      docs: productos,
      totalPages,
      page,
      hasPrevPage,
      hasNextPage,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null
    };
  }

  // ==========================
  // CRUD
  // ==========================
  async getProductById(pid) {
    return await Producto.findById(pid).lean();
  }

  async addProduct(datos) {

    const producto = new Producto({
      title: datos.title,
      description: datos.description,
      code: datos.code,
      price: Number(datos.price),
      status: datos.status !== undefined ? datos.status : true,
      stock: Number(datos.stock),
      category: datos.category,
      thumbnails: datos.thumbnails || []
    });

    await producto.save();

    return producto;
  }

  async updateProduct(pid, campos) {

    // el id no se puede modificar
    delete campos._id;
    delete campos.id;

    return await Producto.findByIdAndUpdate(pid, campos, {
      new: true,
      runValidators: true
    });
  }

  async deleteProduct(pid) {
    return await Producto.findByIdAndDelete(pid);
  }

  // lo uso para mandar la lista completa por socket
  async getAll() {
    return await Producto.find().lean();
  }

}

export default ProductManager;
