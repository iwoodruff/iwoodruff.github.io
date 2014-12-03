/************************

Isaac Wang Woodruff 
Code Sample 11/2014

Simple jQuery plugin to manipulate, color & quasi-persist a svg. Inspired by work done for a section of http://kunsthallstavanger.no/en/ and obviously, coloring books.

Svg credit to Debra Ohayon of Familiar Studio.

*************************/ 


function Facade () {

  if (!$) return;

  var ctrl = this;

  var container, svg, paths, pathsArray, selectedColor;

  var dragging, dragColoring = false;

  var data = {};



// ==================================== 
/*         event based actions       */
// ==================================== 

  var hashStr, shareTextArea;

  this.exportUrl = function () {
    /* Sets url to a simple map of the selected colors so drawing can be loaded across multiple sessions. By no means an ideal way of saving, but a fun feature */
    if (konamiInterval) clearInterval(konamiInterval);

    hashStr = '';

    for (var k in data) hashStr += data[k];

    window.location.hash = hashStr;

    /* shows modal, selects whole url (it's about 1400 characters long) on focus */ 
    shareModal.addClass('show');

    (shareTextArea = shareModal.find('textarea'))
      .html(window.location.href)
      .focus( function () {
        shareTextArea.select();
      });

    return this;
  };


// ==================================== 
  var pathIdx, colorIdx;

  this.fill = function (path) {

    if (!path) return;

    if (dragging && !dragging.isEnabled) {
      /* assign color to a path when clicked & persist the info locally */
      path.style.fill = selectedColor;

      pathIdx = pathsArray.indexOf(path) >= 0 ? pathsArray.indexOf(path) : 0;
      colorIdx = colors.indexOf(selectedColor) >= 0 ? colors.indexOf(selectedColor) : 0;

      /* a simple object mapping the path's index to the index of a color: eg { 1 : 3, 2 : 0, 3 : 5, etc. }*/ 
      data[pathIdx] = colorIdx;
    }

    return this;
  };


// ==================================== 
  this.pan = function () {
    /* changes pointer to open/grasping hand */ 
    container
      .removeClass('painting')
      .addClass('hand')
      .on('mousedown', function () {

        $(this).addClass('grab'); 
      })
      .on('mouseup', function () {

        $(this).removeClass('grab'); 
      });

    dragging.enable();

    return this;
  };


// ==================================== 
  this.zoom = function (direction) {

    svg
      .css('width', (svg[0].offsetWidth * (direction == 'in' ? 1.2 : 0.8)))
      .css('margin-left', (svg[0].offsetWidth * -0.5));

    return this;
  };


// ==================================== 
  this.clear = function () {

    paths
      .css('stroke', 'black')
      .css('fill', '#ffffff')
      .each( function (i) {
        /* makes the svg 'undraw' itself */ 
        $(this)
          .attr('stroke-dashoffset', $(this).data('length'));
      });

    shareModal.removeClass('show');
    controls.removeClass('open');
    newDrawingBtn.fadeIn(2000);
    window.location.hash = '';

    /* purge data of any colors */ 
    for (var k in data) {
      data[k] = 0;
    }

    return this;
  };


// ==================================== 
  this.newDrawing = function () {

    svg.css('opacity', 1);
    controls.addClass('open');
    newDrawingBtn.fadeOut(2000);
    
    paths.each( function (i) {
      /* makes the svg 'draw' itself */ 
      speed = $(this).data('speed');

      $(this)
        .css('transition', 'stroke-dashoffset ' + speed + 'ms')
        .attr('stroke-dashoffset', '0');
    });

    return this;
  };


// ==================================== 
  var konamiProgress = 0, konamiInterval = null, konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 65, 65], randomNum;

  this.konamiFreakOut = function (keycode) {
    /* watches for the konami code. You know: up, up, down, down, right, left, right, left, A, B */
    keycode == konamiCode[konamiProgress] ? konamiProgress++ : konamiProgress = 0;

    if (konamiProgress == konamiCode.length-1) {

      konamiProgress = 0;

      konamiInterval = setInterval( function () {

        $.each( paths, function (i) {

          data[i] = randomNum = Math.floor(Math.random() * colors.length);
          this.style.fill = colors[randomNum];
          this.style.stroke = colors[Math.floor(Math.random() * colors.length)];
        });
      }, 30);
    }

    return this;
  };


// ==================================== 
/*             initialize            */
// ==================================== 

  var colors = [ '#ffffff', '#ffc3a5', '#e8408e', '#fa522e', '#f49430', '#ffed29', '#00ce6e', '#b2d6a2', '#01a4cf', '#014ede', '#7c4eac' ];

  var swatchSegments = [ '<div href id="eyedrop-', '" style="background-color: ', ';" data-color="', '"></div>' ];
  
  (function () {
    /* define elements, init drag library, assign coloring event handler */ 
    container = $('#facade-container')
    svg = container.find('svg');
    controls = $('#controls');
    newDrawingBtn = $('#new');
    shareModal = $('#share-modal');
    dragging = new Draggabilly(svg[0]);

    dragging.disable(); // enabled with panning fn


    var length, speed;

    /* pathsArray is a regular array, paths is the jQuery set */
    pathsArray = (paths = svg.find('path')
      .click( function () {

        ctrl.fill(this)
        return false;

      }).on('mousedown', function () {

        dragColoring = true;
        if (konamiInterval) clearInterval(konamiInterval); // kill the konami animation

      }).on('mouseover', function () {

        if (dragColoring) ctrl.fill(this);

      }).each( function (i) {

        data[i] = 0; // set default to white;

        length = this.getTotalLength();
        speed = length < 1500 ? 1500 : Math.floor(length);

        $(this)
          .css('transition', 'none')
          .attr('data-speed', speed)
          .attr('data-length', length)
          .attr('stroke-dashoffset', length)
          .attr('stroke-dasharray', length + ' ' + length);

      })).toArray();


    $(document)
      .on('keydown', function (e) {
        /* watch for the konami code */ 
        ctrl.konamiFreakOut(e.keyCode);

      }).on('mouseup', function (e) {

        dragColoring = false;

      });


    /* create swatches + assign color & click */ 
    var palette = $('#palette'),
        copyColors = colors.slice(0), 
        color;

    while (color = copyColors.pop(), copyColors.length) {

      palette.append( makeSwatch(color).click( function (e) {

        selectedColor = $(this).data('color');

        container // removes possibility of hand cursor, replaces with pointer
          .addClass('painting')
          .removeClass('hand')
          .unbind('mousedown');

        if (dragging && dragging.isEnabled) dragging.disable();
        
        return false;

      }));
    };

    function makeSwatch (color) {
      /* helper func combines html segments with color to make divs */ 
      return jQuery( (swatchSegments.map( function (s) {

        return s += (s != s[s.length-1] ? color : '');

      })).join('') );
    };


    /* loads colors if visiting with a previously shared link */
    if (window.location.hash) {

      urlColors = window.location.hash.slice(1, paths.length).split('');

      paths.each( function (i) { 

        /* if the url contains a valid color for each path, assign it to the dom & persist it in local data */
        if (colors.indexOf(colors[urlColors[i]]) > 0) {

          data[i] = urlColors[i];
          paths[i].style.fill = colors[urlColors[i]];

        }
      });
    }

    return ctrl;

  })();

};
