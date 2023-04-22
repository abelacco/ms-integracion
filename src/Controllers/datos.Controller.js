  
  const {listaInfoLocalModel, buscarPedidosModel } = require('../Models/datosModel')
  
  exports.obtenerListaInfoLocal = async (req,res) => {
    let datos = "" 
    let tipo = '3'
    let mensaje = ''

    try {



        const listaInfoLocal = await listaInfoLocalModel()
        console.log("Controller --> listaInfoLocal", listaInfoLocal);
        datos = listaInfoLocal,
        tipo =  "1"
        mensaje = "Listado de infoLocales"

    }

    catch(error) {
        datos = [],
        tipo =  "3"
        mensaje = "Error al obtener los StoreIds"
    }
    let respuesta = {
        datos: datos,
        tipo: tipo,
        mensaje: mensaje
    }

    res.status(200).json(respuesta)

  }

  exports.obtenerPedidos = async (req,res) => {
    
    let resultado = {}
    let datos = []
    let tipo  = '3'
    let mensaje = ''

    try {

      const pedidosEncontrados = await buscarPedidosModel(req.body)
      console.log(pedidosEncontrados)
      datos = pedidosEncontrados,
      tipo =  "1"
      mensaje = "Listado de pedidos"

    } catch (error) {
      datos = [],
      tipo =  "3"
      mensaje = "Error al obtener los pedidos"
    }

     resultado = {
      datos: datos,
      tipo: tipo,
      mensaje: mensaje
    }

    res.status(200).json(resultado)
  }

  

  
  