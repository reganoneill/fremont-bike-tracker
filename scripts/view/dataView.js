'use strict';
(function(module) {
  var trafficView = {};

  var trafficCompiler = Handlebars.compile($('#traffic-template').html());

  trafficView.renderTraffic = function() {
    $('#stats').empty().append(
      traffic.allTraffic

      .map(trafficCompiler)
    );
  };

  traffic.requestTraffic(trafficView.renderTraffic);


  module.trafficView = trafficView;
})(window);
