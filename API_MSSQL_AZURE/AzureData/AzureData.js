let config = require('../config/db.js');
let tediousPromise = require('tedious-promises');
let ConnectionPool = require('tedious-connection-pool');
let pool = new ConnectionPool(config.pool, config.connect);
tediousPromise.setConnectionPool(pool);

module.exports = {
	AzureExample: callback => {
		tediousPromise.sql("SELECT c.CustomerID, c.CompanyName,COUNT(soh.SalesOrderID) AS OrderCount FROM SalesLT.Customer AS c LEFT OUTER JOIN SalesLT.SalesOrderHeader AS soh ON c.CustomerID = soh.CustomerID GROUP BY c.CustomerID, c.CompanyName ORDER BY OrderCount DESC;")
		.execute()
		.then(results => {
			callback(null, results);
		})
		.fail(err => {
			callback(err, []); // make sure that an array is being expected...
		});
	}
};