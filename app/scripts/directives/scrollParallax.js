'use strict';

portfolioApp.directive('scrollParallax', ['$timeout', function ($timeout) {
  return {
    restrict : 'A',
    priority: 3,
    link : function (scope, element, attrs) {
      var browserWindow = angular.element(window),
          windowHeight = browserWindow.innerHeight(),
          body = angular.element('body'),
          parallaxContainer = '<div class="parallax-window"></div>',
          parallaxWindow,
          options = !!attrs.parallaxScrollOptions && scope.$eval(attrs.parallaxScrollOptions),
          target = !!options.target && angular.element(element.find(options.target)), // change target to array, can accept many elements to parallax at once
          targetImg,
          scrollTarget,
          scrollTargetHeight,
          windowResizeRatioY,
          windowResizeRatioX,
          targetHeight,
          targetWidth,
          limitedHeight,
          limitedWidth,
          diffHeight,
          diffWidth,
          offset,
          offsetY,
          offsetX,
          parallaxY,
          percentageScrolled,
          percentageMoused,
          resizeTarget,
          relativeX,
          parallaxX,
          parallax,
          x,
          y,
          bindParallax

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
          limitedHeight = (targetHeight * windowResizeRatioY);
          limitedWidth = (targetWidth * windowResizeRatioX);

          parallaxWindow.css({
            'height' : targetHeight,
            'width' : targetWidth
          });

          target.css({
            'height' : limitedHeight,
            'width' : limitedWidth
          });

          var imgLrg = target.find('.img-lrg img');

          target.find('.img-zoom img').css({
            'width' : imgLrg.css('width') * 1.4
          });

          diffHeight = targetHeight - limitedHeight;
          diffWidth = targetWidth - limitedWidth;

          bindParallax();
        }
      };

      bindParallax = function () {
        scrollTarget.bind('scroll', function (e) {
          percentageScrolled = browserWindow.scrollTop() / (scrollTargetHeight - windowHeight);

          parallaxY = (-1 * diffHeight * percentageScrolled);

          parallax(undefined, parallaxY);
        });

        offset = target.offset();
        offsetY = parseInt(offset.top);
        offsetX = parseInt(offset.left);

        parallaxWindow.bind('mousemove', function (e) {
          relativeX = event.pageX - offsetX;

          percentageMoused = relativeX / targetWidth;

          console.log(targetWidth, limitedWidth)

          parallaxX = diffWidth * percentageMoused;

          parallax(parallaxX);
        });
      };

      parallax = function (inputX, inputY) {
        x = inputX || x || 0;
        y = inputY || y || 0;

        target.css({
          'webkitTransform' : 'translate3D(' + x + 'px, ' + y + 'px, 0px)'
        });
      };
        // } else {
        //   console.error('scroll-parallax directive must receive a target element at its max size and a percentage by which the targeted element\'s container will shrink in order to be parallaxed. If you\'re trying to parallax an image, make sure it\'s loaded');
        // }
    }
  }
}]);