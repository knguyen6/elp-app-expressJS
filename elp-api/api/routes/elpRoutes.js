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
        .get(elpApp.getUserById)

    app.route('/user/:userId/reviews-ratings')
      .get(elpApp.getUserReviewsAndRatings)

    app.route('/business')
        .post(elpApp.addABusiness);

    app.route('/user/:userId/rating')
        .post(elpApp.addRating);

    app.route('/user/:userId/review')
        .post(elpApp.addReview);

};
