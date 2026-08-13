# Tienda Nova - API de e-commerce de indumentaria

Proyecto final de **Programación Backend I: Desarrollo Avanzado de Backend** (CoderHouse).

API de e-commerce para una tienda de ropa. Permite administrar el catálogo de
productos y los carritos de compra de los clientes, con persistencia en MongoDB,
vistas con Handlebars y actualización de productos en tiempo real con WebSockets.

## Tecnologías

- Node.js
- Express
- MongoDB + Mongoose
- Express Handlebars
- Socket.io

## Instalación

1. Clonar el repositorio:

```
git clone https://github.com/Vitallerfranco/final-backend1.git
cd final-backend1
```

2. Instalar las dependencias:

```
npm install
```

3. Tener MongoDB corriendo en local. La base se llama `ecommerce` y se crea sola la
   primera vez.

4. Cargar productos de prueba (20 productos de indumentaria, sirve para probar la
   paginación y los filtros):

```
npm run seed
```

5. Levantar el servidor:

```
npm start
```

o en modo desarrollo, con nodemon:

```
npm run dev
```

El servidor queda en http://localhost:8080

## Estructura del proyecto

```
app.js               -> servidor express + socket.io
dao/
  mongo/             -> managers que usa la app
    ProductManager.js
    CartManager.js
  fileSystem/        -> implementación previa con archivos (se mantiene)
    ProductManager.js
    CartManager.js
data/                -> json de la persistencia con FileSystem
helpers/             -> helpers de handlebars
middlewares/         -> validación de productos y manejo de errores
models/              -> schemas de mongoose
  Producto.js
  Carrito.js
public/              -> css y js del front
routes/
  productos.js       -> /api/products
  carritos.js        -> /api/carts
  vistas.js          -> vistas handlebars
seed.js              -> carga de productos de prueba
views/               -> vistas, layout y partials
```

La lógica está separada en capas: los routers reciben la request y arman la
respuesta, los managers del `dao` se encargan del acceso a los datos y los models
definen los schemas. Como los routers consumen el DAO y no el modelo directamente,
la implementación de Mongo y la de FileSystem conviven sin tocar las rutas.

## Endpoints

### Productos — `/api/products`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/products` | Lista paginada. Acepta `limit`, `page`, `query` y `sort` |
| GET | `/api/products/:pid` | Trae un producto por ID |
| POST | `/api/products` | Crea un producto (el ID lo genera Mongo) |
| PUT | `/api/products/:pid` | Actualiza un producto sin modificar el ID |
| DELETE | `/api/products/:pid` | Elimina un producto |

Valores por defecto: `limit = 10`, `page = 1`.

Ejemplos de consulta:

```
/api/products?limit=5&page=2
/api/products?query=remeras
/api/products?query=category:calzado
/api/products?query=available:true
/api/products?sort=asc
/api/products?limit=4&page=1&query=pantalones&sort=desc
```

Formato de respuesta de `GET /api/products`:

```json
{
  "status": "success",
  "payload": [],
  "totalPages": 0,
  "prevPage": null,
  "nextPage": null,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": false,
  "prevLink": null,
  "nextLink": null
}
```

`prevLink` y `nextLink` se arman conservando los filtros activos, así al cambiar de
página no se pierde la búsqueda.

Body para crear un producto:

```json
{
  "title": "Remera básica blanca",
  "description": "Remera de algodón peinado",
  "code": "REM010",
  "price": 12500,
  "status": true,
  "stock": 40,
  "category": "remeras",
  "thumbnails": []
}
```

### Carritos — `/api/carts`

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/carts` | Crea un carrito vacío |
| GET | `/api/carts/:cid` | Lista los productos del carrito con `populate` |
| POST | `/api/carts/:cid/products/:pid` | Agrega un producto (si ya está, incrementa la cantidad) |
| DELETE | `/api/carts/:cid/products/:pid` | Saca un producto del carrito |
| PUT | `/api/carts/:cid` | Reemplaza todos los productos del carrito |
| PUT | `/api/carts/:cid/products/:pid` | Actualiza solo la cantidad de un producto |
| DELETE | `/api/carts/:cid` | Vacía el carrito |

Body de `PUT /api/carts/:cid`:

```json
{
  "products": [
    { "product": "ID_DEL_PRODUCTO", "quantity": 3 }
  ]
}
```

Body de `PUT /api/carts/:cid/products/:pid`:

```json
{
  "quantity": 5
}
```

## Vistas

| Ruta | Descripción |
|------|-------------|
| `/products` | Catálogo con paginación, filtro por categoría y orden por precio |
| `/products/:pid` | Detalle del producto con botón para agregar al carrito |
| `/carts/:cid` | Productos del carrito con subtotales y total |
| `/realtimeproducts` | Alta y baja de productos en tiempo real |

El ID del carrito se guarda en el `localStorage` del navegador, así el cliente
mantiene el mismo carrito mientras navega por el sitio.

## WebSockets

En `/realtimeproducts` se pueden crear y eliminar productos sin recargar la página.
Cuando se crea o se borra un producto —tanto desde la vista como desde la API— el
servidor emite el evento `listaProductos` con la lista actualizada y todos los
clientes conectados refrescan la vista automáticamente.

## Base de datos

Base `ecommerce`, con las colecciones `products` y `carts`. El nombre de cada
colección se define como tercer parámetro de `mongoose.model()`.

El carrito guarda una referencia al producto (`ObjectId` con `ref: "Producto"`) y no
una copia, así el carrito siempre refleja el precio y los datos actuales. La
información completa se trae con `populate`.
