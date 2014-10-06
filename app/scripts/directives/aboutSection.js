'use strict';

portfolioApp.directive('aboutSection', [function ($timeout) {
  return {
    restrict : 'A',
    scope : true,
    link : function (scope, element, attrs) {
      var browserWindow = angular.element(window),
          windowHeight = browserWindow.innerHeight(),
          element = angular.element(element),
          elemOffset = element.offset().top,
          elemHeight = (windowHeight * 1.1),
          documentBody = angular.element(document),
          documentHeight = documentBody.height(),
          target = !!attrs.aboutSectionTransitionTarget && angular.element(attrs.aboutSectionTransitionTarget),
          percentageScrolled,
          scrollTop,
          relativeTop,
          relativeBottom,
          transitionTargets

      angular.element(element).css({
        'min-height' : elemHeight
      });

      browserWindow.bind('resize', function () {
        windowHeight = browserWindow.innerHeight();
        documentHeight = angular.element(document).height();
        elemHeight = (windowHeight * 1.1);

        angular.element(element).css({
          'min-height' : elemHeight
        });
      });

      documentBody.on('scroll', function () {
        scrollTop = browserWindow.scrollTop();
        relativeTop = scrollTop - elemOffset + elemHeight;

        if (relativeTop > 0 && relativeTop < elemHeight) {
          if (!element.hasClass('active')) { element.addClass('active'); }

          if (!!target) {
            relativeBottom = scrollTop - elemOffset;
            percentageScrolled = -1 * relativeBottom / elemHeight;

            target.css({
              'margin-top' : (parseInt(target.css('height')) * percentageScrolled)
            });
          }
        } else {
          if (element.hasClass('active')) { element.removeClass('active'); }
        }
      });
    }
  }
}]);