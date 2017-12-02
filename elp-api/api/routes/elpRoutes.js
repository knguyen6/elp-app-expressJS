'use strict';
module.exports = function(app) {
  var elpApp = require('../controllers/elpControllers');
  var expressJoi = require('express-joi');

  var Joi = expressJoi.Joi; // The exposed Joi object used to create schemas and custom types


  // elpApp Routes
  app.route('/example')
      .get(elpApp.handleExample)

    app.route('/search')
        .get(elpApp.searchData)

    app.route('/business/:busId')
      .get(expressJoi.joiValidate({busId: Joi.number().required()}, {strict: true}), elpApp.getBusinessInfoById)

    app.route('/user/:userId')
        .get(expressJoi.joiValidate({userId: Joi.number().required()}, {strict: true}), elpApp.getUserById)

    app.route('/user/:userId/reviews-ratings')
      .get(expressJoi.joiValidate({userId: Joi.number().required()}, {strict: true}), elpApp.getUserReviewsAndRatings)

    const validBusinessPayload = {
        name : Joi.string().required(),
        description: Joi.string().required(),
        city: Joi.string().required(),
        address: Joi.string().required(),
        businessHours: Joi.string().required(),
        averagePrice: Joi.string().required(),
        category: Joi.string().required(),
        email: Joi.string().email().optional(),
        phone: Joi.string().optional()
    };

    app.route('/business')
        .post(expressJoi.joiValidate(validBusinessPayload), elpApp.addABusiness);

    const validUserRating = {
        userId: Joi.number(),
        busId: Joi.number().required(),
        rating: Joi.number().min(1).max(5).required()
    }
    app.route('/user/:userId/rating')
        .post(expressJoi.joiValidate(validUserRating, {strict: true}), elpApp.addRating);


    const validUserReview = {
        userId: Joi.number(),
        busId: Joi.number().required(),
        review: Joi.string().min(1).max(140).required()
    }
    app.route('/user/:userId/review')
        .post(expressJoi.joiValidate(validUserReview, {strict: true}), elpApp.addReview);

};
