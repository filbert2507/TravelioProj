let mysql = require('mysql');
 
let connection = mysql.createConnection({
   host:        'localhost',
   user:        'root',
   password:    '',
   database:    'db_travelio'
 });

connection.connect(function(error){
   if(!!error){
     console.log(error);
   }else{
     console.log('Connection Successfull!');
   }
 })

module.exports = connection; 