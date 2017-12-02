'use strict';
var mysql = require('../models/elpModels');
var bodyParser = require('body-parser');
var _ = require('underscore')


exports.handleExample = function(req, res) {

    res.send("Hello world !")

};


//Search by query params:
//location(string), businessName (string),,
//rating(number), averagePrice(string)
exports.searchData = function(req, res) {

    if (_.isEmpty(req.params))
        req.params.location = 'tacoma'

    var params = req.params;
    console.log("query params: ", req.params)

    mysql.DoQuery('call search(?,?,?,?)',
        [params.location, params.businessName,
        params.rating, params.averagePrice],
        function(err, result){
        if (err){
            console.log("Error:", err)
            res.status(500)
            res.json(responseObj('error', err))
        }
        else
        var data = (result && result[0]) ? result[0] : []

        res.send(responseObj('success', data))
    });//DoQuery

}

exports.getBusinessInfoById = function(req, res) {

    if (!('busId' in req.params)){
        res.status(400)
        res.send(responseObj('error', 'Missing busId'));
    }

    mysql.DoQuery('call getBusinessById(?)', [req.params.busId], function(err, result){
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

        //TODO consolidate this business contact(phone, email)
            res.send(responseObj('success', result[0]))
    });//DoQuery

};

exports.getUserById = function(req, res) {
    if (!('userId' in req.params)){
        res.status(400)
        return res.send(responseObj('error', 'Missing userId parameter'));
    }

    mysql.DoQuery('call getUserById(?)', [req.params.userId], function(err, result){
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

    mysql.DoQuery('call getUserReviewsAndRatings(?)',
    [req.params.userId],
    function(err, result){

        if (err){
            console.log("Error:", err)
            res.status(500)
            res.send(responseObj('error', err))
        }
        else {
            var data = []
            var headerIdx = result.length-1
            if (result && result.length > 0) {
                data = result.slice(0, headerIdx); //take out the headers
                data = result[0].concat(result[1])
            }
            res.send(responseObj('success', data))
        }
    })
};


exports.addABusiness = function(req, res) {

    var payload = req.body;
    console.log("\npayload: ", payload)
    if ((_.isEmpty(payload)) ||!payload.name ||!payload.description
        || !payload.city || !payload.address
        || !payload.businessHours || !payload.averagePrice
        || !payload.phone || ! payload.category) {
        res.status(400)
        return res.send(responseObj('error', 'missing field in payload, required: '+
            'name, description, city, address, businessHours, averagePrice, phone or email, '+
            'category (cafe, fine dining, super market, restaurant, bakery)'))
    }

    mysql.DoQuery('call addNewBusiness(?,?,?,?,?,?,?,?,?)',
    [payload.name, payload.description, payload.city,payload.address,payload.businessHours,
    payload.averagePrice, payload.phone, payload.email, payload.category],
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

    mysql.DoQuery('call addNewRating(?,?,?)',
    [payload.userId, payload.busId, payload.rating],
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
    if (_.isEmpty(payload) || !('review' in payload) || (payload.review && payload.review.length < 5)) {
        res.status(400)
        return res.send(responseObj('error', 'missing field in payload, required: review'))
    }

    mysql.DoQuery('call addNewReview(?,?,?)',
    [payload.userId, payload.busId, payload.review],
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
