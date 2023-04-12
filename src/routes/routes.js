const documentoRoutes = require('./documentoRoutes');
const integracionRoutes = require('./integracionRoutes');


module.exports = (app) => {
    app.use('/pedido', documentoRoutes);
    app.use('/integracion', integracionRoutes);

}
