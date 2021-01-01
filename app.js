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
const categoryRoutes = require('./routes/r-category');
const homeRoutes = require('./routes/r-home');
const orderRoutes = require('./routes/r-order');
app.use(express.json());

//Routes middleware
app.use('/api',userRoutes);
app.use('/api',storeRoutes);
app.use('/api',productsRoutes);
app.use('/api',categoryRoutes);
app.use('/api',homeRoutes);
app.use('/api',orderRoutes);

//Connection 
mongoose
    .connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        app.listen(process.env.PORT || 5000)
    })
    .catch(err => {
        console.log(err);
    });