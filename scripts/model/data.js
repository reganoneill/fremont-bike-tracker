'use strict';
(function(module) {
  var traffic = {};
  traffic.allTraffic = [];
  traffic.northVals = [];
  traffic.southVals = [];
  var total = 0;
  var peakNB = {nb:0, sb:0};
  var peakSB = {nb:0, sb:0};
  var peak = {peak:0};

  function Traffic (opts) {
    Object.keys(opts).forEach(function(prop) {
      this[prop] = opts[prop];
    }, this);
  };

  traffic.loadAll = function(inputData) {
    traffic.allTraffic = inputData.sort(function(a,b) {
      return (new Date(b.date)) - (new Date(a.date));
    }).map(function(ele) {
      return new Traffic(ele);
    });
  };
  traffic.requestTraffic = function(callback) {

    $.ajax({
      url: 'https://data.seattle.gov/resource/4xy5-26gy.json',
      type: 'GET',
      success: function(data){
        callback();
        console.log(data);
        traffic.loadAll(data);
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
      // console.log(peakNB.nb, ' is peak - ', nb, ' is nb');
      // console.log(peakSB.sb, ' is peak - ', sb, ' is Sb');
      if (nb > peakNB.nb){
        peakNB.nb = nb;
        peakNB.sb = sb;
        peakNB.date = data.date;
      }
      if (sb > peakSB.sb){
        peakSB.nb = nb;
        peakSB.sb = sb;
        peakSB.date = data.date;
      }
      var hourlyTotal = nb + sb;
      if (hourlyTotal > peak.peak){
        peak.peak = hourlyTotal;
        peak.date = data.date;
      }
      total += hourlyTotal;
    });
    console.log(total, ' is total');
    console.log(peakNB, ' is peakNB');
    console.log(peakSB, ' is peakSB');
    console.log(peak, 'is overall Peak');
  };


  module.traffic = traffic;
})(window);
