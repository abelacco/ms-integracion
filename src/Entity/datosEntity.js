const InfoLocal = require("../Schemas/infoLocales");
const Pedidos = require("../Schemas/documentoSchema");


// Crear documento de rappi o pedidosYa
async function obtenerListaInfoLocalDb() {
  try {
    console.log("entity --> obtenerListaInfoLocalDb")

    const listaInfoLocal =  await InfoLocal.find()
    return listaInfoLocal

  } catch (error) {
    return error;
  }
}

// Buscar pedidos de rappi o pedidosYa
async function buscarPedidosDb(queryBusqueda , datosPaginacion) {
  try {
    console.log("entity --> buscarPedidosDb")
    
    // Realiza la consulta y cuenta el total de registros
    const [busqueda, totalRegistros] = await Promise.all([
      Pedidos.find(queryBusqueda)
        .sort({ fecha_envio: -1 }) // Ordena los resultados por fecha_envio de forma descendente
        .skip(datosPaginacion.skip)
        .limit(datosPaginacion.limit)
        .exec(),
      Pedidos.countDocuments(queryBusqueda).exec()
    ]);

    let resultado = {
      totalRegistros: totalRegistros,
      pedidos: busqueda
    };
    return resultado

  } catch (error) {
    return error;
  }
}


module.exports = {
    obtenerListaInfoLocalDb,
    buscarPedidosDb
};
