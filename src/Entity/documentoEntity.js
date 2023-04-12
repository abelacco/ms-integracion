const Schema = require("../Schemas/documentoSchema");
const InfoLocal = require("../Schemas/infoLocales");

// async function agregarDocDb(documento) {
//   try {
//     console.log("Entity --> empieza logica de comprobar si existe documento");
//     const docExiste = await Schema.findOne(
//       { numero_pedido: documento.test},
//     );
//     console.log("Entity -->docExiste ", docExiste);

//     if (docExiste) {
//       console.log("Entity --> Doc existe");
//       let docExiste = {
//         data: [],
//         tipo: "1",
//         mensaje: "Documento ya existe",
//       };
//       return docExiste;
//     } else {
//       console.log("Entity --> Nuevo doc creado");

//       const nuevoDocumento = new Schema(documento);
//       nuevoDocumento.save();
//       let docNuevo = {
//         data: nuevoDocumento,
//         tipo: "1",
//         mensaje: "Documento fue almacenado con éxito y enviado al proveedor",
//       };
//       return docNuevo;
//     }
//   } catch (error) {
//     return error;
//   }
// }

async function agregarDocDb(obj) {
  try {

    const documento = new Schema(obj)
    console.log("entity --> documento" , obj)
    documento.save()
    return documento

  } catch (error) {
    return error;
  }
}



async function actualizarDocDb(respuestaProveeedor , documento) {
  try {
    console.log("Entity actualizarDocDb --> Inicio actualizar Documento",documento);
    let estado = documento.estado
    if(respuestaProveeedor.remoteResponse && respuestaProveeedor.remoteResponse.delivery.tipo == '1') {
        estado = '1'
    } 
    const documentoEncontradoyActualizado = await Schema.findByIdAndUpdate(
      { _id: documento._id },
      {
        estado: estado,
        json_respuesta : respuestaProveeedor,
        intentos: ++documento.intentos
      },
      { new: true }
    );
    return documentoEncontradoyActualizado;
  } catch (error) {
    console.error(
      `Error en la función actualizarDocDb: ${error.message}`
    );
    return error;
  }
}

async function consultarDocsSinResDb() {
  try{
    const docsSinRespuesta = await Schema.find({
      estado: '3',
      intentos: { $lte: 3 },
      integracion: 'PY' || 'pedidosya'
    }).limit(100).exec()
    console.log(
      "Entity  --> docsSinRespuesta",
      docsSinRespuesta
    );
    return docsSinRespuesta
  }
  catch(error) {
    return error
  }
}

async function consultarDocsSinResDbRappi() {
  const fechaLimite = new Date(Date.now() - 1.5 * 60 * 1000); 
  console.log("Entity  --> fechaLimite", fechaLimite)
  try{
    const docsSinRespuesta = await Schema.find({
      estado: '3',
      intentos: { $lte: 3 },
      integracion: 'Rappi',
      fecha_envio: { $lt: fechaLimite }
    }).limit(100).exec()

    return docsSinRespuesta
  }
  catch(error) {
    return error
  }
}

async function actualizarEstadOrdenRappi(respuestaProveeedor , documento) {
  try {
    console.log("Entity actualizarDocDb --> Inicio actualizar Documento",documento);
    let estadoConfirmacion = documento.estadoConfirmacion
    if(respuestaProveeedor.tipo && respuestaProveeedor.tipo == '1') {
        estadoConfirmacion = '1'
    }
    const documentoEncontradoyActualizado = await Schema.findByIdAndUpdate(
      { _id: documento._id },
      {
        estadoConfirmacion: estadoConfirmacion,
        intentos: ++documento.intentos
      },
      { new: true }
    );
    return documentoEncontradoyActualizado;
  } catch (error) {
    console.error(
      `Error en la función actualizarEstadOrdenRappi: ${error.message}`
    );
    return error;
  }
}

async function consultarDocInfoLocalDb(storeIdBuscado){
  console.log("Entity --> empieza logica buscarinfolocal" , storeIdBuscado);

  try{
    const infoLocal = await InfoLocal.findOne(
      { storeId: storeIdBuscado},
    );
    console.log("Entity --> infoLocal", infoLocal);

    return infoLocal
  }
  catch(error){
    return error
  }
}

async function crearIntegracionDb(datos) {
  console.log("Entity --> crearIntegracionDb");
  
  const { storeId, integracion, localId, suscripcion , minutos_aceptacion , clave_publica ,clave_privada , audience , marca_id  } = datos;
  
  // Buscar el objeto con las propiedades dadas
  const objetoExistente = await InfoLocal.findOne({ localId, suscripcion , marca_id , storeId});

  if (objetoExistente) {
    console.log('El objeto ya existe en la base de datos.');
    
    // Comprobar si las propiedades han cambiado
    if (objetoExistente.minutos_aceptacion !== minutos_aceptacion || objetoExistente.clave_publica !== clave_publica || objetoExistente.clave_privada !== clave_privada || objetoExistente.audience !== audience) {
      console.log('Actualizando objeto...');
      objetoExistente.minutos_aceptacion = minutos_aceptacion;
      objetoExistente.clave_publica = clave_publica;
      objetoExistente.clave_privada = clave_privada;
      objetoExistente.audience = audience;
      await objetoExistente.save();
      console.log('Objeto actualizado en la base de datos.');

      let respuesta = {
        data: objetoExistente,
        tipo: '1',
        mensaje: 'Integración actualizada'
      };
      return respuesta;
    } else {
      let respuesta = {
        data: objetoExistente,
        tipo: '1',
        mensaje: 'Integración ya existe'
      };
      return respuesta;
    }
  } else {
    console.log('Creando nuevo objeto...');
    const nuevoObjeto = new InfoLocal(datos);
    await nuevoObjeto.save();
    console.log('Nuevo objeto creado en la base de datos.');
    let respuesta = {
      data: nuevoObjeto,
      tipo: '1',
      mensaje: 'Integración realizada'
    };
    return respuesta;
  
  }}




module.exports = {
  agregarDocDb,
  actualizarDocDb,
  consultarDocsSinResDb,
  consultarDocInfoLocalDb,
  crearIntegracionDb,
  consultarDocsSinResDbRappi,
  actualizarEstadOrdenRappi
};
