const mysql = require('mysql');

// Create database connection
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'hospital_data',
    multipleStatements: true
});

// Connect to database
db.connect((error) => {
    if(error){
        throw error;
    }

    console.log('Successfully connected to MySQL.');
});

module.exports = db;