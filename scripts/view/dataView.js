'use strict';
(function(module) {
  var trafficView = {};
  traffic.date1 = '', traffic.date2 = '';

  // var trafficCompiler = Handlebars.compile($('#traffic-template').html());

  $('#submit-dates').on('click', function(e){
    e.preventDefault();
    if ($('input#from').val() === ''){
      traffic.limitDates = false;
    }
    else {
      traffic.limitDates = true;
    }
    if ($('input#to').val() === ''){
      traffic.limitDates2 = false;
    }
    else {
      traffic.limitDates2 = true;
    }
    traffic.requestTraffic(traffic.calcNumbers);

  });

  traffic.datePick = function(){
    var dateFormat = 'mm/dd/yy',
      // var dateFormat = 'yy/mm/dd',
      from = $( '#from' )
        .datepicker({
          defaultDate: '+1w',
          changeMonth: true,
          numberOfMonths: 1
        })
        .on( 'change', function() {
          traffic.date1 = getDate(this);
          to.datepicker( 'option', 'minDate', getDate( this ) );
        }),
      to = $( '#to' ).datepicker({
        defaultDate: '+1w',
        changeMonth: true,
        numberOfMonths: 1
      })
      .on( 'change', function() {
        traffic.date2 = getDate(this);
        from.datepicker( 'option', 'maxDate', getDate( this ) );
      });

    function getDate( element ) {
      var date;
      try {
        date = $.datepicker.parseDate( dateFormat, element.value );
        // console.log(date);
        // console.log(element.value);
        // console.log(date.getDate());
        // console.log(date.getMonth());
        // console.log(date.getFullYear());
        // var day= date.getDate();
        // var month = date.getMonth();
        // var year = date.getFullYear();
        // $('.first-date').append(day + ' ' + month + ' ' + year);
      } catch( error ) {
        date = null;
      }

      return date;
    }

    // var calTo = $('input#to').val();
    // console.log(calFrom);
    // console.log(calTo);
  };
// end date range picker from jqueryui.com
  traffic.displayGeneralStats = function(){
    var t = traffic.submitCount;
    $('#generalStats').empty().append( '<br><hr><h2>General Statistics</h2><h4>Selected dates from <strong><i>' + traffic.generalDataToDisplay[t].startDate +  '<i><strong> to <strong><i>' + traffic.generalDataToDisplay[t].endDate + '<i><strong></h4><h4>Which accounts for ' + traffic.generalDataToDisplay[t].numberOfDays + ' days</h4><h4>Total: ' + traffic.generalDataToDisplay[t].total + ' bikers</h4><h4>Average: ' + traffic.generalDataToDisplay[t].average + ' per hour</h4><h4>Peak Northbound Traffic: ' + traffic.generalDataToDisplay[t].peakNB.nb + ' bikers on ' + traffic.generalDataToDisplay[t].peakNB.date + '</h4><h4>Peak SouthBound Traffic: ' + traffic.generalDataToDisplay[t].peakSB.sb + ' bikers on ' + traffic.generalDataToDisplay[t].peakSB.date + '</h4><h4>Peak Overall Traffic: ' + traffic.generalDataToDisplay[t].peak.peak + ' bikers on ' + traffic.generalDataToDisplay[t].peak.date + '</h4><br><hr>');
  };

  traffic.datePick();

  //write functionality here which can take the three object properties
  //from localStorage's initialObj object and display them in the 'about'
  //section of the home page

  //var upToDate = (moment(localStorage.lastUpdated).format('YYYY');
  // var add = '?$where=date>=%272013-01-01T00:00.000%27';
  // var limit = '&$limit=4000';
  // var order = '&$order=date';

  // var toDate1 = function(){
  //   var upToDate = new Date();
  //   console.log(upToDate.getFullYear());
  //   console.log(upToDate.getMonth());
  //   // console.log(upToDate);
  //   upToDate = (moment(upToDate).format('YYYY'));
  //   console.log(upToDate);
  // };
  // toDate1();

  traffic.loadImmediately = function(){
    // var obj = {};
    // var add = '?$where=date>=%272013-01-01T00:00.000%27';
    // var limit = '&$limit=4000';
    // var order = '&$order=date';
    var obj = {};
    var upToDate = new Date();
    var upToDateYear = upToDate.getFullYear();
    var upToDateMonth = upToDate.getMonth();
    var addToQueryString = '?$where=date>=%27' + upToDateYear + '-' + upToDateMonth + '-01T00:00.000%27';
    $.ajax({
      url: 'https://data.seattle.gov/resource/4xy5-26gy.json' + addToQueryString,
      type: 'GET',
      success: function(data, message, xhr){
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
        obj = {
          total : totaltotalCurrentBikers,
          totalNorth : totalNb,
          totalSouth : totalSb
        };
        localStorage.setItem('recentStats', JSON.stringify(obj));
      }
    });
    //now write functionality to make last month's date (gathered above) display in
    //the DOM.
    var displayFirstLoadVals = JSON.parse(localStorage.recentStats);
    console.log(displayFirstLoadVals.total);
    $('.initial-locStorage-vals').append('Total bike crossings from the previous month: ' + displayFirstLoadVals.total + '</br> Total northbound bikers: ' + displayFirstLoadVals.totalNorth + '</br> Total southbound bikers: ' + displayFirstLoadVals.totalSouth);
  };
  // traffic.loadImmediately();

  module.trafficView = trafficView;
})(window);
