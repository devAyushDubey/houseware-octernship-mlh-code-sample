const duckdb = require('duckdb');

let db_path = '../db/duckmart.db';
let df_path = '../data/csv/MOCK_DATA_USERS.csv';
let table = 'users';

if (process.argv.length === 5) {
    table = process.argv[2]
    db_path = process.argv[3];
    df_path = process.argv[4];
}
else if (process.argv.length > 2) {
    throw new Error("Invalid Arguments \nSpecified format is: node DataFeeder.js [table_name] [path_to_database_file] [path_to_data_file]")
}

const db = new duckdb.Database(db_path);

const con = db.connect((err) => { console.log(err); });


if(table === 'users'){
    con.run(`CREATE TABLE ${table}(user_id VARCHAR, name VARCHAR, age INTEGER, gender VARCHAR, location VARCHAR, signup_date DATE, subscription_plan VARCHAR, device_type VARCHAR, PRIMARY KEY (user_id)); COPY ${table} FROM '${df_path}' (AUTO_DETECT TRUE);`,(err)=>{console.log(err);});
}
else if(table === 'events'){
    con.run(`CREATE TABLE ${table}(user_id VARCHAR, event_name VARCHAR, timestamp DATE); COPY ${table} FROM '${df_path}' (AUTO_DETECT TRUE);`,(err)=>{console.log(err);});
}
else{
    throw new Error("Invalid Table Name \nAllowed tables are: users, events")
}

// con.all('SELECT * FROM events;',(err,res)=>{
//     if(err){
//         console.log(err);
//     }
//     console.log(res);
// })
