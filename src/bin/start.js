 const mongoose = require('mongoose');
 const http = require('http');
 const config = require('../config');
 
 const { logger } = config;
 
 const app = require('../app')(config);

 const port = "3000";
 app.set('port', port);
 
 const server = http.createServer(app);
 
 //connect to mongodb and start the webserver 
 mongoose
   .connect(config.database.dsn, {
     
   })
   .then(() => {
     config.database.status.connected = true;
     logger.info('Connected to MongoDB');
     server.listen(port);
   })
   .catch((error) => {
     config.database.status.error = error;
     logger.fatal(error);
     server.listen(port);
   });

 
 //Event listener for HTTP server "listening" event.
 server.on('listening', () => {
   const addr = server.address();
   const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
   logger.info(`Listening on ${bind}`);
 });
 