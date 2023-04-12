const {
  consultaRappi,
  actualizarDocumento,
  docsEstadoSinRes,
  buscarDatosLocal,
  generarDoc,
  crearIntegracion,
  docsEstadoSinResRappi,
  actualizarDocCroneRappi
} = require("../Models/documentoModel");

const {enviarDocProveedor, croneRappiController, confirmarOrdenRappi} = require("../proveedores/enviarDoc")
// const {escogerProveedor} = require("../proveedores/proveedoresLogica")

const response = require("../response");

exports.registrarPedido = async (req,res) => {
  try {
    const json = req.body
    const proveedor = req.url.substring(1)

    // Buscar datos del restaurante 
    const infoLocal = await buscarDatosLocal(json , proveedor)

    // Generar documento de pedido en la DB
    const documento = await generarDoc(json , infoLocal , proveedor)
    // enviar a proveedor(enviar al proveedor que corresponda)

    // const respuestaProveedor = await enviarDocPedidosYa(documento , infoLocal)
    const respuestaProveedor = await enviarDocProveedor(documento , infoLocal , proveedor)
    console.log(documento)
    const documentoActualizado = await actualizarDocumento(respuestaProveedor , documento)

    res.status(200).json(documentoActualizado)
  }
  catch(error) {
    return error
  }
}


exports.croneRappi = async (req,res) => {

  try{
    const docsNoActualizados = await docsEstadoSinResRappi()
    if(!docsNoActualizados.length) {
      console.log("Controller  --> No hay órdenes sin actualizar");
  
      let respuesta = {
        data: [],
        tipo: '1',
        mensaje: 'No hay órdenes para confirmar'
      }
      response.success(req,res,respuesta,200)
      return
    } else {
      console.log("Controller  --> Si hay órdenes para actualizar",docsNoActualizados );
      let contador = {
        total: 0,
        actualizados:0
      }
      try {
      
        for (let i = 0; i < docsNoActualizados.length; i++) {
          contador.total++
          let documento = docsNoActualizados[i]
          let proveedor = 'Rappi'
          // Buscar datos del restaurante 
          const infoLocal = await buscarDatosLocal(documento.json_integracion , proveedor)

          // enviar documento a services.rappi.pe
          const respuestaProveedor = await confirmarOrdenRappi(documento , infoLocal)
          

          console.log("Controller  --> respuestaProveedor" , respuestaProveedor);
  
  
          const documentoActualizado = await actualizarDocCroneRappi(respuestaProveedor , documento)
      
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
  catch(error) {
    throw error
  }

}


exports.crone = async (req,res) => {

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
        const infoLocal = await buscarDatosLocal(documento.json_integracion)

        // enviar a proveedor

        const respuestaProveedor = await enviarDocProveedor(documento , infoLocal , proveedor)

        console.log("Controller  --> respuestaProveedor" , respuestaProveedor);


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


