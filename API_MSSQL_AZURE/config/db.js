
module.exports = {
	connect: {
    	userName: 'someazurejune88',
    	password: '<passwordhere>!',
    	server: 'junesazurestuff.database.windows.net',
    	// If you are on Microsoft Azure, you need this:  
    	options: {
        	encrypt: true, 
        	database: 'mySampleDatabase',
        	rowCollectionOnRequestCompletion: true
    	}
    },
    pool: { // see tedious-connection-pool documentation
	    min: 2,
	    max: 4,
	    log: true
	}
};
