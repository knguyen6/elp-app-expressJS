//connect and query data from mysql db
var mysql = require('mysql2')

var pool  = mysql.createPool({
    connectionLimit : 10,
    host: "elp-us-west-primary.mysql.database.azure.com",
    user: "elp@elp-us-west-primary",
    password: 'LS1setup!',
    database: 'elp'
});

function DoQuery(query, params, callback){
    console.log("elp-api: ready to query ... \n")
    pool.getConnection(function(err, connection) {
    if (err) {
        console.log("Error pooling connection: ", err)
        return callback(error)
    }
    console.log("Successfully connected to the DB")
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

module.exports.DoQuery = DoQuery;
