const express = require('express');
const routes = require('./routes');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(routes);

const PORT = process.env.PORT;


app.listen(PORT , (err) => {
  if(err){
    console.log(err);
  }else{
    console.log(`app is listening to port ` + PORT);
  }
});

