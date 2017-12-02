'use strict';
var mysql = require('../models/elpModels');
var bodyParser = require('body-parser');
var _ = require('underscore')
var Joi = require('express-joi').Joi;

// var Joi = expressJoi.Joi; // The exposed Joi object used to create schemas and custom types



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

        else if (!result[0][0]){
            res.status(404)
            res.send(responseObj('error',"Business doesn't exist"))
        }
        else {
            result[0] = _.uniq(result[0], 'contact'); //dedup

            var business = result[0][0];//default to the 1st object.

            //more than 2 objs in result, meaning 1 contain phone, 1 contain email
            if (result[0].length > 1) {
                business = mergeData(result[0])
            }
            else {
                //for single object, put contact into either email or phone:
                business.email = isEmail(business.contact) ? business.contact : ""
                business.phone = !(isEmail(business.contact)) ? business.contact : ""
                delete business.contact
            }
            res.send(responseObj('success', business))
        }



    });//DoQuery

};

function mergeData(results) {
    var bus = results[0];

    bus.email = isEmail(bus.contact) ? bus.contact : results[1].contact;
    bus.phone = isEmail(bus.contact) ? result[1].contact : bus.contact;

    delete bus.contact;
    return bus;
}
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

    mysql.DoQuery('call addNewBusness(?,?,?,?,?,?,?,?,?)',
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

    mysql.DoQuery('call addNewRating(?,?,?)',
    [req.params.userId, payload.busId, payload.rating],
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

    mysql.DoQuery('call addNewReview(?,?,?)',
    [req.params.userId, payload.busId, payload.review],
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

//simple check if a string is email or not
function isEmail(data) {
    const validateData = Joi.validate({ email: data }, {email: Joi.string().email()});
    return (validateData == null && data.indexOf('@') > -1) ? true : false;
}
