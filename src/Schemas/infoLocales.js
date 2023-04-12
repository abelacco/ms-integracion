const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const infoLocalesSchema = new Schema({
  storeId: { type: String },
  integracion: { type: String }, //rappi o pedidos ya
  localId:  { type: Number },
  suscripcion:  { type: String },
  minutos_aceptacion: { type: String },
  clave_publica: { type: String },
  clave_privada: { type: String },
  audience: { type: String },
  marca_id: { type: String },
}, { strict: false });

module.exports = mongoose.model("InfoLocales", infoLocalesSchema);
