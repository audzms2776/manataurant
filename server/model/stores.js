/**
 * Created by TT on 2016-09-28.
 */
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/manatarurant';
const ObjectID = require('mongodb').ObjectID;
var db;

function Stores() {

}

MongoClient.connect(url, function (err, database) {
    if (err) {
        console.error('MongoDB 연결 실패', err);
        return;
    }

    // console.log('MongoDB 연결 성공');
    db = database;
});

Stores.sendStoreData = (store_phone, callback)=> {

    db.collection('stores').find({"store_phone": store_phone}, {'_id': 0, 'subscriber': 0}).toArray((err, docs)=> {

        if (err) {
            callback(err, null);
            return;
        }

        callback(null, docs[0]);
    });
};

Stores.registerStore = (name, store_phone, startTime, endTime, callback)=> {

    var obj = {
        "name": name,
        "store_phone": store_phone,
        "startTime": startTime,
        "endTime": endTime,
        "subscriber": []
    };

    console.log(obj);

    db.collection('stores').insert(obj, (err)=> {
        if (err) {
            callback(err, null);
            return;
        }

        callback(null, {msg: "success"});
    });
};

Stores.changeStore = (before_phone, name, store_phone, startTime, endTime, callback)=> {

    var obj = {
        "name": name,
        "store_phone": store_phone,
        "startTime": startTime,
        "endTime": endTime
    };

    db.collection('stores').update({'store_phone': before_phone}, {$set: obj},
        (err, result)=> {
            if (err) {
                console.log(err);
                callback(err, null);
            }

            callback(null, {msg: "success"});
        });
};

module.exports = Stores;
