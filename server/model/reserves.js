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

        var users = docs[0]['subscriber'];

        if (users.length == 0) {
            callback(null, {arr: []});
            return;
        }

        var nameArr = [];
        var phoneArr = [];

        users.forEach((item)=> {
            nameArr.push(item['name']);
            phoneArr.push(item['subscriber_phone']);
        });

        var resultNameArr = nameArr.reduce(function (a, b) {
            if (a.indexOf(b) < 0) a.push(b);
            return a;
        }, []);

        var resultPhoneArr = phoneArr.reduce(function (a, b) {
            if (a.indexOf(b) < 0) a.push(b);
            return a;
        }, []);

        var obj = [];

        for (var i = 0; i < resultNameArr.length; i++) {
            obj.push({'name': resultNameArr[i], 'phone': resultPhoneArr[i]});
        }

        callback(null, {'arr': obj});
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
        var myArr = [];

        subscribers.forEach((item)=> {
            if (item['subscriber_phone'] == subscriber_phone) {
                myArr.push(item);
            }
        });

        console.log(myArr);

        callback(null, {'arr': myArr});
    });
};

Reserves.sendMainReserves = (store_phone, callback)=> {

    db.collection('stores').find({'store_phone': store_phone}).toArray((err, docs)=> {
        if (err) {
            return callback(err, null);
        }

        var subscriber = docs[0]['subscriber'];
        var obj = {'arr': []};
        var dateArr = [];
        subscriber.forEach((item)=> {
            var temp = item['date'].split('-');
            dateArr.push(temp[0] + '-' + temp[1]);
        });

        var middleArr = [];
        middleArr = dateArr.reduce(function (a, b) {
            if (a.indexOf(b) < 0) a.push(b);
            return a;
        }, []);

        middleArr = middleArr.sort();
        console.log(middleArr);

        middleArr.forEach((item)=> {
            obj['arr'].push({'date': item, 'reserves': []});
        });

        subscriber.forEach((item)=> {

            var tempDate = item['date'].split('-');
            var temp = tempDate[0] + '-' + tempDate[1];
            console.log(temp);

            obj['arr'].forEach((element, idx)=> {
                if (element['date'] == temp) {
                    delete item['date'];
                    obj['arr'][idx]['reserves'].push(item);
                }
            });
        });

        callback(null, obj);
    });
};

module.exports = Reserves;