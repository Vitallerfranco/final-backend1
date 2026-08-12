// Middleware que revisa que vengan los campos obligatorios antes de crear un producto
export default (req, res, next) => {

  const { title, description, code, price, stock, category } = req.body;

  const faltantes = [];

  if (!title) faltantes.push("title");
  if (!description) faltantes.push("description");
  if (!code) faltantes.push("code");
  if (price === undefined) faltantes.push("price");
  if (stock === undefined) faltantes.push("stock");
  if (!category) faltantes.push("category");

  if (faltantes.length > 0) {

    return res.status(400).json({
      status: "error",
      message: "Faltan campos obligatorios: " + faltantes.join(", ")
    });
  }

  if (isNaN(Number(price)) || Number(price) < 0) {

    return res.status(400).json({
      status: "error",
      message: "El precio tiene que ser un numero mayor o igual a 0"
    });
  }

  if (isNaN(Number(stock)) || Number(stock) < 0) {

    return res.status(400).json({
      status: "error",
      message: "El stock tiene que ser un numero mayor o igual a 0"
    });
  }

  next();
};
