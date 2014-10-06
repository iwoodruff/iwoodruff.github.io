'use strict';
var portfolioApp = angular.module('portfolioApp', [
    'ngRoute',
    'ngResource',
    'ngCookies',
    'ngSanitize',
    'ngAnimate',
    'mgcrea.ngStrap'
  ]);
portfolioApp.config([
  '$routeProvider',
  '$logProvider',
  function ($routeProvider, $logProvider) {
    $logProvider.debugEnabled(false);
    $routeProvider.when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl as Main'
    });
  }
]);
'use strict';
angular.module('portfolioApp').controller('MainCtrl', [
  '$location',
  '$scope',
  'GetJson',
  '$anchorScroll',
  function ($location, $scope, GetJson, $anchorScroll) {
    var ctrl = this;
    GetJson.getGallery().then(function (data) {
      ctrl.gallery = data;
    });
    var gridCaptions = [], j = 0;
    for (var x = 0; x < 77; x++) {
      gridCaptions[x] = [];
      for (var y = 0; y < 22; y++) {
        gridCaptions[x][y] = { 'description': '' };
        gridCaptions[x][y].id = j;
        gridCaptions[x][y].row = y;
        gridCaptions[x][y].column = x;
        j++;
      }
    }
    ctrl.activeBox = {};
    // ctrl.activateBox = function (box) {
    //   ctrl.activeBox = box;
    // };
    ctrl.addDescription = function (box) {
      angular.element('#description-input').focus();
      ctrl.activeBox = box;
    };
    ctrl.gridCaptions = gridCaptions;
    ctrl.exportDescriptions = function () {
      var data = JSON.stringify(ctrl.gridCaptions);
      var url = 'data:text/json;charset=utf8,' + encodeURIComponent(data);
      window.open(url, '_blank');
      window.focus();
    };
    ctrl.index = 0;
    ctrl.updateIndex = function (idx) {
      ctrl.index = idx;
    };  // ctrl.activeSection = '';
        // ctrl.show = false;
        // ctrl.concentricFinished = $location.$$path != '/' ? true : false ;
        // AboutFactory.getAbout().then( function (data) {
        //   ctrl.about = data;
        // });
        // ctrl.showAbout = function () {
        //   ctrl.show = !ctrl.show;
        // };
  }
]);
'use strict';
portfolioApp.directive('aboutSection', [function ($timeout) {
    return {
      restrict: 'A',
      scope: true,
      link: function (scope, element, attrs) {
        var browserWindow = angular.element(window), windowHeight = browserWindow.innerHeight(), element = angular.element(element), elemOffset = element.offset().top, elemHeight = windowHeight * 1.1, documentBody = angular.element(document), documentHeight = documentBody.height(), target = !!attrs.aboutSectionTransitionTarget && angular.element(attrs.aboutSectionTransitionTarget), percentageScrolled, scrollTop, relativeTop, relativeBottom, transitionTargets;
        angular.element(element).css({ 'min-height': elemHeight });
        browserWindow.bind('resize', function () {
          windowHeight = browserWindow.innerHeight();
          documentHeight = angular.element(document).height();
          elemHeight = windowHeight * 1.1;
          angular.element(element).css({ 'min-height': elemHeight });
        });
        documentBody.on('scroll', function () {
          scrollTop = browserWindow.scrollTop();
          relativeTop = scrollTop - elemOffset + elemHeight;
          if (relativeTop > 0 && relativeTop < elemHeight) {
            if (!element.hasClass('active')) {
              element.addClass('active');
            }
            if (!!target) {
              relativeBottom = scrollTop - elemOffset;
              percentageScrolled = -1 * relativeBottom / elemHeight;
              target.css({ 'margin-top': parseInt(target.css('height')) * percentageScrolled });
            }
          } else {
            if (element.hasClass('active')) {
              element.removeClass('active');
            }
          }
        });
      }
    };
  }]);
'use strict';
// http://res.cloudinary.com/digbk5qam/image/upload/v1/ + url
portfolioApp.directive('parallaxZoom', [
  '$timeout',
  '$q',
  function ($timeout, $q) {
    return {
      restrict: 'E',
      priority: 5,
      templateUrl: 'views/partials/galleryImage.html',
      link: function (scope, element, attrs) {
        var browserWindow = angular.element(window), body = angular.element('body'), windowHeight = browserWindow.innerHeight() * 0.8, imgContainer = angular.element(element.find('.img-container')), imgLrg = angular.element(element.find('.img-lrg img')), zoomView = angular.element(element.find('.img-zoom')), imgZoom = angular.element(element.find('.img-zoom img')), heightMinusNav = windowHeight - angular.element('nav').height(), widthZoomView = parseInt(zoomView.css('width')), heightZoomView = parseInt(zoomView.css('height')), diffImgWidth, diffImgHeight, percentageX, percentageY, heightLrg, widthLrg, heightZoom, widthZoom, offset, offsetX, offsetY, relativeX, relativeY, imgX, imgY, zoomX, zoomY, options;
        scope.zoomLoaded = false;
        options = !!attrs.parallaxZoomOptions && scope.$eval(attrs.parallaxZoomOptions);
        scope.hoverGrid = !!options.hoverGrid;
        scope.imgDefault = options.default;
        scope.imgZoom = options.zoom;
        if (!options.fullWidth) {
          imgContainer.css({ 'height': heightMinusNav });
        }
        // ======================================
        // on lrg img load:
        imgLrg.bind('load', function () {
          scope.$apply(function () {
            scope.lrgLoaded = true;
          });
          if (!options.fullWidth) {
            // is gallery img
            // if img is landscape, center vertically with .img-wide
            if (parseInt(imgLrg.css('height')) < heightMinusNav) {
              imgLrg.addClass('img-wide').css('margin-top', parseInt(imgLrg.css('height')) * -0.5);
              zoomView.addClass('img-wide').css('margin-top', parseInt(imgLrg.css('height')) * -0.5);
              heightZoom = parseInt(imgLrg.css('height')) * 1.4;
            } else {
              // otherwise, fit to container
              heightZoom = heightMinusNav * 1.4;
              imgLrg.css({ 'height': heightMinusNav });
            }
            // resize and center images and zoom window - important for aligning parallax.
            imgZoom.css({ 'height': heightZoom });
            browserWindow.bind('resize', function () {
              heightMinusNav = browserWindow.innerHeight() * 0.8;
              imgContainer.css({ 'height': heightMinusNav });
              imgLrg.css({ 'height': heightMinusNav });
              heightZoom = heightMinusNav * 1.4;
              imgZoom.css({ 'height': heightZoom });
              widthZoom = parseInt(imgZoom.css('width'));
              diffImgWidth = widthLrg - widthZoom;
              diffImgHeight = heightLrg - heightZoom;
            });
            imgLrg.css({ 'margin-left': parseInt(imgLrg.css('width')) * -0.5 });
            zoomView.css({ 'margin-left': parseInt(imgLrg.css('width')) * -0.5 });
            heightLrg = parseInt(imgLrg.css('height'));
            widthLrg = parseInt(imgLrg.css('width'));
          } else {
            // is shoe
            heightLrg = parseInt(imgLrg.css('height'));
            widthLrg = parseInt(browserWindow.innerWidth());
            heightZoom = heightLrg * 1.4;
            imgContainer.css({ 'height': heightLrg });
            imgZoom.css({ 'height': heightZoom });
            browserWindow.bind('resize', function () {
              heightLrg = parseInt(imgLrg.css('height'));
              imgContainer.css({ 'height': heightLrg });
              imgZoom.css({ 'height': heightZoom });
            });
          }
          // ======================================
          // when zoom image is loaded:
          imgZoom.bind('load', function () {
            scope.$apply(function () {
              scope.zoomLoaded = true;
            });
            // sets defaults 
            widthZoom = parseInt(imgZoom.css('width'));
            diffImgWidth = widthLrg - widthZoom;
            diffImgHeight = heightLrg - heightZoom;
            scope.parallaxZoom = function (bind) {
              if (bind) {
                imgLrg.bind('mousemove', function (e) {
                  offset = offset || imgLrg.offset();
                  offsetX = offsetX || parseInt(offset.left);
                  offsetY = offsetY || parseInt(offset.top);
                  relativeX = e.pageX - offsetX;
                  relativeY = e.pageY - offsetY;
                  percentageX = relativeX / widthLrg;
                  percentageY = relativeY / heightLrg;
                  zoomX = -1 * percentageX * widthZoomView;
                  zoomY = -1 * percentageY * heightZoomView;
                  zoomView.css({ 'webkitTransform': 'translate3D(' + (relativeX + zoomX) + 'px, ' + (relativeY + zoomY) + 'px, 0px)' });
                  imgX = percentageX * (widthZoomView - widthZoom);
                  imgY = percentageY * (heightZoomView - heightZoom);
                  imgZoom.css({ 'webkitTransform': 'translate3D(' + imgX + 'px, ' + imgY + 'px, 0px)' });
                });  // imgLrg.bind('mousemove', function () {
                     //   // offsets are defined at the beginning of every zoom
                     //   offset = offset || imgLrg.offset();
                     //   offsetX = offsetX || parseInt(offset.left);
                     //   offsetY = offsetY || parseInt(offset.top);
                     //   // relative position of mouse within the image
                     //   relativeX = event.pageX - offsetX;
                     //   relativeY = event.pageY - offsetY;
                     //   // relative position of zoom window's top left corner within the image
                     //   zoomOffset = zoomView.offset();
                     //   relativeZoomX = event.pageX - zoomOffset.left;
                     //   relativeZoomY = event.pageY - zoomOffset.top;
                     //   // relative position of mouse within zoom view * difference in width btwn zoomview and imgZoom
                     //   imgX = ((relativeZoomX / zoomViewWidth) * (zoomViewWidth - widthZoom));
                     //   imgY = ((relativeZoomY / zoomViewHeight) * (zoomViewHeight - heightZoom));
                     //   imgZoom.css({
                     //     'webkitTransform' : 'translate3D(' + imgX + 'px, ' + imgY + 'px, 0px)'
                     //   });
                     //   // math for parallaxing the zoom view
                     //   zoomViewX = -1 * ((relativeX / widthLrg) * zoomViewWidth);
                     //   zoomViewY = -1 * ((relativeY / heightLrg) * zoomViewHeight);
                     //   // relative position of mouse +/- position of parallaxed zoomView
                     //   zoomX = relativeX + (zoomViewX)
                     //   zoomY = relativeY + (zoomViewY)
                     //   zoomView.css({
                     //     'webkitTransform' : 'translate3D(' + Math.round(zoomX) + 'px, ' + Math.round(zoomY) + 'px, 0px)'
                     //   });
                     // });
              } else {
                imgLrg.unbind('mousemove');
                offset = undefined;
                offsetX = undefined;
                offsetY = undefined;
              }
            };
          });
        });
      },
      controller: function ($scope, $element) {
        var ctrl = this;
        this.zoomLoaded = $scope.zoomLoaded;
        this.lrgLoaded = $scope.lrgLoaded;
        $scope.$watch('lrgLoaded', function (newVal, oldVal) {
          if (newVal !== oldVal && newVal === true) {
            ctrl.lrgLoaded = true;
          }
        });
        $scope.showZoom = false;
        $scope.toggleZoom = function () {
          if ($scope.zoomLoaded) {
            // binds and unbinds mousemove event depending on its current status.
            $scope.showZoom = !$scope.showZoom;
            $scope.parallaxZoom($scope.showZoom);
          } else {
            // wait until zoomImg is loaded, then toggle zoom window.
            $scope.$watch('zoomLoaded', function (newVal, oldVal) {
              if (newVal !== oldVal && newVal === true) {
                $scope.showZoom = !$scope.showZoom;
                $scope.parallaxZoom($scope.showZoom);
              }
            });
          }
        };
      }
    };
  }
]);
'use strict';
portfolioApp.directive('scrollParallax', [
  '$timeout',
  function ($timeout) {
    return {
      restrict: 'A',
      priority: 3,
      link: function (scope, element, attrs) {
        var browserWindow = angular.element(window), windowHeight = browserWindow.innerHeight(), body = angular.element('body'), parallaxContainer = '<div class="parallax-window"></div>', parallaxWindow, options = !!attrs.parallaxScrollOptions && scope.$eval(attrs.parallaxScrollOptions), target = !!options.target && angular.element(element.find(options.target)),
          // change target to array, can accept many elements to parallax at once
          targetImg, scrollTarget, scrollTargetHeight, windowResizeRatioY, windowResizeRatioX, targetHeight, targetWidth, limitedHeight, limitedWidth, diffHeight, diffWidth, offset, offsetY, offsetX, parallaxY, percentageScrolled, percentageMoused, resizeTarget, relativeX, parallaxX, parallax, x, y, bindParallax;
        // ====================================
        // find options & set defaults:
        windowResizeRatioX = options.resizeRatioX || 1;
        windowResizeRatioY = options.resizeRatioY || 1;
        scrollTarget = !!options.scrollingOn ? angular.element(element.find(options.scrollingOn)) : angular.element(document);
        scrollTargetHeight = scrollTarget.innerHeight();
        browserWindow.bind('resize', function () {
          windowHeight = browserWindow.innerHeight();
          // this wont work
          resizeTarget();
        });
        // wraps the target in a constrained window in which the target will parallax;
        parallaxWindow = target.wrap(parallaxContainer).parent();
        if (parallaxWindow.find('img').length > 0) {
          parallaxWindow.find('img').bind('load', function () {
            targetHeight = parseInt(target.css('height'));
            targetWidth = parseInt(target.css('width'));
            resizeTarget();
          });
        } else {
          targetHeight = parseInt(target.css('height'));
          targetWidth = parseInt(target.css('width'));
          resizeTarget();
        }
        resizeTarget = function () {
          if (targetHeight > 0 && targetWidth > 0) {
            limitedHeight = targetHeight * windowResizeRatioY;
            limitedWidth = targetWidth * windowResizeRatioX;
            parallaxWindow.css({
              'height': targetHeight,
              'width': targetWidth
            });
            target.css({
              'height': limitedHeight,
              'width': limitedWidth
            });
            var imgLrg = target.find('.img-lrg img');
            target.find('.img-zoom img').css({ 'width': imgLrg.css('width') * 1.4 });
            diffHeight = targetHeight - limitedHeight;
            diffWidth = targetWidth - limitedWidth;
            bindParallax();
          }
        };
        bindParallax = function () {
          scrollTarget.bind('scroll', function (e) {
            percentageScrolled = browserWindow.scrollTop() / (scrollTargetHeight - windowHeight);
            parallaxY = -1 * diffHeight * percentageScrolled;
            parallax(undefined, parallaxY);
          });
          offset = target.offset();
          offsetY = parseInt(offset.top);
          offsetX = parseInt(offset.left);
          parallaxWindow.bind('mousemove', function (e) {
            relativeX = event.pageX - offsetX;
            percentageMoused = relativeX / targetWidth;
            console.log(targetWidth, limitedWidth);
            parallaxX = diffWidth * percentageMoused;
            parallax(parallaxX);
          });
        };
        parallax = function (inputX, inputY) {
          x = inputX || x || 0;
          y = inputY || y || 0;
          target.css({ 'webkitTransform': 'translate3D(' + x + 'px, ' + y + 'px, 0px)' });
        };  // } else {
            //   console.error('scroll-parallax directive must receive a target element at its max size and a percentage by which the targeted element\'s container will shrink in order to be parallaxed. If you\'re trying to parallax an image, make sure it\'s loaded');
            // }
      }
    };
  }
]);
'use strict';
portfolioApp.directive('hoverGrid', [
  '$compile',
  function ($compile) {
    return {
      restrict: 'A',
      priority: 1,
      link: function (scope, element, attrs) {
        var browserWindow = angular.element(window), windowHeight = browserWindow.innerHeight(), body = angular.element('body'), options = !!attrs.hoverGridOptions && scope.$eval(attrs.hoverGridOptions), target = !!options.target && angular.element(options.target), totalX = !!options.totalBoxesX && options.totalBoxesX, grid = angular.element(element), totalY, targetHeight, targetWidth, boxWidth, boxHeight, widthToHeight, boxes = [], newBox, x, y;
        if (!!target) {
          target.bind('load', function () {
            targetHeight = parseInt(target.css('height'));
            targetWidth = parseInt(target.css('width'));
            angular.element(grid).css({
              'height': targetHeight,
              'width': targetWidth
            });
            widthToHeight = targetWidth / targetHeight;
            totalY = Math.ceil(totalX / widthToHeight);
            scope.boxWidth = targetWidth / totalX;
            scope.boxHeight = targetHeight / totalY;
          });
        } else {
          console.error('you must provide a target for this directive to build a grid over');
        }
      }
    };
  }
]);
'use strict';
portfolioApp.directive('about', [
  '$timeout',
  function ($timeout) {
    return {
      restrict: 'E',
      scope: '=',
      templateUrl: 'views/partials/about.html',
      link: function (scope, element, attrs) {
        var windowHeight = angular.element(window).innerHeight(), heightMinusNav = windowHeight - angular.element('nav').height(), about = angular.element(element.find('article'));
        about.css({ 'height': heightMinusNav });
      },
      controller: [
        '$scope',
        '$element',
        function ($scope, $element) {
          var bodyContent;
          $scope.freezeScroll = function (direction) {
            bodyContent = bodyContent || angular.element('#body-content:first-child');
            if (direction === true) {
              bodyContent.addClass('freeze-scroll');
            } else {
              bodyContent.removeClass('freeze-scroll');
            }
          };
        }
      ]
    };
  }
]);
'use strict';
portfolioApp.directive('concentric', [
  '$timeout',
  function ($timeout) {
    return {
      restrict: 'E',
      scope: '=',
      templateUrl: 'views/partials/concentric.html',
      link: function (scope, element, attrs) {
        var body = angular.element('body'), concentric = angular.element(element), bodyContent = angular.element('#body-content'), logoContainer = angular.element('#logo'), concentricCirc = angular.element('#concentric-circular'), concentricOval = angular.element('#concentric-oval'), browserWindow = angular.element(window), scrollWindow = angular.element(document), windowHeight = browserWindow.innerHeight(), contactContainer = angular.element('#contact'), percentageScrolled;
        logoContainer.css({ 'top': windowHeight * 0.5 });
        concentricCirc.css({ 'top': windowHeight * 0.5 });
        concentricOval.css({ 'top': windowHeight * 0.5 });
        contactContainer.css({ 'top': windowHeight * 0.87 });
        browserWindow.bind('resize', function () {
          windowHeight = browserWindow.innerHeight();
          logoContainer.css({ 'top': windowHeight * 0.5 });
          concentricCirc.css({ 'top': windowHeight * 0.5 });
          concentricOval.css({ 'top': windowHeight * 0.5 });
          contactContainer.css({ 'top': windowHeight * 0.87 });
        });
        scope.logoLimit = new Array(11);
        scope.ovalLimit = new Array(50);
        scope.circleLimit = new Array(70);
      },
      controller: [
        '$scope',
        '$element',
        '$interval',
        '$timeout',
        '$location',
        function ($scope, $element, $interval, $timeout, $location) {
          var shimmer, shimmerEnd, shimmerIn = true;
          $scope.active = false;
          $scope.shimmer = function () {
            shimmerIn = !shimmerIn;
            $scope.shimmerActive = shimmerEnd || $scope.logoLimit.length + 1;
            if (!!!shimmer) {
              shimmer = $interval(function () {
                if (shimmerIn) {
                  $scope.shimmerActive = $scope.shimmerActive > 1 ? $scope.shimmerActive -= 1 : $scope.logoLimit.length;
                } else {
                  $scope.shimmerActive = $scope.shimmerActive < $scope.logoLimit.length ? $scope.shimmerActive += 1 : 1;
                }
              }, 50);
            }
          };
          $scope.cancelShimmer = function () {
            if (shimmer) {
              $interval.cancel(shimmer);
              shimmerEnd = $scope.shimmerActive;
              $timeout(function () {
                $scope.shimmerActive = $scope.logoLimit.length;
              }, 50);
              shimmer = undefined;
            }
          };
          $scope.active = 0;
          var browserWindow = angular.element(window), scrollWindow = angular.element(document), percentageScrolled;
          scrollWindow.bind('scroll', function (e) {
            if (browserWindow.scrollTop() <= 2000) {
              if (shimmer) {
                $interval.cancel(shimmer);
                shimmerEnd = $scope.shimmerActive;
                $scope.shimmerActive = $scope.logoLimit.length;
                shimmer = undefined;
              }
              percentageScrolled = browserWindow.scrollTop() / 2000;
              $scope.$apply($scope.active = Math.round(percentageScrolled * 50));
            }
          });
          $scope.radiate = function (path) {
            if (shimmer) {
              $interval.cancel(shimmer);
              shimmerEnd = $scope.shimmerActive;
              $scope.shimmerActive = $scope.logoLimit.length;
              shimmer = undefined;
            }
            var radiateIn = false;
            $scope.active = 0;
            $interval(function () {
              $scope.active = radiateIn ? $scope.active -= 1 : $scope.active += 1;
              if ($scope.active === $scope.ovalLimit.length) {
                radiateIn = true;
              }
              if ($scope.active === 0 && radiateIn === true) {
                $scope.shimmer();
                // $location.hash(path);
                var i = 0;
                $timeout(function () {
                  $scope.comingSoon = true;
                });
              }
            }, 40, 2 * $scope.ovalLimit.length);
          };
        }
      ]
    };
  }
]);
'use strict';
portfolioApp.factory('GetJson', [
  '$http',
  '$q',
  function ($http, $q) {
    return {
      getGallery: function () {
        var defer = $q.defer();
        $http({
          method: 'GET',
          url: '/data/gallery.json'
        }).success(function (data) {
          defer.resolve(data);
        });
        return defer.promise;
      },
      getAbout: function () {
        var defer = $q.defer();
        $http({
          method: 'GET',
          url: '/data/about.json'
        }).success(function (data) {
          defer.resolve(data);
        });
        return defer.promise;
      }
    };
  }
]);