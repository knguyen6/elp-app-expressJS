'use strict';
var mysql = require('../models/elpModels');
var bodyParser = require('body-parser');
var _ = require('underscore')

//Search by query params:
//location(string), businessName (string), range(number),
//rating(number), averagePrice(string)
exports.searchData = function(req, res) {

    if (_.isEmpty(req.params))
        req.params.location = 'tacoma'

    var params = req.params;
    console.log("query params: ", req.params)

    mysql.DoQuery('SELECT * from business where city=?',
        [params.location],
        //TODO: use all these params
        // [params.location, params.businessName, params.range,
                // params.rating, params.averagePrice]
        function(err, result){
        if (err){
            console.log("Error:", err)
            res.status(500)
            res.json(responseObj('error', err))
        }
        else
            res.json(responseObj('success', result))
    });//DoQuery

}

//TODO: replace query by mysql function
exports.getBusinessInfoById = function(req, res) {

    if (!('busId' in req.params)){
        res.status(400)
        res.send(responseObj('error', 'Missing busId'));
    }

    mysql.DoQuery('SELECT * from business where id=?', [req.params.busId], function(err, result){
        if (err){
            console.log("Error:", err)
            res.status(500)
            res.send(responseObj('error', err))
        }

        else if (!result[0]){
            res.status(404)
            res.send(responseObj('error',"Business doesn't exist"))
        }
        else
            res.send(responseObj('success', result[0]))
    });//DoQuery

};

//TODO: replace query by mysql function
exports.getUserById = function(req, res) {
    if (!('userId' in req.params)){
        res.status(400)
        return res.send(responseObj('error', 'Missing userId parameter'));
    }

    mysql.DoQuery('SELECT * from userinfo where id=?', [req.params.userId], function(err, result){
        if (err){
            console.log("Error:", err)
            res.status(500)
            res.send(responseObj('error', err))
        }

        else if (!result[0]){
            res.status(404)
            res.send(responseObj('error',"User doesn't exist"))
        }
        else
            res.send(responseObj('success', result[0]))
    })
};

exports.getUserReviewsAndRatings = function(req, res) {
    if (!('userId' in req.params)){
        res.status(400)
        return res.send(responseObj('error', 'Missing userId parameter'));
    }

    //TODO: this is just sample query, replace by function name
    mysql.DoQuery('SELECT * from userreview as re, userrating as ra where re.userid=? or ra.userid=?',
    [req.params.userId, req.params.userId],
    function(err, result){
        if (err){
            console.log("Error:", err)
            res.status(500)
            res.send(responseObj('error', err))
        }
        else
            res.send(responseObj('success', result))
    })
};

//TODO:
/*
"city":"hawaii",
	"address":"98 uuuuu st",
	"businessHours":"W:8-9, Th:10-4",
	"averagePrice":"high"
}
*/
exports.addABusiness = function(req, res) {

    var payload = req.body;
    console.log("\npayload: ", payload)
    if ((_.isEmpty(payload)) ||!payload.name || !payload.city || !payload.address
        || !payload.businessHours || !payload.averagePrice) {
        res.status(400)
        return res.send(responseObj('error', 'missing field in payload, required: name, city, address, businessHours, averagePrice'))
    }

    //TODO: this is just sample query, replace by function name
    // (city, address, businesshours, averageprice)
    mysql.DoQuery('insert into business values(?,?,?,?,?,?)',
    ['bus4', 'blabla', payload.city,payload.address,payload.businessHours,payload.averagePrice],
    function(err, result){
        if (err){
            console.log("Error:", err)
            res.status(500)
            res.send(responseObj('error', err))
        }
        else{
            res.status(201)
            res.send(responseObj('success'))
        }
    })
};

exports.addRating = function(req, res) {
    var payload = req.body;
    console.log("\npayload: ", payload)
    if (_.isEmpty(payload) || !('rating' in payload)) {
        res.status(400)
        return res.send(responseObj('error', 'missing field in payload, required: rating'))
    }


    //TODO: this is just sample query, replace by function name
    // (id, userid, businessid, rating)
    mysql.DoQuery('insert into userrating values(?, ?,?,?)',
    ['rating3', 'user1', 'busID1', 5],
    function(err, result){
        if (err){
            console.log("Error:", err)
            res.status(500)
            res.send(responseObj('error', err))
        }
        else{
            res.status(201)
            res.send(responseObj('success'))
        }
    })
};

exports.addReview = function(req, res) {
    var payload = req.body;
    console.log("\npayload: ", payload)
    if (_.isEmpty(payload) || !('review' in payload) || (payload.review.length < 5)) {
        res.status(400)
        return res.send(responseObj('error', 'missing field in payload, required: review'))
    }


    //TODO: this is just sample query, replace by function name
    // (id, userid, businessid, review)
    mysql.DoQuery('insert into userreview values(?, ?,?,?)',
    ['rating3', 'user1', 'busID1', payload.review],
    function(err, result){
        if (err){
            console.log("Error:", err)
            res.status(500)
            res.send(responseObj('error', err))
        }
        else{
            res.status(201)
            res.send(responseObj('success'))
        }
    })
};


//General object to send response.
function responseObj(statusMessage, data) {
    return { status: statusMessage, data: data }
}
