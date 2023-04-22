const dotenv = require ("dotenv");
dotenv.config();
const app = require('./app');
const https = require('https');
const options = {
  hostname: 'integraciones.restaurant.pe',
  path: '/pedido/croneRappi',
  method: 'GET'
};


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});

setInterval(() => {
    const req = https.request(options, (res) => {
      console.log(`statusCode: ${res.statusCode}`);
    
      res.on('data', (d) => {
        process.stdout.write(d);
      });
    });
  
    req.on('error', (error) => {
      console.error(error);
    });
  
    req.end();
  }, 210000); // 3.5 minutos.
  
  
  
  
  
  
