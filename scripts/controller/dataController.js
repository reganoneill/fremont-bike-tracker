(function(module) {
  var statsController = {};

  statsController.reveal = function() {
    /* TODO: Use your DOM skills to reveal only the about section! */
    //MAKE SURE THIS WORKS...
    $('#projects').hide();
    $('#about').hide();
    $('#stats').show();
  };

  module.statsController = statsController;
})(window);
