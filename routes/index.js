const express = require('express');
const queryHandler = require('../utils/QueryHandler');
const dbHandler = require('../utils/DBHandler');


const router = express.Router();


router.post('/users',(req,res,next)=>{validate(req,res,next);},async (req,res)=>{

    let query = "";
    let response = "";

    try{
        query = queryHandler.CreateQuery('users',req.body);
        response = await dbHandler.execQuery(query);
    }
    catch(err){
        console.log(err);
        res.status(500);
        res.send({"error":"An internal server error occured while handling the query."});
        return;
    }
    
    
    console.log(response);
    res.send(response);
})

router.post("/events",(req,res,next)=>{validate(req,res,next);},async (req,res)=>{

    let query = "";
    let response = "";
    try{
        query = queryHandler.CreateQuery('events',req.body);
        response = await dbHandler.execQuery(query);
    }
    catch(err){
        console.log(err);
        res.status(500);
        res.send({"error":"An internal server error occured while handling the query."});
        return;
    }
    
    
    console.log(response);
    res.send(response);
})

router.post("/queries",(req,res,next)=>{validate(req,res,next);},async (req,res)=>{

    let query = "";
    try{
        query = queryHandler.CreateQuery('users',req.body);
    }
    catch(err){
        console.log(err);
        res.status(500);
        res.send({"error":"An internal server error occured while handling the query."});
        return;
    }
    
    res.send(query);
})


router.get("*",(req,res)=>{
    res.sendFile("/root/houseware---data-engineering-octernship-devAyushDubey/routes/README.html");
})

function validate(req,res,next){

    const body = req.body;

    const filters = Object.keys(body);

    const isIterable = {"age":true,"signup_date":true,"timestamp":true};

    const regex = {
        "user_id":/[^a-z0-9-]/g,
        "name":/[^a-zA-Z\s]/g,
        "age":/[^0-9]/g,
        "gender":/[^a-zA-Z-]/g,
        "location":/[^a-zA-Z\s]/g,
        "signup_date":/[^0-9-]/g,
        "subscription_plan":/[^a-zA-Z]/g,
        "device_type":/[^a-zA-Z]/g,
        "event_name":/[^A-Z_]/g,
        "timestamp":/[^0-9-]/g
    };

    const types = {
        "user_id":"string",
        "name":"string",
        "age":"number",
        "gender":"string",
        "location":"string",
        "signup_date":"string",
        "subscription_plan":"string",
        "device_type":"string",
        "event_name":"string",
        "timestamp":"string"
    };

    if(body.columns){
        if(typeof body.columns === 'string'){
            if(!types[body.columns]){
                res.status(400);
                res.send({"error":"Inavlid Syntax: Columns"});
                return;
            }
        }
        else if(body.columns.range){
            res.status(400);
            res.send({"error":"Inavlid Syntax: Columns"});
            return;
        }
        else{
            for(let column of body.columns){
                if(!types[column]){
                    res.status(400);
                    res.send({"error":"Inavlid Syntax: Columns"});
                    return;
                }
            }
        }
        
        filters.splice(filters.indexOf('columns'),1);
    }

    for(let filter of filters){

        if(typeof body[filter] === 'string'){
            if(regex[filter].test(body[filter])){
                res.status(400);
                res.send({"error":`Inavlid Syntax: ${filter}`});
                return;
            }
        }
        else if(typeof body[filter] === 'number'){
            continue;
        }
        else if(body[filter].range){
            if(isIterable[filter]){

                if(typeof body[filter].range != "object" || body[filter].range.constructor == Object || body[filter].range.length != 2){
                    res.status(400);
                    res.send({"error":`Inavlid Syntax: ${filter}`});
                    return;
                }

                if(types[filter] === 'string'){
                    if(regex[filter].test(body[filter].range[0]) || regex[filter].test(body[filter].range[1])){
                        res.status(400);
                        res.send({"error":`Inavlid Syntax: ${filter}`});
                        return;
                    }
                }
            }
            else{
                res.status(400);
                res.send({"error":`Inavlid Syntax: Range is not applicable in ${filter}`});
                return;
            }
            
        }
        else{
            for(let j =0;j<body[filter].length;j++){
                if(typeof body[filter][j] === 'string'){
                    if(regex[filter].test(body[filter][j])){
                        res.status(400);
                        res.send({"error":`Inavlid Syntax: ${filter}`});
                        return;
                    }
                }
            }
        }
    }

    next();
}

module.exports = router;