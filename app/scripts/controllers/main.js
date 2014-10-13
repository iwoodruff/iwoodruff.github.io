'use strict';

angular.module('portfolioApp')
  .controller('MainCtrl', function ($location, $scope, GetJson, $anchorScroll) {

    var ctrl = this;

    GetJson.getGallery().then( function (data) {
      ctrl.gallery = data;
    });

    GetJson.getGrid().then( function (data) {
      ctrl.gridCaptions = data;
    });

    ctrl.activeBox = {};

    ctrl.displayCaption = function (y) {
      ctrl.activeDescription = y.description;
    };

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

    var gridCaptions = [],
        j = 0



    ctrl.index = 0;

    ctrl.updateIndex = function (idx) {
      ctrl.index = idx;
    };
  });
