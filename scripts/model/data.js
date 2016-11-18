'use strict';
(function(module) {
  var traffic = {};
  traffic.date1 = '', traffic.date2 = '';
  traffic.allTraffic = [];
  traffic.limitDates = false;
  traffic.limitDates2 = false;
  traffic.submitCount = -1;
  var total = 0;
  var avg = 0;
  var peakNB = {nb:0, sb:0};
  var peakSB = {nb:0, sb:0};
  var peak = {peak:0};

  function Traffic (opts) {
    this.date = opts.date,
    this.fremont_bridge_nb = parseInt(opts.fremont_bridge_nb),
    this.fremont_bridge_sb = parseInt(opts.fremont_bridge_sb),
    this.total = parseInt(opts.fremont_bridge_nb) + parseInt(opts.fremont_bridge_sb);
  };

//inputData is the data from the API. This function sorts it, assigns each Object
//to a Traffic object, and puts them all in an array called traffic.allTraffic.
  traffic.loadAll = function(inputData) {
    traffic.allTraffic = inputData.sort(function(a,b) {
      return (new Date(b.date)) - (new Date(a.date));
    }).map(function(ele) {
      return new Traffic(ele);
    });
    // console.log(traffic.allTraffic);
  };

//this function makes an ajax call to the API - specifically to our starting dat (jan 01 2013)
//
  traffic.initialValues = function(){
    var obj = {};
    var add = '?$where=date>=%272013-01-01T00:00.000%27';
    var limit = '&$limit=50000';
    var order = '&$order=date';
    $.ajax({
      url: 'https://data.seattle.gov/resource/4xy5-26gy.json' + add + limit + order,
      type: 'GET',
      success: function(data, message, xhr){
        $('.initial-allTime-vals').empty();
        var lastUpdated = xhr.getResponseHeader('Last-Modified');
        traffic.loadAll(data);
        var totalNb = 0;
        var totalSb = 0;
        traffic.allTraffic.forEach(function(data){
          var nb = (isNaN(data.fremont_bridge_nb)) ? 0 : parseInt(data.fremont_bridge_nb);
          var sb = (isNaN(data.fremont_bridge_sb)) ? 0 : parseInt(data.fremont_bridge_sb);
          totalNb += nb;
          totalSb += sb;
        });
        var totalAll = totalNb + totalSb;
        obj = {
          total : totalAll,
          totalNorth : totalNb,
          totalSouth : totalSb
        };
        localStorage.setItem('lastUpdated', lastUpdated);
        localStorage.setItem('initialObj', JSON.stringify(obj));
        traffic.initialObj = obj;
        $('.initial-allTime-vals').append('Total Bike Crossings Since 1 January 2013 (the first full year data started to be collected): ' + traffic.initialObj.total + '</br> Total Northbound: ' + traffic.initialObj.totalNorth + '</br> Total Southbound: ' + traffic.initialObj.totalSouth);
      }
    });// return traffic.initialObj;
};
traffic.initialValues2 = function(){
      var monthObj = {};
      var upToDate = new Date();
      var upToDateYear = upToDate.getFullYear();
      var upToDateMonth = upToDate.getMonth();
      var addToQueryString = '?$where=date>=%27' + upToDateYear + '-' + upToDateMonth + '-01T00:00.000%27';
      $.ajax({
        url: 'https://data.seattle.gov/resource/4xy5-26gy.json' + addToQueryString,
        type: 'GET',
        success: function(data, message, xhr){
          $('.initial-monthly-vals').empty();
          // if (!localStorage.lastUpdated || localStorage.lastUpdated != xhr.getResponseHeader('Last-Modified')){
            traffic.loadAll(data);
            var totalNb = 0;
            var totalSb = 0;
            traffic.allTraffic.forEach(function(data){
              var nb = (isNaN(data.fremont_bridge_nb)) ? 0 : parseInt(data.fremont_bridge_nb);
              var sb = (isNaN(data.fremont_bridge_sb)) ? 0 : parseInt(data.fremont_bridge_sb);
              totalNb += nb;
              totalSb += sb;
            });
            var totaltotalCurrentBikers = totalNb + totalSb;
            monthObj = {
              total : totaltotalCurrentBikers,
              totalNorth : totalNb,
              totalSouth : totalSb
            };
            console.log('trying here');
            localStorage.setItem('recentStats', JSON.stringify(monthObj));

            var displayFirstLoadVals = JSON.parse(localStorage.recentStats);
            $('.initial-monthly-vals').append('Total bike crossings from the previous month ( ' + upToDateMonth + '/' + upToDateYear + ' ) : ' + displayFirstLoadVals.total + '</br> Total northbound bikers: ' + displayFirstLoadVals.totalNorth + '</br> Total southbound bikers: ' + displayFirstLoadVals.totalSouth);
            console.log('all good! we are up to date');

           // }//end else
        } //end success
      }); //end 2nd ajax request
    } //end method

  traffic.getInitial = function() {
    var initialObj = {};
    var limit = '?$limit=1';
    //if this exists, do this
    if(localStorage.initialObj){
      $.ajax({
        url: 'https://data.seattle.gov/resource/4xy5-26gy.json' + limit,
        type: 'GET',
        success: function(data, message, xhr){
          var lastUpdated = xhr.getResponseHeader('Last-Modified');
          if (!localStorage.lastUpdated || lastUpdated !== localStorage.lastUpdated){
            console.log('the data has changed since we were last here');
            traffic.initialObj = traffic.initialValues();
            // localStorage.setItem('initialObj', JSON.stringify(initialObj));
            localStorage.setItem('lastUpdated', lastUpdated);
          } else {
            traffic.initialObj = JSON.parse(localStorage.initialObj);
          }
        }//end success
      });//end ajax
    } // end if
    else {
      initialObj = traffic.initialValues();
    }
    return initialObj;
  };//end of getInitial method

  traffic.requestTraffic = function(callback) {
    total = 0;
    var add;
    if (traffic.limitDates){
      if(traffic.limitDates2){
        add = '?$where=date%3E=%27' + traffic.date1.getFullYear() + '-' + (traffic.date1.getMonth() + 1) + '-' + traffic.date1.getDate()
        + 'T00:00.000%27%20AND%20date%3C=%27' + traffic.date2.getFullYear() + '-' + (traffic.date2.getMonth() + 1) + '-' + traffic.date2.getDate() + 'T23:00.000%27';
      } else {
        add = '?$where=date%3E=%27' + traffic.date1.getFullYear() + '-' + (traffic.date1.getMonth() + 1) + '-' + traffic.date1.getDate()
        + 'T00:00.000%27';
        traffic.date2 = 'Present';
      }
    } else {
      if(traffic.limitDates2){
        add = '?$where=date>=%272013-01-01T00:00.000%27%20AND%20date%3C=%27' + traffic.date2.getFullYear() + '-' + (traffic.date2.getMonth() + 1) + '-' + traffic.date2.getDate() + 'T23:00.000%27';
        traffic.date1 = '01 January 2013';
      } else {
        add = '?$where=date>=%272016-10-01T00:00.000%27';
        traffic.date1 = '01 January 2013';
        traffic.date2 = 'Present';
      }
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


  function DateType(date){
    this.fremont_bridge_nb = 0,
    this.fremont_bridge_sb = 0,
    this.total = 0;

    this.date = date;
  };
  DateType.prototype.add = function(direction, value){
    if (direction === 'nb'){
      this.fremont_bridge_nb += value;
      this.total += value;
    }else {
      this.fremont_bridge_sb += value;
      this.total += value;
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

    var startDate = (traffic.date1 === '01 January 2013') ? traffic.date1 : moment(traffic.date1).format('DD MMMM YYYY');
    var endDate = (traffic.date2 === 'Present') ? traffic.date2 : moment(traffic.date2).format('DD MMMM YYYY');

    var workingDay = new DateType(moment(traffic.allTraffic[0].date).format('MM-DD-YYYY:ddd'));
    var workingMonth = new DateType(moment(traffic.allTraffic[0].date).format('MM-YYYY'));
    var workingYear = new DateType(moment(traffic.allTraffic[0].date).format('YYYY'));

    traffic.allTraffic.forEach(function(data, idx){
      var date = moment(traffic.allTraffic[idx].date).format('MM-DD-YYYY:ddd');
      var month = moment(traffic.allTraffic[idx].date).format('MM-YYYY');
      var year = moment(traffic.allTraffic[idx].date).format('YYYY');

      var nb = (isNaN(data.fremont_bridge_nb)) ? 0 : parseInt(data.fremont_bridge_nb);
      var sb = (isNaN(data.fremont_bridge_sb)) ? 0 : parseInt(data.fremont_bridge_sb);

      traffic.hourlyArrayAll[traffic.getHour(data.date)] += (nb + sb);
      traffic.hourlyArrayNb[traffic.getHour(data.date)] += (nb);
      traffic.hourlyArraySb[traffic.getHour(data.date)] += (sb);

      traffic.hourlyArrayAll.forEach(function(data, idx){
        traffic.hourlyAvgAll[idx] = (traffic.hourlyArrayAll[idx] / traffic.numberOfDays).toFixed(2);
        traffic.hourlyAvgNb[idx] = (traffic.hourlyArrayNb[idx] / traffic.numberOfDays).toFixed(2);
        traffic.hourlyAvgSb[idx] = (traffic.hourlyArraySb[idx] / traffic.numberOfDays).toFixed(2);
      });

//adding up all values of nb and sb in date range
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
    traffic.monthlyAverageData(traffic.monthlyAverages(traffic.monthlyArray));
    traffic.dailyAverageData(traffic.dailyAverages(traffic.dailyArray));
    traffic.hourlyAverageData(traffic.hourlyAvgAll, traffic.hourlyAvgNb, traffic.hourlyAvgSb);
    traffic.generalDataToDisplay.push(new GeneralDataObj(traffic.numberOfDays, total, avg, peakNB,
       peakSB, peak, startDate, endDate));
    traffic.submitCount++;
    traffic.displayGeneralStats();
    charts.drawCharts();
  }; //end calcNumbers method
/////////////////////////////General Data//////////////////////////////////////
  traffic.generalDataToDisplay = [];
  function GeneralDataObj(nod, tot, avg, pNb, pSb, p, start, end){
    this.numberOfDays = nod,
    this.total = tot,
    this.average = avg,
    this.peakNB = pNb,
    this.peakSB = pSb,
    this.peak = p;
    this.startDate = start;
    this.endDate = end;
  };

/////////////////////////////Hourly Data Average//////////////////////////////////
  function HourlyDataObj(data){
    this.hour = data.hour;
    this.avg = data.avg;
    this.avgNb = data.avgNb;
    this.avgSb = data.avgSb;
  }
  traffic.hourlyAverageData = function(data, data2, data3){
    traffic.hourlyDataToDisplay = [];
    var hoursOfDay = ['12AM','1AM','2AM','3AM','4AM','5AM','6AM','7AM','8AM','9AM','10AM','11AM',
    '12PM','1PM','2PM','3PM','4PM','5PM','6PM','7PM','8PM','9PM','10PM','11PM'];
    var dataObj = {};
    data.forEach(function(eachHour, idx){
      dataObj.hour = hoursOfDay[idx];
      dataObj.avg = parseInt(eachHour);
      dataObj.avgNb = parseInt(data2[idx]);
      dataObj.avgSb = parseInt(data3[idx]);
      traffic.hourlyDataToDisplay.push(new HourlyDataObj(dataObj));
    });
  };
//////////////////////////Days of the Week Averages////////////////////////////////
  traffic.getHour = function(dateTime){
    return parseInt(moment(dateTime).format('H'));
  };
  traffic.dailyAverages = function(data){
    var dayByName = Array(7).fill(0);
    var dayByNameNb = Array(7).fill(0);
    var dayByNameSb = Array(7).fill(0);
    var dayCount = Array(7).fill(0);
    data.forEach(function(cur){
      var dayName = cur.date.slice(11,14);
      switch (dayName) {
      case 'Sun':
        dayByName[0] += (parseInt(cur.fremont_bridge_sb) + parseInt(cur.fremont_bridge_nb));
        dayByNameNb[0] += parseInt(cur.fremont_bridge_nb);
        dayByNameSb[0] += parseInt(cur.fremont_bridge_sb);
        dayCount[0]++;
        break;
      case 'Mon':
        dayByName[1] += (parseInt(cur.fremont_bridge_sb) + parseInt(cur.fremont_bridge_nb));
        dayByNameNb[1] += parseInt(cur.fremont_bridge_nb);
        dayByNameSb[1] += parseInt(cur.fremont_bridge_sb);
        dayCount[1]++;
        break;
      case 'Tue':
        dayByName[2] += (parseInt(cur.fremont_bridge_sb) + parseInt(cur.fremont_bridge_nb));
        dayByNameNb[2] += parseInt(cur.fremont_bridge_nb);
        dayByNameSb[2] += parseInt(cur.fremont_bridge_sb);
        dayCount[2]++;
        break;
      case 'Wed':
        dayByName[3] += (parseInt(cur.fremont_bridge_sb) + parseInt(cur.fremont_bridge_nb));
        dayByNameNb[3] += parseInt(cur.fremont_bridge_nb);
        dayByNameSb[3] += parseInt(cur.fremont_bridge_sb);
        dayCount[3]++;
        break;
      case 'Thu':
        dayByName[4] += (parseInt(cur.fremont_bridge_sb) + parseInt(cur.fremont_bridge_nb));
        dayByNameNb[4] += parseInt(cur.fremont_bridge_nb);
        dayByNameSb[4] += parseInt(cur.fremont_bridge_sb);
        dayCount[4]++;
        break;
      case 'Fri':
        dayByName[5] += (parseInt(cur.fremont_bridge_sb) + parseInt(cur.fremont_bridge_nb));
        dayByNameNb[5] += parseInt(cur.fremont_bridge_nb);
        dayByNameSb[5] += parseInt(cur.fremont_bridge_sb);
        dayCount[5]++;
        break;
      case 'Sat':
        dayByName[6] += (parseInt(cur.fremont_bridge_sb) + parseInt(cur.fremont_bridge_nb));
        dayByNameNb[6] += parseInt(cur.fremont_bridge_nb);
        dayByNameSb[6] += parseInt(cur.fremont_bridge_sb);
        dayCount[6]++;
        break;
      default:
      }
    });
    dayByName.forEach(function(data, idx){
      dayByName[idx] = (dayByName[idx] / dayCount[idx]);
      dayByNameNb[idx] = (dayByNameNb[idx] / dayCount[idx]);
      dayByNameSb[idx] = (dayByNameSb[idx] / dayCount[idx]);
    });
    var allArray = [dayByName, dayByNameNb, dayByNameSb];
    return allArray;
  };

  function AvgDataObj(data){
    this.day = data.day,
    this.avg = data.avg;
    this.avgNb = data.avgNb;
    this.avgSb = data.avgSb;
  };

  traffic.dailyAverageData = function(data){
    traffic.dailyDataToDisplay = [];
    var daysOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var dataObj = {};
    data[0].forEach(function(eachDay, idx){
      dataObj.day = daysOfWeek[idx];
      dataObj.avg = parseInt(eachDay);
      dataObj.avgNb = parseInt(data[1][idx]);
      dataObj.avgSb = parseInt(data[2][idx]);
      traffic.dailyDataToDisplay.push(new AvgDataObj(dataObj));
    });
  };
//////////////////////////////////////////////////////////////////////////////////

  traffic.monthlyAverages = function(data){
    var months = Array(12).fill(0);
    var monthsNb = Array(12).fill(0);
    var monthsSb = Array(12).fill(0);
    var monthCount = Array(12).fill(0);
    data.forEach(function(eachMonth){
      var monthByNum = (parseInt(eachMonth.date.slice(0,2) - 1));
      months[monthByNum] += (parseInt(eachMonth.fremont_bridge_sb) + parseInt(eachMonth.fremont_bridge_nb));
      monthsNb[monthByNum] += parseInt(eachMonth.fremont_bridge_nb);
      monthsSb[monthByNum] += parseInt(eachMonth.fremont_bridge_sb);
      monthCount[monthByNum]++;
    });
    months.forEach(function(data, idx){
      months[idx] = (months[idx] / monthCount[idx]);
    });
    var allArray = [months, monthsNb, monthsSb];
    return allArray;
  };

  function AvgMonthlyObj(data){
    this.month = data.month;
    this.avg = data.avg;
    this.avgNb = data.avgNb;
    this.avgSb = data.avgSb;
  }

  traffic.monthlyAverageData = function(data){
    traffic.monthlyDataToDisplay = [];
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var dataObj = {};
    data[0].forEach(function(eachMonth, idx){
      dataObj.month = months[idx];
      dataObj.avg = parseInt(eachMonth);
      dataObj.avgNb = parseInt(data[1][idx]);
      dataObj.avgSb = parseInt(data[2][idx]);
      traffic.monthlyDataToDisplay.push(new AvgMonthlyObj(dataObj));
    });

  };



//////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////
  traffic.initialObj = traffic.getInitial();
  traffic.initialValues2();
  traffic.initialValues();
  module.traffic = traffic;
})(window);
