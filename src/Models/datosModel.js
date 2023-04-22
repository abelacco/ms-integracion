const { obtenerListaInfoLocalDb, buscarPedidosDb} = require("../Entity/datosEntity");


async function listaInfoLocalModel() {
  try {
    console.log("Model --> listaInfoLocalModel")
    const listaInfoLocal = await obtenerListaInfoLocalDb();
    return listaInfoLocal;
  } catch (error) {
    console.log("Model --> Error")
    return error;
  }
}

async function buscarPedidosModel(opcionesSeleccionadas) {
  const skip = (opcionesSeleccionadas.pagina - 1) * opcionesSeleccionadas.registros;
  const limit = opcionesSeleccionadas.registros;
  const datosPaginacion = {
    skip: skip,
    limit: limit
  };

  // Construye la consulta de búsqueda
  const query = {};

  if (opcionesSeleccionadas.integraciones && opcionesSeleccionadas.integraciones.length) {
    query.integracion = { $in: opcionesSeleccionadas.integraciones };
  }

  if (opcionesSeleccionadas.storeIds && opcionesSeleccionadas.storeIds.length) {
    query.storeId = { $in: opcionesSeleccionadas.storeIds };
  }

  if (opcionesSeleccionadas.estados && opcionesSeleccionadas.estados.length) {
    query.estado = { $in: opcionesSeleccionadas.estados };
  }

  if (opcionesSeleccionadas.fechas[0] && opcionesSeleccionadas.fechas[1]) {
    
    const fechaInicio = new Date(opcionesSeleccionadas.fechas[0]);
    fechaInicio.setUTCHours(0, 0, 0, 0);
    
    const fechaFin = new Date(opcionesSeleccionadas.fechas[1]);
    fechaFin.setUTCHours(23, 59, 59, 999);

    query.fecha_envio = {
      $gte: new Date(fechaInicio),
      $lte: new Date(fechaFin)
    };
  }

  try {
    console.log("Model --> buscarPedidosModel")
    const pedidosEncontrados = await buscarPedidosDb(query , datosPaginacion);
    return pedidosEncontrados;
  } catch (error) {
    console.log("Model --> Error")
    return error;
  }
}



module.exports = {
    listaInfoLocalModel,
    buscarPedidosModel
};
