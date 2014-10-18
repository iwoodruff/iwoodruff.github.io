'use strict';

angular.module('portfolioApp')
  .controller('MainCtrl', function ($location, $scope, GetJson, $anchorScroll, $filter, $modal) {

    var ctrl = this;

    GetJson.getGallery().then( function (data) {
      ctrl.gallery = data;
    });

    GetJson.getGrid().then( function (data) {
      ctrl.gridCaptions = data;
    });

    ctrl.rotators = [
      'portfolio_gallery/shoe/shoe1.png',
      'portfolio_gallery/shoe/shoe2.png',
      'portfolio_gallery/shoe/shoe3.png',
      'portfolio_gallery/shoe/shoe4.png',
      'portfolio_gallery/shoe/shoe5.png',
      'portfolio_gallery/shoe/shoe6.png',
      'portfolio_gallery/shoe/shoe7.png',
      'portfolio_gallery/shoe/shoe8.png',
    ];
  });
