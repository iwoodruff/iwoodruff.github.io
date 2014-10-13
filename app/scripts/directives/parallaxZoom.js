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

        var shoe = false;

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

          var target = imgLrg;
          offsetX = parseInt(target.offset().left);
          var targetWidth = parseInt(target.css('width'));

        } else { // is shoe
          heightLrg = parseInt(imgLrg.css('height'));

          widthLrg = parseInt(imgLrg.css('width'));
          heightZoom = heightLrg * 1.4;

          imgContainer.css({
            'height' : heightLrg * 0.85
          });

          imgZoom.css({
            'height' : heightZoom
          });

          target = imgContainer;

          offsetX = parseInt(target.offset().left)

          browserWindow.bind('resize', function () {
            heightLrg = parseInt(target.css('height'));

            imgContainer.css({
              'height' : heightLrg
            });

            imgZoom.css({
              'height' : heightZoom
            });
          });

          var targetWidth = parseInt(imgContainer.css('width'));
          var diffWidth = targetWidth - widthLrg;


          shoe = true;


          // target.bind('mousemove', function (event) {
          //   var percentageMoused = parseInt(event.pageX) / targetWidth;

          //   var activeRotator;

          //   if (percentageMoused > 0.06 && percentageMoused < 0.3) {
          //     activeRotator = 1;
          //   } else if (percentageMoused > 0.3 && percentageMoused < 0.43) {
          //     activeRotator = 0;
          //   } else if (percentageMoused > 0.43 && percentageMoused < 0.5) {
          //     activeRotator = 7;
          //   } else if (percentageMoused > 0.5 && percentageMoused < 0.56) {
          //     activeRotator = 6;
          //   } else if (percentageMoused > 0.56 && percentageMoused < 0.64) {
          //     activeRotator = 5;
          //   } else if (percentageMoused > 0.64 && percentageMoused < 0.8) {
          //     activeRotator = 4;
          //   } else if (percentageMoused > 0.8 && percentageMoused < 0.94) {
          //     activeRotator = 3;
          //   }

          //   scope.$apply(scope.activeRotator = activeRotator);

          //   var x = percentageMoused * diffWidth;

          //   angular.element('.img-lrg').css({
          //     'webkitTransform' : 'translate3D(' + x + 'px, 0px, 0px)'
          //   });
          // });
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

          // scope.parallaxZoom = function (bind) {
          target.bind('mousemove', function (e) {
            if (!!shoe) {
              var percentageMoused = parseInt(event.pageX) / targetWidth;

              var activeRotator;

              if (percentageMoused > 0.06 && percentageMoused < 0.3) {
                activeRotator = 1;
              } else if (percentageMoused > 0.3 && percentageMoused < 0.43) {
                activeRotator = 0;
              } else if (percentageMoused > 0.43 && percentageMoused < 0.5) {
                activeRotator = 7;
              } else if (percentageMoused > 0.5 && percentageMoused < 0.56) {
                activeRotator = 6;
              } else if (percentageMoused > 0.56 && percentageMoused < 0.64) {
                activeRotator = 5;
              } else if (percentageMoused > 0.64 && percentageMoused < 0.8) {
                activeRotator = 4;
              } else if (percentageMoused > 0.8 && percentageMoused < 0.94) {
                activeRotator = 3;
              }

              scope.$apply(scope.activeRotator = activeRotator);

              var x = percentageMoused * diffWidth;

              angular.element('.img-lrg').css({
                'webkitTransform' : 'translate3D(' + x + 'px, 0px, 0px)'
              });
            }

            // scope.parallaxZoom = function (bind) {
              // if (bind) {
                console.log('hi')

                offset = offset || imgLrg.offset();
                offsetY = offsetY || parseInt(offset.top);

                relativeX = e.pageX - offsetX;
                relativeY = e.pageY - offsetY;

                percentageX = relativeX / targetWidth;
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
              // } else {
              //   imgLrg.unbind('mousemove');
              //   offset = undefined;
              //   offsetX = undefined;
              //   offsetY = undefined;
              // }
            // };
          });
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
        console.log('hey')

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