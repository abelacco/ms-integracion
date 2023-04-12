exports.success = function (req, res, data, status) {
  res.status(status || 200).send({
    data: data.data,
    tipo: data.tipo,
    mensaje: data.mensaje,
  });
};

exports.error = function (req, res, data, status, details) {
  res.status(status || 500).send({
    data: data.data,
    tipo: data.tipo,
    mensaje: data.mensaje,
  });
};
