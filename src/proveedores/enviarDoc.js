const axios = require("axios");
const proveedorService = require("./proveedoresLogica");

async function enviarDocProveedor(documento, infoLocal, proveedor) {
    // console.log("PedidosYaLogica --> documento",documento);
    // console.log("PedidosYaLogica --> infoLocal",infoLocal);

    proveedor == 'pedidosya' ? proveedor = 'PedidosYa' : ""
    const objJSON = documento.json_integracion || null;
  console.log(objJSON)
    
    let url = `https://${infoLocal.suscripcion}/restaurant/clientes/rest/integracion_write/newOrder${proveedor}`
    console.log("enviarDocProveedor --> url", url);
    try {
      const respuestaProveedor = await axios
        .post(url, objJSON, {
          headers: {
            "Content-Type": "application/json",
          },
  
        })
        .then((respuesta) => {
          console.log("enviarDocProveedor --> respuestaPositiva", respuesta.data);
          return respuesta.data;
        })
        .catch((error) => {
  
          // let respuesta = {
          //   data: [],
          //   tipo: error.response.data.tipo,
          //   mensaje: error.response.data.mensajes,
          // };

          return error.response.data;
        });
      return respuestaProveedor;
    } catch (error) {
      console.error(`Error en la función enviarDocProveedor: ${error.message}`);
      throw error;
    }
}

async function confirmarOrdenRappi(documento, infoLocal , minutosPreparacion) {

  let tipo = '3'
  let data = []
  let mensajes = []
  let tiempoPreparacion = infoLocal.minutos_preparacion

  // Cuando se confirma orden única
  if(minutosPreparacion){
    tiempoPreparacion = minutosPreparacion
  }   

  const tokenInfo = await proveedorService.getToken(infoLocal)

  const token_type = tokenInfo.token_type

  const access_token = tokenInfo.access_token
  console.log(access_token)
  const dominio = proveedorService.getDomain(infoLocal)
  const order_id = documento.json_integracion.order_detail.order_id;




  let url = `https://${dominio}/api/v2/restaurants-integrations-public-api/orders/${order_id}/take/${tiempoPreparacion}`
  console.log(url)
  try {
    const response = await axios.put(url, null, {
      headers: {
        'Content-Type': 'application/json',
        'x-authorization': `${token_type} ${access_token}`,
      },
    });
    console.log("confirmarOrdenRappi --> response", response);
    if (response.status !== 200) {

      const responseJSON = response.data;
      if (responseJSON && responseJSON.message && responseJSON.message.includes("{TAKEN} to {TAKEN}")) {
        tipo = '1'
        mensajes.push("El pedido ya ha sido aceptado en Rappi");
      } else if (responseJSON && responseJSON.message) {
        tipo = '3'
        mensajes.push(responseJSON.message);
      } else {
        tipo = '3'
        const mensaje = `No se pudo aceptar la orden en Rappi. Respuesta codigo ${response.status}`;
        if (responseJSON && responseJSON.message) {
          mensaje += `${responseJSON.message}`;
        }
        mensajes.push(mensaje);
      }
    } else {
      tipo = '1'
      mensajes.push(`Tú Rappi pedido #${order_id} fue confirmado`);
    }


  } catch (error) {
    console.log("Error al confirmar orden en Rappi");
    tipo = '3'
    mensajes.push("Error al confirmar orden en Rappi");

  }

  let respuesta = {
    data: data,
    tipo: tipo,
    mensaje: mensajes,
  }


  return respuesta

}
  
  module.exports = {
    enviarDocProveedor,
    confirmarOrdenRappi
  };
  