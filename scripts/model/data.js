'use strict';
(function(module) {
  var traffic = {};
  traffic.allTraffic = [];
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
  };

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
      url: 'https://data.seattle.gov/resource/4xy5-26gy.json' + add + limit + order,
      type: 'GET',
      success: function(data){
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

  function Results(nod, tot, avg, pNb, pSb, p, hA, hN, hS, avgA, avgN, avgS, dA, mA, yA){
    this.numberOfDays = nod,
    this.total = tot,
    this.average = avg,
    this.peakNB = pNb,
    this.peakSB = pSb,
    this.peak = p,
    this.hourlyArrayAll = hA,
    this.hourlyArrayNb = hN,
    this.hourlyArraySb = hS,
    this.hourlyAvgAll = avgA,
    this.hourlyAvgNb = avgN,
    this.hourlyAvgSb = avgS;
    this.dailyArray = dA;
    this.monthlyArray = mA
    this.yearlyArray = yA;
  };
  traffic.allResults = [];


  function DateType(date){
    this.fremont_bridge_nb = 0,
    this.fremont_bridge_sb = 0,
    this.date = date;
  };
  DateType.prototype.add = function(direction, value){
    if (direction === 'nb'){
      this.fremont_bridge_nb += value;
    }else {
      this.fremont_bridge_sb += value;
    }
  };

  traffic.calcNumbers = function(){
    traffic.numberOfDays = (traffic.allTraffic.length / 24);
    traffic.hourlyArrayAll = Array(24).fill(0);
    traffic.hourlyArrayNb = Array(24).fill(0);
    traffic.hourlyArraySb = Array(24).fill(0);
    traffic.hourlyAvgAll = Array(24).fill(0);
    traffic.hourlyAvgNb = Array(24).fill(0);
    traffic.hourlyAvgSb = Array(24).fill(0);
    traffic.dailyArray = [];
    traffic.monthlyArray = [];
    traffic.yearlyArray = [];

    var workingDay = new DateType(moment(traffic.allTraffic[0].date).format('DD-MM-YYYY'));
    var workingMonth = new DateType(moment(traffic.allTraffic[0].date).format('MM-YYYY'));
    var workingYear = new DateType(moment(traffic.allTraffic[0].date).format('YYYY'));

    traffic.allTraffic.forEach(function(data, idx){
      var date = moment(traffic.allTraffic[idx].date).format('DD-MM-YYYY');
      var month = moment(traffic.allTraffic[idx].date).format('MM-YYYY');
      var year = moment(traffic.allTraffic[idx].date).format('YYYY');
      var nb = (isNaN(data.fremont_bridge_nb)) ? 0 : parseInt(data.fremont_bridge_nb);
      var sb = (isNaN(data.fremont_bridge_sb)) ? 0 : parseInt(data.fremont_bridge_sb);

      traffic.hourlyArrayAll[traffic.getHour(data.date)] += (nb + sb);
      traffic.hourlyArrayNb[traffic.getHour(data.date)] += (nb);
      traffic.hourlyArraySb[traffic.getHour(data.date)] += (sb);

      traffic.hourlyArrayAll.forEach(function(data, idx){
        traffic.hourlyAvgAll[idx] = (traffic.hourlyArrayAll[idx] / traffic.numberOfDays).toFixed(2);
        traffic.hourlyAvgNb[idx] = traffic.hourlyArrayNb[idx] / traffic.numberOfDays.toFixed(2);
        traffic.hourlyAvgSb[idx] = traffic.hourlyArraySb[idx] / traffic.numberOfDays.toFixed(2);
      });

      if (date === workingDay.date){
        workingDay.add('nb', nb);
        workingDay.add('sb', sb);
      } else {
        traffic.dailyArray.push(workingDay);
        workingDay = new DateType(date);
        workingDay.add('nb', nb);
        workingDay.add('sb', sb);
      }

      if (month === workingMonth.date){
        workingMonth.add('nb', nb);
        workingMonth.add('sb', sb);
      } else {
        traffic.monthlyArray.push(workingMonth);
        workingMonth = new DateType(month);
        workingMonth.add('nb', nb);
        workingMonth.add('sb', sb);
      }
      if (year === workingYear.date){
        workingYear.add('nb', nb);
        workingYear.add('sb', sb);
      } else {
        traffic.yearlyArray.push(workingYear);
        workingYear = new DateType(year);
        workingYear.add('nb', nb);
        workingYear.add('sb', sb);
      }


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
      avg = (total / (idx + 1)).toFixed(2);
    });
    traffic.dailyArray.push(workingDay);
    traffic.monthlyArray.push(workingMonth);
    traffic.yearlyArray.push(workingYear);
    traffic.allResults.push(new Results(traffic.numberOfDays, total, avg, peakNB,
       peakSB, peak, traffic.hourlyArrayAll ,traffic.hourlyArrayNb, traffic.hourlyArraySb,
        traffic.hourlyAvgAll, traffic.hourlyAvgNb, traffic.hourlyAvgSb, traffic.dailyArray,
         traffic.monthlyArray, traffic.yearlyArray));
  };


  //var date = moment(traffic.allTraffic[0].date).format('h-DD-MM-YYYY');


  module.traffic = traffic;
})(window);
