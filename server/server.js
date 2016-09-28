/**
 * Created by TT on 2016-09-27.
 */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
const logger = require('morgan');
app.use(logger('dev'));
app.use(express.static('.'));
app.use(express.static('./public'));

const reserveRouter = require('./router/reserveRouter');
const storeRouter = require('./router/storeRouter');
app.use(reserveRouter);
app.use(storeRouter);

app.use((err, req, res, next)=> {
    res.send({message: err.message});
});

app.listen(3000, ()=> {
    console.log('Server 3000 Start');
});