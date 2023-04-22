const documentoRoutes = require('./documentoRoutes');
const integracionRoutes = require('./integracionRoutes');
const datosRoutes = require('./datosRoutes');


module.exports = (app) => {
    app.use('/pedido', documentoRoutes);
    app.use('/integracion', integracionRoutes);
    app.use('/datos', datosRoutes);

}
