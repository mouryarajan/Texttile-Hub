const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");

const app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());
// parse requests of content-type - application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true,limit: '50mb' }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin,X-Requested-With,Content-Type,Accept"
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });



//Config Environment File
dotenv.config();
const admin = require("firebase-admin");

const serviceAccount = require("./config/firebaseConfig.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


//importing routes
const userRoutes = require('./routes/r-user');
const storeRoutes = require('./routes/r-store');
const productsRoutes = require('./routes/r-products');
const categoryRoutes = require('./routes/r-category');
const homeRoutes = require('./routes/r-home');
const orderRoutes = require('./routes/r-order');
const notificationRoutes = require('./routes/r-notification')
app.use(express.json());

//Routes middleware
app.use('/api', userRoutes);
app.use('/api', storeRoutes);
app.use('/api', productsRoutes);
app.use('/api', categoryRoutes);
app.use('/api', homeRoutes);
app.use('/api', orderRoutes);
app.use('/api', notificationRoutes);

app.get('/', (req, res) => res.send("welcome to M-textile Backend App!"));
//Connection 
mongoose
    .connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        app.listen(process.env.PORT || 3100, () => console.log(`Shopping app is listening`))
    })
    .catch(err => {
        console.log(err);
    });