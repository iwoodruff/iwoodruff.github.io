$(document).ready( function () {
  
  var facade = new Facade();

  $('#new').click( function () { facade.newDrawing(); return false; });
  $('#zoom-in').click( function () { facade.zoom('in'); return false; });
  $('#zoom-out').click( function () { facade.zoom('out'); return false; });
  $('#pan').click( function () { facade.pan(); return false; });
  $('#share').click( function () { facade.exportUrl(); return false; });
  $('#clear').click( function () { facade.clear(); return false; });

});