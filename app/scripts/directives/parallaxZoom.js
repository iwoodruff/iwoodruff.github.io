'use strict';

// http://res.cloudinary.com/digbk5qam/image/upload/v1/ + url

portfolioApp.directive('parallaxZoom', ['$timeout', '$q', function ($timeout, $q) {
  return {
    restrict : 'E',
    priority : 5,
    templateUrl : 'views/partials/galleryImage.html',
    link : function (scope, element, attrs) {
      var browserWindow = angular.element(window),
          body = angular.element('body'),
          windowHeight,
          imgContainer = angular.element(element.find('.img-container')),
          imgLrg = angular.element(element.find('.img-lrg img')),
          zoomView = angular.element(element.find('.img-zoom')),
          imgZoom = angular.element(element.find('.img-zoom img')),
          heightMinusNav,
          widthZoomView = parseInt(zoomView.css('width')),
          heightZoomView = parseInt(zoomView.css('height')),
          orientElements,
          diffImgWidth,
          diffImgHeight,
          percentageX,
          percentageY,
          heightLrg,
          widthLrg,
          heightZoom,
          widthZoom,
          offset,
          offsetX,
          offsetY,
          relativeX,
          relativeY,
          imgX,
          imgY,
          zoomX,
          zoomY,
          options;

      scope.zoomLoaded = false;

      options = !!attrs.parallaxZoomOptions && scope.$eval(attrs.parallaxZoomOptions);
      scope.imgDefault = options.default;
      scope.imgZoom = options.zoom;

      // imgContainer.css({
      //   'height' : heightMinusNav
      // });

      orientElements = function () {
        windowHeight = (browserWindow.innerHeight() * 0.80),
        heightMinusNav = windowHeight - angular.element('nav').height(),

        imgContainer.css({
          'height' : heightMinusNav
        });

        if (parseInt(imgLrg.css('height')) < heightMinusNav) {
          imgLrg.addClass('img-wide').css('margin-top', (parseInt(imgLrg.css('height')) * -0.5));

          zoomView.addClass('img-wide').css('margin-top', (parseInt(imgLrg.css('height')) * -0.5))

          heightZoom = parseInt(imgLrg.css('height')) * 1.4;
        } else { // otherwise, fit to container
          heightZoom = heightMinusNav * 1.4;

          imgLrg.css({
            'height' : heightMinusNav
          });
        }

        // resize and center images and zoom window - important for aligning parallax.
        imgZoom.css({
          'height' : heightZoom
        });

        imgLrg.css({
          'margin-left' : (parseInt(imgLrg.css('width')) * -0.5)
        });

        zoomView.css({
          'margin-left' : (parseInt(imgLrg.css('width')) * -0.5)
        });

        heightLrg = parseInt(imgLrg.css('height'));
        widthLrg = parseInt(imgLrg.css('width'));
      };

      // ======================================
      // on lrg img load:

      imgLrg.bind('load', function () {
        orientElements();

        browserWindow.bind('resize', function () {
          orientElements();
        });

        // ======================================
        // when zoom image is loaded:

        imgZoom.bind('load', function () {
          scope.$apply(function () {
            scope.zoomLoaded = true;
          });

          // sets defaults 
          widthZoom = parseInt(imgZoom.css('width'));
          diffImgWidth = parseInt(imgLrg.css('width')) - widthZoom;
          diffImgHeight = heightLrg - heightZoom;

          scope.parallaxZoom = function (bind) {
            imgLrg.bind('mousemove', function (e) {
              if (bind) {
                offset = offset || imgLrg.offset();
                offsetX = offsetX || parseInt(offset.left);
                offsetY = offsetY || parseInt(offset.top);

                relativeX = e.pageX - offsetX;
                relativeY = e.pageY - offsetY;

                percentageX = relativeX / widthLrg;
                percentageY = relativeY / heightLrg;

                zoomX = -1 * percentageX * widthZoomView;
                zoomY = -1 * percentageY * heightZoomView;

                zoomView.css({
                  'webkitTransform' : 'translate3D(' + (relativeX + zoomX) + 'px, ' + (relativeY + zoomY) + 'px, 0px)'
                });

                imgX = percentageX * (widthZoomView - widthZoom);
                imgY = percentageY * (heightZoomView - heightZoom); 


                imgZoom.css({
                  'webkitTransform' : 'translate3D(' + imgX + 'px, ' + imgY + 'px, 0px)'
                });
              } else {
                imgLrg.unbind('mousemove');
                offset = undefined;
                offsetX = undefined;
                offsetY = undefined;
              }
            });
          };
        });
      });
    },
    controller : function ($scope, $element) {
      var ctrl = this;

      // this.zoomLoaded = $scope.zoomLoaded;
      // this.lrgLoaded = $scope.lrgLoaded;

      // $scope.$watch('lrgLoaded', function (newVal, oldVal) {
      //   if (newVal !== oldVal && newVal === true) {
      //     ctrl.lrgLoaded = true;
      //   }
      // });

      $scope.showZoom = false

      $scope.toggleZoom = function () {
        if ($scope.zoomLoaded) { // binds and unbinds mousemove event depending on its current status.
          $scope.showZoom = !$scope.showZoom;
          $scope.parallaxZoom($scope.showZoom);
        } else { // wait until zoomImg is loaded, then toggle zoom window.
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
}]);