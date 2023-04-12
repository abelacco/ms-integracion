const {
  CODIGO_COMPROBANTE,
  TIPO_COMPROBANTE,
} = require("../config/constantes");

 function setearComprobanteProveedor(tipodocumento) {
console.log("UTILIYSERVICES --> tipodocumento", tipodocumento)
  switch (tipodocumento) {
    case  CODIGO_COMPROBANTE.BOLETA:
      console.log("UTILIYSERVICES --> CODIGO_COMPROBANTE.BOLOFACBOL")
      return TIPO_COMPROBANTE.BOLETAOFACTURA;
    case  CODIGO_COMPROBANTE.FACTURA:
      console.log("UTILIYSERVICES --> CODIGO_COMPROBANTE.BOLOFACFAC")
      return TIPO_COMPROBANTE.BOLETAOFACTURA;
    case  CODIGO_COMPROBANTE.NC:
      console.log("UTILIYSERVICES --> CODIGO_COMPROBANTE.NC")
      return TIPO_COMPROBANTE.NOTACREDITO;
    case  CODIGO_COMPROBANTE.ND:
      console.log("UTILIYSERVICES --> CODIGO_COMPROBANTE.ND")
      return TIPO_COMPROBANTE.NOTADEBITO;

    default:
      return;
  }
}

module.exports = {
    setearComprobanteProveedor
}
