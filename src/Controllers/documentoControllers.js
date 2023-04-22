const {
  ordenesNoConfirmadasRappi,
  actualizarDocumento,
  docsEstadoSinRes,
  buscarDatosLocal,
  generarDoc,
  crearIntegracion,
  actualizarDocCroneRappi
} = require("../Models/documentoModel");

const {enviarDocProveedor, confirmarOrdenRappi} = require("../proveedores/enviarDoc")

const response = require("../response");

// Para registrar un pedido de pedidosya y rappi

exports.registrarPedido = async (req,res) => {
  try {
    const json = req.body
    const proveedor = req.url.substring(1)
    let respuesta = ""
    // Buscar datos del restaurante 
    const infoLocal = await buscarDatosLocal(json , proveedor)

    if(!infoLocal) {
      respuesta = {
        data: [],
        tipo: '3',
        mensaje: 'Local no cuenta con integración'
      }
    } else {
    
      // Generar documento de pedido en la DB
      const documento = await generarDoc(json , infoLocal , proveedor)

      // const respuestaProveedor = await enviarDocPedidosYa(documento , infoLocal)
      const respuestaProveedor = await enviarDocProveedor(documento , infoLocal , proveedor)

      const documentoActualizado = await actualizarDocumento(respuestaProveedor , documento)
      respuesta = documentoActualizado
    }

    res.status(200).json(respuesta)
  }
  catch(error) {
    return error
  }
}

// Crone para PedidosYa

exports.cronePY = async (req,res) => {

  const docsNoActualizados = await docsEstadoSinRes()
  if(!docsNoActualizados.length) {
    console.log("Controller  --> No hay documentos sin actualizar");

    let respuesta = {
      data: [],
      tipo: '1',
      mensaje: 'No hay documentos para actualizar '
    }
    response.success(req,res,respuesta,200)
    return
  } else {
    console.log("Controller  --> Si hay documentos para actualizar",docsNoActualizados );
    let contador = {
      total: 0,
      actualizados:0
    }
    try {
    
      for (let i = 0; i < docsNoActualizados.length; i++) {
        contador.total++
        let documento = docsNoActualizados[i]
        let proveedor = 'pedidosya'
        // Buscar datos del restaurante 
        const infoLocal = await buscarDatosLocal(documento.json_integracion , proveedor)

        // enviar a proveedor

        const respuestaProveedor = await enviarDocProveedor(documento , infoLocal , proveedor)

        console.log("Controller  --> respuestaProveedor" , respuestaProveedor.remoteResponse.delivery.mensajes);


        const documentoActualizado = await actualizarDocumento(respuestaProveedor , documento)
    
        console.log("Controller  --> documentoActualizado" , documentoActualizado);

    
        if(documentoActualizado.estado == '3') {
          console.log("Controller  --> No hay respuesta positiva");
        }else {
        contador.actualizados++
        }
      }
      let respuesta = {
        data:[],
        tipo:'1',
        mensaje: `Se actualizaron ${contador.actualizados} documentos de ${contador.total}`
      }
      response.success(req,res,respuesta,200)

    }
    catch(error) {
      throw error
    }
  }
  
}

// Crone para Rappi(confirmar ordenes)

exports.croneRappi = async (req,res) => {

  try{
    const ordenesNoConfirmadas = await ordenesNoConfirmadasRappi()
    if(!ordenesNoConfirmadas.length) {
      console.log("Controller  --> No hay órdenes sin actualizar");
  
      let respuesta = {
        data: [],
        tipo: '1',
        mensaje: 'No hay órdenes para confirmar'
      }
      response.success(req,res,respuesta,200)
      return
    } else {
      console.log("Controller  --> Si hay órdenes para actualizar",ordenesNoConfirmadas );
      let contador = {
        total: 0,
        actualizados:0
      }
      try {
      
        for (let i = 0; i < ordenesNoConfirmadas.length; i++) {
          contador.total++
          let documento = ordenesNoConfirmadas[i]
          let proveedor = 'Rappi'
          // Buscar datos del restaurante 
          const infoLocal = await buscarDatosLocal(documento.json_integracion , proveedor)
          // enviar documento a services.rappi.pe
          const respuestaProveedor = await confirmarOrdenRappi(documento , infoLocal)
          

          console.log("Controller  --> respuestaProveedor" , respuestaProveedor);
  
  
          const documentoActualizado = await actualizarDocCroneRappi(respuestaProveedor , documento)
      
          console.log("Controller  --> documentoActualizado" , documentoActualizado);
  
      
          if(documentoActualizado.estadoConfirmacion == '3') {
            console.log("Controller  --> No se confirmo orden");
          }else {
          contador.actualizados++
          }
        }
        let respuesta = {
          data:[],
          tipo:'1',
          mensaje: `Se actualizaron ${contador.actualizados} documentos de ${contador.total}`
        }
        response.success(req,res,respuesta,200)
  
      }
      catch(error) {
        throw error
      }
    }

  }
  catch(error) {
    throw error
  }

}

// Confirmar ordenes Rappi individualmente

exports.confirmarOrdenUnicaRappi = async (req,res) => {
  const datosOrdenUnica = req.body
  const minutosPreparacion = datosOrdenUnica.minutosPreparacion

  let data = []
  let tipo = '3'
  let mensaje = ''
  try{
    const ordenNoActualizada = await ordenesNoConfirmadasRappi(datosOrdenUnica)

    if(!ordenNoActualizada.length) {
      console.log("Controller  --> No hay órdenes sin actualizar");
      mensaje = 'No hay orden para confirmar'
      tipo = '1'

    } else {
      console.log("Controller  --> Si hay orden para actualizar",ordenNoActualizada );

      try {
      
          let documento = ordenNoActualizada[0]
          let proveedor = 'Rappi'
          // Buscar datos del restaurante 
          const infoLocal = await buscarDatosLocal(documento.json_integracion , proveedor)
          
          // enviar documento a services.rappi.pe
          const respuestaProveedor = await confirmarOrdenRappi(documento , infoLocal , minutosPreparacion)
          
          tipo = respuestaProveedor.tipo
          mensaje = respuestaProveedor.mensaje

          console.log("Controller  --> respuestaProveedor" , respuestaProveedor);
  
  
          const documentoActualizado = await actualizarDocCroneRappi(respuestaProveedor , documento)
      
          console.log("Controller  --> documentoActualizado" , documentoActualizado);
          data = documentoActualizado

  
      }
      catch(error) {
        throw error
      }
    }



  }
  catch(error) {
    throw error
  }

  let respuesta = {
    data,
    tipo,
    mensaje
  }
  response.success(req,res,respuesta,200)
}




exports.crearIntegracion = async (req,res) => {

  try{

    // Consulta si ya existe la integracion en la Db o de lo contrario la crea
    const nuevaIntegracion = await crearIntegracion(req.body)
    response.success(req,res,nuevaIntegracion,200)
  }
  catch(error) {
    throw error
  }

}


