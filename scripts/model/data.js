'use strict';
(function(module) {
  var traffic = {};
  traffic.allTraffic = [];
  traffic.northVals = [];
  traffic.southVals = [];
  traffic.limitDates = false;
  var total = 0;
  var avg = 0;
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
    console.log(traffic.allTraffic);
    console.log('after turning each into a Traffic object');
  };
  //
  // ?$where=date%3E=%272016-10-10T00:00.000%27%20AND%20date%3C=%272016-10-11T00:00.000%27

  traffic.requestTraffic = function(callback) {
    total = 0;

    var add;
    if (traffic.limitDates){
      add = '?$where=date%3E=%27' + traffic.date1.getFullYear() + '-' + (traffic.date1.getMonth() + 1) + '-' + traffic.date1.getDate()
      + 'T00:00.000%27%20AND%20date%3C=%27' + traffic.date2.getFullYear() + '-' + (traffic.date2.getMonth() + 1) + '-' + traffic.date2.getDate() + 'T23:00.000%27';
    } else {
      add = '?$where=date>=%272013-01-01T00:00.000%27';
    }
    var limit = '&$limit=50000';
    var order = '&$order=date';
    $.ajax({
      url: 'https://data.seattle.gov/resource/4xy5-26gy.json' + add + order,
      type: 'GET',
      success: function(data){
        console.log(data);
        traffic.loadAll(data);
        callback();
      }
    });
  };


  traffic.withTheAttribute = function(myAttr) {
    return traffic.allTraffic.filter(function(aRepo) {
      return aRepo[myAttr];
    });
  };

  traffic.getHour = function(dateTime){
    return parseInt(moment(dateTime).format('H'));
  };


  traffic.calcNumbers = function(){
    traffic.numberOfDays = (traffic.allTraffic.length / 24);
    traffic.hourlyArrayAll = Array(24).fill(0);
    traffic.hourlyArrayNb = Array(24).fill(0);
    traffic.hourlyArraySb = Array(24).fill(0);
    traffic.hourlyAvgAll = Array(24).fill(0);
    traffic.hourlyAvgNb = Array(24).fill(0);
    traffic.hourlyAvgSb = Array(24).fill(0);


    traffic.allTraffic.forEach(function(data, idx){
      var nb = (isNaN(data.fremont_bridge_nb)) ? 0 : parseInt(data.fremont_bridge_nb);
      var sb = (isNaN(data.fremont_bridge_sb)) ? 0 : parseInt(data.fremont_bridge_sb);

      console.log(nb + sb, ' : nb + sb', traffic.getHour(data.date), ' : traffic.getHour(data.date)');
      // console.log(traffic.hourlyArray[traffic.getHour(data.date)]);

      traffic.hourlyArrayAll[traffic.getHour(data.date)] += (nb + sb);
      traffic.hourlyArrayNb[traffic.getHour(data.date)] += (nb);
      traffic.hourlyArraySb[traffic.getHour(data.date)] += (sb);

      traffic.hourlyArrayAll.forEach(function(data, idx){
        traffic.hourlyAvgAll[idx] = (traffic.hourlyArrayAll[idx] / traffic.numberOfDays).toFixed(2);
        traffic.hourlyAvgNb[idx] = traffic.hourlyArrayNb[idx] / traffic.numberOfDays.toFixed(2);
        traffic.hourlyAvgSb[idx] = traffic.hourlyArraySb[idx] / traffic.numberOfDays.toFixed(2);
      });

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
        peak.nb = nb;
        peak.sb = sb;
        peak.peak = hourlyTotal;
        peak.date = data.date;
      }
      if (total === null){
        alert(idx);
      }
      total += hourlyTotal;
      avg = total / (idx + 1);
    });
    console.log(total, ' is total');
    console.log(avg, ' is avg');
    console.log(peakNB, ' is peakNB');
    console.log(peakSB, ' is peakSB');
    console.log(peak, 'is overall Peak');
  };


  //var date = moment(traffic.allTraffic[0].date).format('h-DD-MM-YYYY');


  module.traffic = traffic;
})(window);
