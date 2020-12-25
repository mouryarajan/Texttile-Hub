const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Config Environment File
dotenv.config();

const app = express();

//importing routes
const userRoutes = require('./routes/r-user');
const storeRoutes = require('./routes/r-store');
const productsRoutes = require('./routes/r-products');
const port = process.env.PORT || 3000;
app.use(express.json());

//Routes middleware
app.use('/api',userRoutes);
app.use('/api',storeRoutes);
app.use('/api',productsRoutes);


//Connection 
mongoose
    .connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        app.listen(process.env.PORT || 5000)
    })
    .catch(err => {
        console.log(err);
    });