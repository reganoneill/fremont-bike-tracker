'use strict';
(function(module) {
  var repos = {};
  repos.allRepos=[];
  repos.northVals = [];
  repos.southVals = [];

  repos.requestRepos = function(callback) {
    /* TODO: How would you like to fetch your repos? Someone say AJAX?!
      Do not forget to call the callback! */
      //DONE
    $.getJSON({
  var traffic = {};
  traffic.allTraffic = [];
  traffic.northVals = [];
  traffic.southVals = [];
  var total = 0;
  var peakNB = {};
  var peakSB = {nb:0,sb:0};
  var peak = {peak:0};

});
};

  traffic.requestTraffic = function(callback) {

    $.ajax({
      url: 'https://data.seattle.gov/resource/4xy5-26gy.json',
      type: 'GET',
      success: function(data, message){
        console.log(message);
        traffic.allTraffic = data;
        callback();
        console.log(data);
        console.log('end data');
        // console.log(data.filter(function(a){
        //   return parseInt(a.fremont_bridge_nb) >= 375 && parseInt(a.fremont_bridge_sb) >= 300;
        // }));
      }
    });

  };

  traffic.withTheAttribute = function(myAttr) {
    return traffic.allTraffic.filter(function(aRepo) {
      return aRepo[myAttr];
    });
  };

  traffic.calcNumbers = function(){
    traffic.allTraffic.forEach(function(data){
      var nb = parseInt(data.fremont_bridge_nb);
      var sb = parseInt(data.fremont_bridge_sb);
      if (nb > peakNB.nb){
        peakNB = data;
        console.log(peakNB);
      }
      var hourlyTotal = nb + sb;
      total += hourlyTotal;
    });
    console.log(total);
  };


  module.traffic = traffic;
})(window);
