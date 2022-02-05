if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/indexRoute');
const compression = require('compression')
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const passport = require('passport');
const {jwtStrategy, googleStrategy} = require('./config/authStrategies');
const cors = require('cors');
const formidable = require('formidable')

//Initialize app
const app = express();
app.use(cookieParser());

//Database connection
require('./config/database');

app.use(cors({origin: process.env.ORIGIN_URL, credentials: true}));

app.use(compression());
app.use(morgan("dev"));
app.use((req,res,next) => {
    const form =  formidable({multiples: true})
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).send('Wrong form data')
        } else {
        req.body = {...fields, ...files}
        next()
        }
    })
});
app.use(passport.initialize());
passport.use(jwtStrategy);

//Setting Routes
app.use('/', router)


module.exports = app;
