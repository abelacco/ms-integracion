const { agregarDocDb, actualizarDocDb, consultarDocsSinResDb, consultarDocInfoLocalDb, crearIntegracionDb, consultarDocsSinResDbRappi, actualizarEstadOrdenRappi } = require("../Entity/documentoEntity");
const { enviarDocRappi } = require("../proveedores/enviarDoc");
const { obtenerStoreId } = require("../proveedores/proveedoresLogica");


async function agregarDocumento(nuevoDocumento) {
  try {
    console.log("Model --> agregarDocumento", nuevoDocumento)
    const documento = await agregarDocDb(nuevoDocumento);
    return documento;
  } catch (error) {
    if (error.name === 'ValidationError') {
      return 'Error de validación: Verifica que todos los campos requeridos estén presentes y que sus valores sean válidos.';
    }
    return error;
  }
}


async function actualizarDocumento(respuestaProveedor, documento) {
  try {
    console.log("Model --> actualizarDocumento", respuestaProveedor)
    const documentoActualizado = await actualizarDocDb(respuestaProveedor, documento);
    return documentoActualizado;
  } catch (error) {
    return error;
  }
}

async function actualizarDocCroneRappi(respuestaProveedor, documento) {
  try {
    console.log("Model --> actualizarDocumento", respuestaProveedor)
    const documentoActualizado = await actualizarEstadOrdenRappi(respuestaProveedor, documento);
    return documentoActualizado;
  } catch (error) {
    return error;
  }
}

async function consultaRappi(documento) {
  try {
    console.log("Model --> consultaRappi", documento)
    const resRappi = await enviarDocRappi(documento);
    return resRappi;
  } catch (error) {
    return error;
  }
}

async function docsEstadoSinRes() {
  try {
    console.log("Model --> docsEstadoSinRes")
    const docsNoActualizados = await consultarDocsSinResDb();
    return docsNoActualizados;
  } catch (error) {
    return error;
  }
}

async function docsEstadoSinResRappi() {
  try {
    console.log("Model --> docsEstadoSinRes")
    const docsNoActualizados = await consultarDocsSinResDbRappi();
    return docsNoActualizados;
  } catch (error) {
    return error;
  }
}

async function generarDoc(json, infoLocal , proveedor) {
  try {
    console.log("Model --> generarDoc")
    let obj = {
      suscripcion: infoLocal.suscripcion,
      integracion: proveedor,
      storeId: infoLocal.storeId,
      code: json.code,
      json_integracion: json,
      json_respuesta: "",
      estado: '3',
      intentos: 0,
    }
    if(proveedor === 'Rappi'){
      obj.estadoConfirmacion = '3'
    }
    const nuevoDocumento = await agregarDocDb(obj);
    return nuevoDocumento;
  } catch (error) {
    return error;
  }
}


async function buscarDatosLocal(json , proveedor) {
  try {
    console.log("Model --> buscarDatosLocal")
    const storeId = await obtenerStoreId(json, proveedor)
    const infoLocal = await consultarDocInfoLocalDb(storeId);
    return infoLocal;
  } catch (error) {
    return error;
  }
}

async function crearIntegracion(datos) {
  try {
    console.log("Model --> crearIntegracion")
    const nuevaIntegracion = await crearIntegracionDb(datos);
    return nuevaIntegracion;
  } catch (error) {
    return error;
  }
}






module.exports = {
  agregarDocumento,
  consultaRappi,
  actualizarDocumento,
  docsEstadoSinRes,
  buscarDatosLocal,
  generarDoc,
  crearIntegracion,
  docsEstadoSinResRappi,
  actualizarDocCroneRappi
};
