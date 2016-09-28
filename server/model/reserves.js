/**
 * Created by TT on 2016-09-27.
 */
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/manatarurant';
const ObjectID = require('mongodb').ObjectID;
var db;
function Reserves() {

}

MongoClient.connect(url, function (err, database) {
    if (err) {
        console.error('MongoDB 연결 실패', err);
        return;
    }

    // console.log('MongoDB 연결 성공');
    db = database;
});

Reserves.sendReserveList = (store_phone, callback)=> {

    db.collection('stores').find({'store_phone': store_phone}, {'_id': 0}).toArray((err, docs)=> {
        if (err) {
            return callback(err, null);
        }

        var obj = {
            length: docs[0]['subscriber'].length,
            arr: docs[0]['subscriber']
        };

        callback(null, obj);
    });
};

Reserves.saveReserve = (store_phone, name, group, date, time, subscriber_phone, number, callback)=> {

    var obj = {
        "name": name,
        "group": group,
        "date": date,
        "time": time,
        "subscriber_phone": subscriber_phone,
        "number": number
    };

    console.log(obj);
    db.collection('stores').updateOne({'store_phone': store_phone}, {$push: {subscriber: obj}}, (err)=> {
        if (err) {
            callback(err, null);
            return;
        }

        callback(null, {msg: "success"});
    });
};

module.exports = Reserves;