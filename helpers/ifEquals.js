// sirve para dejar marcada la opción elegida en los select de filtros
export default function (a, b, options) {
  return a === b ? options.fn(this) : options.inverse(this);
}
