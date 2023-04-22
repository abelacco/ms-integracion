const Schema = require("../Schemas/documentoSchema");
const InfoLocal = require("../Schemas/infoLocales");


// Crear documento de rappi o pedidosYa
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


// Actualiza el estado  de la recepcion de los pedidos(rappi o pedidosYa)

async function actualizarDocDb(respuestaProveeedor , documento) {
  try {
    console.log("Entity actualizarDocDb --> Inicio actualizar Documento",respuestaProveeedor);
    let estadoRespuesta = documento.estado
    if(respuestaProveeedor.remoteResponse && respuestaProveeedor.remoteResponse.delivery.tipo == '1') {
      estadoRespuesta = '1'
    } else if(respuestaProveeedor.tipo == '1') {
      estadoRespuesta = '1'
    }
    const documentoEncontradoyActualizado = await Schema.findByIdAndUpdate(
      { _id: documento._id },
      {
        estado: estadoRespuesta,
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

// Para consultar todos los documentos con estado 3 de PedidosYa

async function consultarDocsSinResDb() {
  try{
    const docsSinRespuesta = await Schema.find({
      estado: '3',
      intentos: { $lte: 3 },
      integracion: 'pedidosya'
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


// Para consultar todas las ordenes de Rappi que no han sido confirmadas

async function ordenesNoConfirmadasRappiDb(datosOrdenUnica) {


  const fechaLimite = new Date(Date.now() - 1.5 * 60 * 1000); 
  try{
    let ordenSinConfirmar = ""
    if(!datosOrdenUnica) {
       ordenSinConfirmar = await Schema.find({
        estadoConfirmacion: '3',
        intentos: { $lt: 3 },
        integracion: 'Rappi',
        fecha_envio: { $lt: fechaLimite }
      }).limit(100).exec()
    } else {
       ordenSinConfirmar = await Schema.find({
        estadoConfirmacion: '3',
        intentos: { $lt: 3 },
        storeId: datosOrdenUnica.storeId,
        suscripcion: datosOrdenUnica.suscripcion,
        "json_integracion.orderdetail.order_id": datosOrdenUnica.orderId,
      })
    }


    return ordenSinConfirmar
  }
  catch(error) {
    return error
  }
}


// Actualizar el estado de la orden de Rappi  (Crone)

async function actualizarEstadOrdenRappi(respuestaProveeedor , documento) {
  try {
    console.log("Entity actualizarEstadOrdenRappi --> Inicio actualizar Documento",documento);
    let estadoConfirmacion = documento.estadoConfirmacion
    if(respuestaProveeedor.tipo && respuestaProveeedor.tipo == '1') {
        estadoConfirmacion = '1'
    }
    const documentoEncontradoyActualizado = await Schema.findByIdAndUpdate(
      { _id: documento._id },
      {
        estadoConfirmacion: estadoConfirmacion,
        intentos: ++documento.intentos,
        $push: {
          ordenRptaRappi: { mensaje: respuestaProveeedor.mensaje[0] , fecha_creacion: new Date(), },
        },
      },
      { new: true }
    );
    return documentoEncontradoyActualizado;
  } catch (error) {
    console.error(
      `Error en la función actualizarOrdenRappi: ${error.message}`
    );
    return error;
  }
}

// Encontrar infoLocal por StoreId

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

// Crear o actualizar integracion(infoLocal)

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
  ordenesNoConfirmadasRappiDb,
  actualizarEstadOrdenRappi
};
