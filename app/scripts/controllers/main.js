'use strict';

angular.module('portfolioApp')
  .controller('MainCtrl', function ($location, $scope, Data, $anchorScroll, $filter, $modal) {

    var ctrl = this;

    ctrl.contactExpanded = false;

    ctrl.toggleContactInfo = function () {
      ctrl.contactExpanded = !ctrl.contactExpanded;
      console.log(ctrl.contactExpanded)
    };

    ctrl.currentStep = 0;

    ctrl.postTour = function () {
      console.log('tour over!');
    };

    ctrl.postStep = function () {
      console.log('step over!');
    };

    ctrl.tourShowZoom = false;

    ctrl.showZoomImg = function () {
      ctrl.tourShowZoom = !ctrl.tourShowZoom;
    };

    ctrl.tour = [
      {
        body : "On scroll and click this directive iterates a variable <span class='monospace'>active</span> which toggles classes made in a recursive less loop.",
        snippet : 
        'div.circle-{{ $index }} ng-class="{ \'active\' : $index == {{ active }} }<br/><br/>' +
        '.classLoop(@index) when (@index < 100) {<br/>' +
          '<span class="tab"></span>#circle-@{ index } {<br/>' +
          '<span class="tab"></span><span class="tab"></span>width: @index*20px;<br/>' +
          '<span class="tab"></span><span class="tab"></span>height: @index*20px;<br/>' +
          '<span class="tab"></span><span class="tab"></span>margin-left: -@index*10px;<br/>' +
          '<span class="tab"></span><span class="tab"></span>margin-top: -@index*10px;<br/>' +
          '<span class="tab"></span><span class="tab"></span>.rotate(@index * 3deg);<br/>' +
          '<span class="tab"></span><span class="tab">&.active {<br/>' +
          '<span class="tab"></span><span class="tab"></span><span class="tab"></span>border: 1px solid white;<br/>' +
          '<span class="tab"></span><span class="tab"></span><span class="tab"></span>etc.<br/>' +
          '<span class="tab"></span><span class="tab"></span>}<br/>' +
          '<span class="tab"></span>}<br/>' +
          '<span class="tab"></span>.classLoop(@index+1);<br/>' +
          '}<br/>' +
        '.classLoop(0);'
      },
      {
        body : "The world doesn't need another jQuery plugin. But it could use some more angularJs shiny bits.<br/><br/>Using only angularJs' selectors and event handlers, this directive dynamically tracks and positions two differently resolutioned images to make an illusion of zooming. Fork it on <a href='http://github.com'>github.</a>",
        snippet : ""
      },
      {
        body : "",
        snippet : "",
        action : null
      },
      {
        body : "",
        snippet : "",
        action : null
      },
    ]

    ctrl.gallery = Data.gallery;

    ctrl.gridCaptions = Data.grid;

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
      { url: 'portfolio_gallery/assets/angularLogo.png', blurb: {
          'title' : 'Besides using AngularJs for this static site, I\'ve worked in this intuitive and powerful framework building a financial-planning app, a scholarship foundation\'s internal portal and too many interactive lists and forms to count. It\'s the best.',
          container : 'body',
          html : true
        }
      },
      { url: 'portfolio_gallery/assets/backboneLogo.png', blurb: {
          'title' : 'Check out my General Assembly final project written in Rails, Backbone Js and jQuery. Be gentile. I wrote it with 3 months experience. Plus, it\'s hosted on Heroku for free and is therefore very slow.',
          container : 'body'
        }
      },
      { url: 'portfolio_gallery/assets/jqueryLogo.png', blurb: {
          'title' : 'Trying to wean myself off jQuery in favor of AngularJs, but it\'s essential to know. Besides jQLite, there is no jQuery on this site.',
          container : 'body'
        }
      },
      { url: 'portfolio_gallery/twigLogo.png', blurb: {
          'title' : 'An intuitive PHP based templating language. I\'ve used it in tandem with Craft, a Yii PHP based CMS.',
          container : 'body'
        }
      },
      { url: 'portfolio_gallery/assets/lessLogo.png', blurb: {
          'title' : 'This project is styled in Less. Check out the tour to see some fun recursive functions.',
          container : 'body'
        }
      },
      { url: 'portfolio_gallery/assets/sassLogo.png', blurb: {
          'title' : 'Like Sass, it\'s an essential.',
          container : 'body'
        }
      } 
    ];


    ctrl.backEndAssets = [ 
      { url: 'portfolio_gallery/assets/salesforceLogo.png', blurb: {
          'title' : 'Incredibly powerful Cloud CRM. The majority of my recent back-end work has been in SalesForce\'s Java-based Apex code.',
          container : 'body'
        }
      },
      { url: 'portfolio_gallery/assets/nodejsLogo.png', blurb: {
          'title' : 'Used it to build a headless NodeJs app which served as a waypoint to migrate data from Stripe\'s API to a SalesForce database.',
          container : 'body'
        }
      },
      { url: 'portfolio_gallery/assets/mongodbLogo.png', blurb: {
          'title' : 'Used it to build a headless NodeJs app which served as a waypoint to migrate data from Stripe\'s API to a SalesForce database.',
          container : 'body'
        }
      },
      { url: 'portfolio_gallery/assets/railsLogo.png', blurb: {
          'title' : '',
          container : 'body'
        }
      },
      { url: 'portfolio_gallery/assets/craftLogo.png', blurb: {
          'title' : 'test test test test test',
          container : 'body'
        }
      },
      { url: 'portfolio_gallery/assets/postgresqlLogo.png', blurb: {
          'title' : 'test test test test test',
          container : 'body'
        }
      }
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

  });
