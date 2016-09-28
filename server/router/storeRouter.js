/**
 * Created by TT on 2016-09-28.
 */
const express = require('express');
const router = express.Router();
const app = express();
const Stores = require('../model/stores');

router.route('/join')
    .post(joinStore);

router.route('/stores/:store_phone')
    .get(getStoreData);

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

        res.send(result);
    });
}

function joinStore(req, res, next) {

    const name = req['body']['name'];
    const store_phone = req['body']['store_phone'];
    const location = req['body']['location'];
    const startTime = req['body']['startTime'];
    const endTime = req['body']['endTime'];

    Stores.registerStore(name, store_phone, location, startTime, endTime, (err, result)=> {
        if (err) {
            res.status(500).send({msg: err.message});
            return;
        }

        res.send(result);
    });
}

module.exports = router;