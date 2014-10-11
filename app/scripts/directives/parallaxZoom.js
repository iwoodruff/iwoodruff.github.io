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
          windowHeight = (browserWindow.innerHeight() * 0.80),
          imgContainer = angular.element(element.find('.img-container')),
          imgLrg = angular.element(element.find('.img-lrg img')),
          zoomView = angular.element(element.find('.img-zoom')),
          imgZoom = angular.element(element.find('.img-zoom img')),
          heightMinusNav = windowHeight - angular.element('nav').height(),
          widthZoomView = parseInt(zoomView.css('width')),
          heightZoomView = parseInt(zoomView.css('height')),
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
      scope.hoverGrid = !!options.hoverGrid;
      scope.imgDefault = options.default;
      scope.imgZoom = options.zoom;

      if (!options.fullWidth) {
        imgContainer.css({
          'height' : heightMinusNav
        });
      }

      // ======================================
      // on lrg img load:

      imgLrg.bind('load', function () {
        scope.$apply(function () {
          scope.lrgLoaded = true;
        });

        if (!options.fullWidth) { // is gallery img
          // if img is landscape, center vertically with .img-wide
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

          browserWindow.bind('resize', function () {
            heightMinusNav = (browserWindow.innerHeight() * 0.80);

            imgContainer.css({
              'height' : heightMinusNav
            });

            imgLrg.css({
              'height' : heightMinusNav
            });

            heightZoom = heightMinusNav * 1.4;

            imgZoom.css({
              'height' : heightZoom
            })

            widthZoom = parseInt(imgZoom.css('width'));
            diffImgWidth = widthLrg - widthZoom;
            diffImgHeight = heightLrg - heightZoom;
          });

          imgLrg.css({
            'margin-left' : (parseInt(imgLrg.css('width')) * -0.5)
          });

          zoomView.css({
            'margin-left' : (parseInt(imgLrg.css('width')) * -0.5)
          });

          heightLrg = parseInt(imgLrg.css('height'));
          widthLrg = parseInt(imgLrg.css('width'));


          var containerWidth = parseInt(imgContainer.css('width'));

          offsetX = parseInt(imgContainer.offset().left);


        } else { // is shoe
          heightLrg = parseInt(imgLrg.css('height'));

          var containerWidth = parseInt(imgContainer.css('width'));

          widthLrg = parseInt(imgLrg.css('width'));
          heightZoom = heightLrg * 1.4;

          imgContainer.css({
            'height' : heightLrg * 0.8 // clips height so shoe can vertically parallax
          });

          imgZoom.css({
            'height' : heightZoom
          });

          offsetX = parseInt(imgLrg.offset().left)

          browserWindow.bind('resize', function () {
            heightLrg = parseInt(imgLrg.css('height'));

            imgContainer.css({
              'height' : heightLrg
            });

            imgZoom.css({
              'height' : heightZoom
            });
          });

          var diffWidth = containerWidth - widthLrg;

          imgLrg.bind('mousemove', function (event) {
            var percentageMoused = parseInt(event.pageX) / containerWidth;

            var x = percentageMoused * diffWidth;

            imgLrg.css({
              'webkitTransform' : 'translate3D(' + x + 'px, 0px, 0px)'
            });
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
          diffImgWidth = parseInt(imgLrg.css('width')) - widthZoom;
          diffImgHeight = heightLrg - heightZoom;

          scope.parallaxZoom = function (bind) {
            if (bind) {
              imgLrg.bind('mousemove', function (e) {
                offset = offset || imgLrg.offset();
                offsetY = offsetY || parseInt(offset.top);

                relativeX = e.pageX - offsetX;
                relativeY = e.pageY - offsetY;

                percentageX = relativeX / containerWidth;
                percentageY = relativeY / heightLrg;

                console.log(percentageX)

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
              });
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
    controller : function ($scope, $element) {
      var ctrl = this;

      this.zoomLoaded = $scope.zoomLoaded;
      this.lrgLoaded = $scope.lrgLoaded;

      $scope.$watch('lrgLoaded', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal === true) {
          ctrl.lrgLoaded = true;
        }
      });

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