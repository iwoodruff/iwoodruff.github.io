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
        } else { // is shoe
          heightLrg = parseInt(imgLrg.css('height'));

          widthLrg = parseInt(browserWindow.innerWidth());
          heightZoom = heightLrg * 1.4;

          imgContainer.css({
            'height' : heightLrg
          });

          imgZoom.css({
            'height' : heightZoom
          });

          browserWindow.bind('resize', function () {
            heightLrg = parseInt(imgLrg.css('height'));

            imgContainer.css({
              'height' : heightLrg
            });

            imgZoom.css({
              'height' : heightZoom
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

                zoomView.css({
                  'webkitTransform' : 'translate3D(' + (relativeX + zoomX) + 'px, ' + (relativeY + zoomY) + 'px, 0px)'
                });

                imgX = percentageX * (widthZoomView - widthZoom);
                imgY = percentageY * (heightZoomView - heightZoom); 

                imgZoom.css({
                  'webkitTransform' : 'translate3D(' + imgX + 'px, ' + imgY + 'px, 0px)'
                });
              });

              // imgLrg.bind('mousemove', function () {
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