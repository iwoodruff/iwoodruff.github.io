'use strict';

angular.module('portfolioApp')
  .controller('MainCtrl', function ($location, $scope, GetJson, $anchorScroll) {

    var ctrl = this;

    GetJson.getGallery().then( function (data) {
      ctrl.gallery = data;
    });

    GetJson.getGrid().then( function (data) {
      ctrl.gridCaptions = data;
    })

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


    // for (var x = 0; x < 77; x++) {
    //   gridCaptions[x] = [];
    //   for (var y = 0; y < 31; y++) {
    //     gridCaptions[x][y] = { "description" : "" };
    //     gridCaptions[x][y].id = j;
    //     gridCaptions[x][y].row = y;
    //     gridCaptions[x][y].column = x;

    //     j++
    //   }
    // }

    ctrl.activeBox = {};

    // ctrl.activateBox = function (box) {
    //   ctrl.activeBox = box;
    // };
    
    ctrl.addDescription = function (box) {
      angular.element('#description-input').focus();
      ctrl.activeBox = box;
    };

    // ctrl.gridCaptions = gridCaptions;

    ctrl.exportDescriptions = function () {
      var data = JSON.stringify(ctrl.gridCaptions);

      var url = 'data:text/json;charset=utf8,' + encodeURIComponent(data);

      window.open(url, '_blank');
      window.focus();
    };

    ctrl.index = 0;

    ctrl.updateIndex = function (idx) {
      ctrl.index = idx;
    };

    // ctrl.activeSection = '';
    // ctrl.show = false;
    // ctrl.concentricFinished = $location.$$path != '/' ? true : false ;

    // AboutFactory.getAbout().then( function (data) {
    //   ctrl.about = data;
    // });

    // ctrl.showAbout = function () {
    //   ctrl.show = !ctrl.show;
    // };

  });
