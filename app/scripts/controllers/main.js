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

    ctrl.activeRotator = 0;

    ctrl.frontEndAssets = [ 
      { url: 'portfolio_gallery/assets/angularLogo.png', blurb: '' },
      { url: 'portfolio_gallery/assets/backboneLogo.png', blurb: '' },
      { url: 'portfolio_gallery/assets/jqueryLogo.png', blurb: '' },
      { url: 'portfolio_gallery/twigLogo.png', blurb: '' },
      { url: 'portfolio_gallery/assets/lessLogo.png', blurb: '' },
      { url: 'portfolio_gallery/assets/sassLogo.png', blurb: '' } 
    ];


    ctrl.backEndAssets = [ 
      { url: 'portfolio_gallery/assets/salesforceLogo.png', blurb: '' },
      { url: 'portfolio_gallery/assets/mongodbLogo.png', blurb: '' },
      { url: 'portfolio_gallery/assets/railsLogo.png', blurb: '' },
      { url: 'portfolio_gallery/assets/postgresqlLogo.png', blurb: '' },
      { url: 'portfolio_gallery/assets/craftLogo.png', blurb: '' } 
    ];


    ctrl.showContact = false;

    angular.element(window).bind('scroll', function (e) {
      if (this.pageYOffset > 2000 && this.pageYOffset <= 2100) {
        $scope.$apply(ctrl.contact = { 
          'margin-top' : 2100 - this.pageYOffset + 'px'
        });
      } else if (this.pageYOffset > 2000) {
        $scope.$apply(ctrl.contact = {
          'margin-top' : 0 + 'px'
        });
      } else {
        $scope.$apply(ctrl.contact = {
          'margin-top' : 100 + 'px'
        });
      }
    });

    // var contactModal = $modal({ template : 'views/partials/contactModal.html' })

    // ctrl.showContactModal = function () {
    //   ctrl.email = {}
    // };

  });
