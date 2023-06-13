const duckdb = require('duckdb');

const db = new duckdb.Database('db/duckmart.db');

const con = db.connect((err)=>{console.log(err);});

const allPromise = (query) => {
    return new Promise((resolve,reject) => {
        con.all(query, (err,res)=>{
            if(err){
                return reject(err);
            }
            resolve(res);
        })
    })
}

async function execQuery(query){
    const resp = await allPromise(query);
    return resp;
}

module.exports = {execQuery};