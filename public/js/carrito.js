// Guardo el id del carrito en el localStorage asi no se pierde al cambiar de página

async function obtenerCarrito() {

  let cartId = localStorage.getItem("cartId");

  if (!cartId) {

    const respuesta = await fetch("/api/carts", { method: "POST" });

    const datos = await respuesta.json();

    cartId = datos.payload._id;

    localStorage.setItem("cartId", cartId);
  }

  return cartId;
}

// link "Mi carrito" del header
const linkCarrito = document.getElementById("verCarrito");

if (linkCarrito) {

  linkCarrito.addEventListener("click", async (e) => {

    e.preventDefault();

    const cartId = await obtenerCarrito();

    window.location.href = "/carts/" + cartId;
  });
}

// botones de agregar al carrito
document.querySelectorAll(".agregar").forEach(boton => {

  boton.addEventListener("click", async () => {

    const pid = boton.dataset.id;

    const cartId = await obtenerCarrito();

    const respuesta = await fetch(`/api/carts/${cartId}/products/${pid}`, {
      method: "POST"
    });

    const datos = await respuesta.json();

    if (datos.status === "success") {

      boton.textContent = "Agregado!";

      setTimeout(() => {
        boton.textContent = "Agregar al carrito";
      }, 1200);

    } else {
      alert(datos.message);
    }

  });

});

// botones de quitar un producto
document.querySelectorAll(".borrar").forEach(boton => {

  boton.addEventListener("click", async () => {

    const cid = boton.dataset.cart;
    const pid = boton.dataset.id;

    await fetch(`/api/carts/${cid}/products/${pid}`, { method: "DELETE" });

    window.location.reload();
  });

});

// boton de vaciar el carrito
const botonVaciar = document.querySelector(".vaciar");

if (botonVaciar) {

  botonVaciar.addEventListener("click", async () => {

    const cid = botonVaciar.dataset.cart;

    await fetch(`/api/carts/${cid}`, { method: "DELETE" });

    window.location.reload();
  });
}
