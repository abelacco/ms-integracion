const mongoose = require('mongoose');

// Configuración de la conexión a MongoDB
const dbUrl = `${process.env.DB_PROTOCOL}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_OPTIONS}`;

mongoose.set('strictQuery', true);


mongoose.connect(dbUrl, { useNewUrlParser: true }).then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database' + err)}
);
