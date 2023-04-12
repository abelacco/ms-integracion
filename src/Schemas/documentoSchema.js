const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const documentoSchema = new Schema({
  fecha_envio: {type:Date , default: Date.now},
  suscripcion:{type:String},
  integracion:{type:String},
  storeID: {type:String},
  code: {type:String},
  json_integracion: {type:Object},
  jsonrespuesta:{ type:Object},
  estado:{type:String},
  intentos: {type:String},
  estadoConfirmacion: {type:String},
}, { strict: false });

module.exports = mongoose.model("Documento", documentoSchema);
