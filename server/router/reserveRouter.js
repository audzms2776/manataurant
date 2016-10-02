/**
 * Created by TT on 2016-09-27.
 */
const express = require('express');
const router = express.Router();
const app = express();
const Reserves = require('../model/reserves');

router.route('/reserves/:store_phone')
    .get(getReserveList);

router.route('/reserves/add/:store_phone')
    .get(addReserveList);

router.route('/reserves/main/:store_phone')
    .get(getReservesMainList);

router.route('/reserves/list/:store_phone/:subscriber_phone')
    .get(getSubscriberDetail);

function getReserveList(req, res, next) {

    const store_phone = req['params']['store_phone'];

    if (store_phone == undefined) {
        res.status(400).send({msg: 'no phone'});
        return;
    }

    Reserves.sendReserveList(store_phone, (err, result)=> {

        if (err) {
            res.status(500).send({msg: err.message});
            return;
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        res.setHeader('Access-Control-Max-Age', 3600);
        res.setHeader('Access-Control-Allow-Headers', 'Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization');
        res.send(result);
    });
}

function addReserveList(req, res, next) {

    const store_phone = req['params']['store_phone'];
    const name = req['query']['name'];
    const group = req['query']['group'];
    const date = req['query']['date'];
    const time = req['query']['time'];
    const subscriber_phone = req['query']['subscriber_phone'];
    const number = parseInt(req['query']['number']);

    console.log(req);
    Reserves.saveReserve(store_phone, name, group, date, time, subscriber_phone, number, (err, result)=> {
        if (err) {
            res.status(500).send({msg: err.message});
            return;
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        res.setHeader('Access-Control-Max-Age', 3600);
        res.setHeader('Access-Control-Allow-Headers', 'Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization');
        res.send(result);
    });
}

function getSubscriberDetail(req, res) {

    const store_phone = req['params']['store_phone'];
    const subscriber_phone = req['params']['subscriber_phone'];

    Reserves.sendSubscriberDetail(store_phone, subscriber_phone, (err, result)=> {
        if (err) {
            res.status(500).send({msg: err.message});
            return;
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        res.setHeader('Access-Control-Max-Age', 3600);
        res.setHeader('Access-Control-Allow-Headers', 'Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization');
        res.send(result);
    });
}

function getReservesMainList(req, res) {

    const store_phone = req['params']['store_phone'];
    console.log(1);
    Reserves.sendMainReserves(store_phone, (err, result)=> {
        if (err) {
            res.status(500).send({msg: err.message});
            return;
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        res.setHeader('Access-Control-Max-Age', 3600);
        res.setHeader('Access-Control-Allow-Headers', 'Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization');
        res.send(result);
    });
}

module.exports = router;
