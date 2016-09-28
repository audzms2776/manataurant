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

    db.collection('stores').find({'store_phone': store_phone}).toArray((err, docs)=> {
        if (err) {
            return callback(err, null);
        }

        var obj = {
            arr: []
        };

        var phone_arr = [];
        var name_arr = [];
        var users = docs[0]['subscriber'];

        users.forEach((item)=> {
            phone_arr.push(item['subscriber_phone']);
            name_arr.push(item['name']);
        });

        var uniq_phone = phone_arr.reduce(function (a, b) {
            if (a.indexOf(b) < 0) a.push(b);
            return a;
        }, []);

        var uniq_name = name_arr.reduce(function (a, b) {
            if (a.indexOf(b) < 0) a.push(b);
            return a;
        }, []);

        uniq_phone.forEach((item, index)=> {
            obj['arr'].push({'name': name_arr[index], 'pheon': item});
        });

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

Reserves.sendSubscriberDetail = (store_phone, subscriber_phone, callback)=> {

    db.collection('stores').find({'store_phone': store_phone}).toArray((err, result)=> {
        if (err) {
            return callback(err, null);
        }

        var subscribers = result[0]['subscriber'];

        subscribers.forEach((item)=> {
            if (item['subscriber_phone'] != subscriber_phone) {
                subscribers.pop();
            }
        });

        callback(null, {'arr': subscribers});
    });
};

module.exports = Reserves;