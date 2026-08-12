import mongoose from "mongoose";

const carritoSchema = new mongoose.Schema({

  products: {

    type: [
      {
        // guardo el id del producto para despues hacer populate
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Producto",
          required: true
        },

        quantity: {
          type: Number,
          default: 1,
          min: 1
        }
      }
    ],

    default: []
  }

});

export default mongoose.model("Carrito", carritoSchema, "carts");
