const axios = require("axios");
const proveedorService = require("./proveedoresLogica");

async function enviarDocProveedor(documento, infoLocal, proveedor) {
    // console.log("PedidosYaLogica --> documento",documento);
    // console.log("PedidosYaLogica --> infoLocal",infoLocal);

    proveedor == 'pedidosya' ? proveedor = 'PedidosYa' : ""
    const objJSON = documento.json_integracion || null;

    
    let url = `https://${infoLocal.suscripcion}/restaurant/clientes/rest/integracion_write/newOrder${proveedor}`
    console.log("PedidosYaLogica --> url", url);
    try {
      const respuestaProveedor = await axios
        .post(url, objJSON, {
          headers: {
            "Content-Type": "application/json",
          },
  
        })
        .then((respuesta) => {
          console.log("PedidosYa --> respuestaPositiva", respuesta.data);
          return respuesta.data;
        })
        .catch((error) => {
          console.log("PedidosYa --> respuestaError", error);
  
          let respuesta = {
            data: [],
            tipo: "3",
            mensaje: error,
          };
          return respuesta;
        });
      return respuestaProveedor;
    } catch (error) {
      console.error(`Error en la función enviarDocProveedor: ${error.message}`);
      throw error;
    }
}

async function confirmarOrdenRappi(documento, infoLocal) {

  const tokenInfo = await proveedorService.getToken(infoLocal)

  const token_type = tokenInfo.token_type
  console.log("tokenInfo" ,token_type)

  const access_token = tokenInfo.access_token
  console.log("tokenInfo" ,access_token)

  const dominio = proveedorService.getDomain(infoLocal)
  const order_id = documento.json_integracion.order_detail.order_id;

  let url = `https://${dominio}/api/v2/restaurants-integrations-public-api/orders/${order_id}/take/${infoLocal.minutos_aceptacion}`
  console.log(url)
  try {
    const response = await axios.put(url, null, {
      headers: {
        'Content-Type': 'application/json',
        'x-authorization': `${token_type} ${access_token}`,
      },
    });

    if (response.status !== 200) {
      const responseJSON = response.data;
      if (responseJSON && responseJSON.message && responseJSON.message.includes("{TAKEN} to {TAKEN}")) {
        mensajes.push("El pedido ya ha sido aceptado en Rappi");
      } else if (responseJSON && responseJSON.message) {
        mensajes.push(responseJSON.message);
      } else {
        const mensaje = `No se pudo aceptar la orden en Rappi. Respuesta codigo ${response.status}`;
        if (responseJSON && responseJSON.message) {
          mensaje += `${responseJSON.message}`;
        }
        mensajes.push(mensaje);
      }
    } else {
      mensajes.push(`Tú Rappi pedido #${orderId} fue confirmado`);
    }
  } catch (e) {
    console.log("Error al confirmar orden en Rappi");
    let respuesta = {
      data: [],
      tipo: "3",
      mensaje: e,
    }
    return respuesta
    // console.error(e);
    // You can send the error to a reporting service if needed
    // sendErrorEntity(e);
  }
  // try {
  //   const respuestaProveedor = await axios
  //     .put(url, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         // pasar token
  //       },

  //     })
  //     .then((respuesta) => {
  //       console.log("croneRappiController --> respuestaPositiva");
  //       return respuesta.data;
  //     })
  //     .catch((error) => {
  //       console.log("croneRappiController --> respuestaError");

  //       let respuesta = {
  //         data: [],
  //         tipo: "3",
  //         mensaje: error,
  //       };
  //       return respuesta;
  //     });
  //   console.log(respuestaProveedor)
  //   return respuestaProveedor;
  // } catch (error) {
  //   console.error(`Error en la función croneRappi: ${error.message}`);
  //   throw error;
  // }
}
  
  module.exports = {
    enviarDocProveedor,
    confirmarOrdenRappi
  };
  