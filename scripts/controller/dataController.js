'use strict';
(function(module) {
  var dataController = {};

  dataController.reveal = function() {
    /* TODO: Use your DOM skills to reveal only the about section! */
    //MAKE SURE THIS WORKS...
    $('#projects').hide();
    $('#about').hide();
    $('#stats').show();
  };

  module.dataController = dataController;
})(window);
