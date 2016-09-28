/**
 * Created by TT on 2016-09-28.
 */
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/manatarurant';
const ObjectID = require('mongodb').ObjectID;
var db;
const request = require("request");

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

        var location = docs[0]['x'] + ', ' + docs[0]['y'];
        delete docs[0]['x'];
        delete docs[0]['y'];
        docs[0]['location'] = location;
        callback(null, docs[0]);
    });
};

Stores.registerStore = (name, store_phone, location, startTime, endTime, callback)=> {

    var options = {
        method: 'GET',
        url: 'https://openapi.naver.com/v1/map/geocode',
        qs: {
            query: location,
            encoding: 'utf-8'
        },
        headers: {
            'postman-token': '751b822c-3fdf-7e44-7bc6-c210af93dcf9',
            'cache-control': 'no-cache',
            'x-naver-client-secret': 'yzvyDMQvAL',
            'x-naver-client-id': 'a1RZIb1p59TLbq3iu_un'
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        var jBody = JSON.parse(body);

        console.log(jBody['total']);
        var obj = {
            "name": name,
            "store_phone": store_phone,
            "x": jBody['result']['items'][0]['point']['x'],
            "y": jBody['result']['items'][0]['point']['y'],
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
    });
};

module.exports = Stores;