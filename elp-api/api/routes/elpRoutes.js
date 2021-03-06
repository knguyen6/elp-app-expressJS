'use strict';
module.exports = function(app) {
  var elpApp = require('../controllers/elpControllers');

  // elpApp Routes

    app.route('/search')
        .get(elpApp.searchData)

    app.route('/business/:busId')
      .get(elpApp.getBusinessInfoById)

    app.route('/user/:userId')
        .get(elpApp.getUserById)

    app.route('/user/:userId/reviews-ratings')
      .get(elpApp.getUserReviewsAndRatings)

    app.route('/business')
        .post(elpApp.addABusiness);

    app.route('/user/rating')
        .post(elpApp.addRating);

    app.route('/user/review')
        .post(elpApp.addReview);

};
