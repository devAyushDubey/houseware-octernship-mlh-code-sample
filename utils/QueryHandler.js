
const isIterable = {"age":true,"signup_date":true,"timestamp":true};

const user_keys = ["name","age","gender","location","signup_date","subscription_plan","device_type"];
const event_keys = ["event_name","timestamp"];

let joined = false;

function CreateQuery(table,body){

    const filters = Object.keys(body);
    let query = "";

    if(body.columns){

        if(typeof body.columns === 'string'){
            query = `SELECT ${body.columns} FROM ${table}`;
        }
        else{
            query = `SELECT ${body.columns.join()} FROM ${table}`;
        }
        

        if(table === 'users'){
            for(let column of body.columns){
                if(event_keys.includes(column)){
                    query += ' INNER JOIN events ON users.user_id=events.user_id';
                    joined = true;
                    break;
                }
            }
        }
        else if(table === 'events'){
            for(let column of body.columns){
                if(user_keys.includes(column)){
                    query += ' INNER JOIN users ON events.user_id=users.user_id';
                    joined=true;
                    break;
                }
            }
        }
        
        filters.splice(filters.indexOf('columns'),1);
    }
    else{
        query = `SELECT * FROM ${table}`;
    }

    if(table === 'users'){
        for(let filter of filters){
            if(event_keys.includes(filter)){
                query += ' INNER JOIN events ON users.user_id=events.user_id';
                joined=true;
                break;
            }
        }
    }
    else if(table === 'events'){
        for(let filter of filters){
            if(user_keys.includes(filter)){
                query += ' INNER JOIN users ON events.user_id=users.user_id';
                joined=true;
                break;
            }
        }
    }

    if(joined && body.columns){
        if(body.columns.includes("user_id")){
            query = query.replace('user_id',`${table}.user_id`);
        }
    }

    if(filters.length){
        query += " WHERE ";
    }

    for(let i=0;i<filters.length;i++){
        let filter = filters[i];
        if(typeof body[filter] === 'string'){
            if(joined && filter === 'user_id'){
                query += `${table}.${filter} = '${body[filter]}'`;
            }else{
                query += `${filter} = '${body[filter]}'`;
            } 
        }
        else if(typeof body[filter] === 'number'){
            query += `${filter} = ${body[filter]}`;
        }
        else if(body[filter].range){
            if(isIterable[filter]){
                if(filter === "signup_date" || filter === "timestamp"){
                    query += `${filter} >= strptime('${body[filter].range[0]}', '%d-%m-%Y') AND ${filter} <= strptime('${body[filter].range[1]}', '%d-%m-%Y')`;
                }
                else{
                    query += `${filter} >= ${body[filter].range[0]} AND ${filter} <= ${body[filter].range[1]}`;
                }
                
            }
            else{
                throw new Error(`Range is not applicable in ${filter}`);
            }
            
        }
        else{
            query += " (";
            for(let j =0;j<body[filter].length;j++){

                if(typeof body[filter][j] === 'string'){
                    if(joined && filter === 'user_id'){
                        query += `${table}.${filter} = '${body[filter][j]}'`;
                    }else{
                        query += `${filter} = '${body[filter][j]}'`;
                    } 
                }
                else{
                    query += `${filter} = ${body[filter][j]}`;
                }

                if(j !== body[filter].length - 1){
                    query += " OR ";
                }
            }
            query += ") "
        }

        if(i !== filters.length - 1){
            query += " AND ";
        }
    }

    query += ';'
    console.log(query);
    return query;
}

module.exports = {CreateQuery};