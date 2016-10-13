/**
 * Created by TT on 2016-09-28.
 */
const express = require('express');
const router = express.Router();
const app = express();
const Stores = require('../model/stores');

router.route('/join')
    .get(joinStore);

router.route('/stores/:store_phone')
    .get(getStoreData);

router.route('/stores/:store_phone/edit')
    .get(joinStore);

function getStoreData(req, res, next) {

    const store_phone = req['params']['store_phone'];

    if (store_phone == undefined) {
        res.status(400).send({msg: 'no phone'});
        return;
    }

    Stores.sendStoreData(store_phone, (err, result)=> {

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

function joinStore(req, res, next) {

    const name = req['query']['name'];
    const store_phone = req['query']['store_phone'];
    const location = req['query']['location'];
    const startTime = req['query']['startTime'];
    const endTime = req['query']['endTime'];

    Stores.registerStore(name, store_phone, location, startTime, endTime, (err, result)=> {
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

function joinStore(req, res, next) {

    const before_phone = req['params']['store'];
    const name = req['query']['name'];
    const store_phone = req['query']['store_phone'];
    const location = req['query']['location'];
    const startTime = req['query']['startTime'];
    const endTime = req['query']['endTime'];

    Stores.changeStore(before_phone, name, store_phone, location, startTime, endTime, (err, result)=> {
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
