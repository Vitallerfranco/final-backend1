const socket = io();

const formulario = document.getElementById("formProducto");
const lista = document.getElementById("listaProductos");
const mensaje = document.getElementById("mensaje");

// cuando el servidor manda la lista actualizada la vuelvo a dibujar
socket.on("listaProductos", (productos) => {

  lista.innerHTML = "";

  productos.forEach(producto => {

    const div = document.createElement("div");

    div.className = "card producto";

    div.innerHTML = `
      <h3>${producto.title}</h3>

      <p>
        <span class="badge">${producto.category}</span>
        <strong>$${producto.price}</strong>
      </p>

      <button class="btn btn-danger borrarSocket" data-id="${producto._id}">
        Eliminar
      </button>
    `;

    lista.appendChild(div);
  });

});

socket.on("errorProducto", (texto) => {
  mensaje.style.display = "block";
  mensaje.textContent = texto;
});

// creo el producto mandandolo por socket
formulario.addEventListener("submit", (e) => {

  e.preventDefault();

  const datos = new FormData(formulario);

  const producto = {
    title: datos.get("title"),
    description: datos.get("description"),
    code: datos.get("code"),
    price: Number(datos.get("price")),
    stock: Number(datos.get("stock")),
    category: datos.get("category"),
    status: true,
    thumbnails: []
  };

  socket.emit("nuevoProducto", producto);

  formulario.reset();

  mensaje.style.display = "none";
});

// uso delegación porque los botones se vuelven a crear cada vez
lista.addEventListener("click", (e) => {

  if (e.target.classList.contains("borrarSocket")) {

    socket.emit("borrarProducto", e.target.dataset.id);
  }

});
