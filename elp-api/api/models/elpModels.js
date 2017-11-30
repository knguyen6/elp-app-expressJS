//connect and query data from mysql db
var mysql = require('mysql2')
var pool  = mysql.createPool({
    connectionLimit : 10,
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'elp-app'
});

function DoQuery(query, params, callback){
    console.log("ready to query ... \n")
    pool.getConnection(function(err, connection) {
  // Use the connection
      connection.query(query, params, function (error, results, fields) {
        // And done with the connection.
        connection.release();

        // Handle error after the release.
        if (error)
            callback(error);
        else
            callback(null, results)
        });
    });
}

// function DoQuery(query, params, callback){
//     console.log("ready to query ... \n")
//     connection.connect(function(err) {
//       if (err) {
//         console.error('error connecting to mysql server: ' + err.stack);
//         return;
//       }
//       console.log('Successfully connected to mysql server, as id ' + connection.threadId);
//     });
//
//     connection.query({
//         sql: query,
//         timeout: 10000 // 10s
//       },
//       params, //should be an array
//       function (error, rows, fields) {
//           if (error)
//             callback(error);
//           else {
//             console.log("\nquery result: ", rows)
//             callback(null, rows)
//         }
//       });
//
//     connection.end()
// }

module.exports.DoQuery = DoQuery;
