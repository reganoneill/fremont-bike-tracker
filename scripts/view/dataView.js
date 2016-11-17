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
    var todaysDate = new Date();
    var lastMonth = todaysDate.getMonth();
    var theCurrentYear = todaysDate.getFullYear();
    var dateFormat = 'mm/dd/yy',
      from = $( '#from' )
        .datepicker({
          defaultDate: '+1w',
          changeMonth: true,
          numberOfMonths: 1,
          minDate: new Date('01/01/2013'),
          maxDate: new Date(theCurrentYear, (lastMonth)),
          constrainInput: true
          ////////end date constraints///////
        })
        .on( 'change', function() {
          traffic.date1 = getDate(this);
          to.datepicker( 'option', 'minDate', getDate( this ) );
        }),
      to = $( '#to' ).datepicker({
        defaultDate: '+1w',
        changeMonth: true,
        numberOfMonths: 1,
        minDate: new Date('01/01/2013'),
        maxDate: new Date(theCurrentYear, (lastMonth)),
        constrainInput: true
      })
      .on( 'change', function() {
        traffic.date2 = getDate(this);
        from.datepicker( 'option', 'maxDate', getDate( this ) );
      });

    function getDate( element ) {
      var date;
      try {
        date = $.datepicker.parseDate( dateFormat, element.value );

      } catch( error ) {
        date = null;
      }

      return date;
    }
  };

// end date range picker from jqueryui.com
  traffic.displayGeneralStats = function(){
    var t = traffic.submitCount;
    $('#generalStats').empty().append( '<br><hr><h2>General Statistics</h2><h4>Selected dates from <strong><i>' + traffic.generalDataToDisplay[t].startDate + '<i><strong> to <strong><i>' + traffic.generalDataToDisplay[t].endDate + '<i><strong></h4><h4>Which accounts for ' + traffic.generalDataToDisplay[t].numberOfDays + ' days</h4><h4>Total: ' + traffic.generalDataToDisplay[t].total + ' bikers</h4><h4>Average: ' + traffic.generalDataToDisplay[t].average + ' per hour</h4><h4>Peak Northbound Traffic: ' + traffic.generalDataToDisplay[t].peakNB.nb + ' bikers on ' + traffic.generalDataToDisplay[t].peakNB.date + '</h4><h4>Peak SouthBound Traffic: ' + traffic.generalDataToDisplay[t].peakSB.sb + ' bikers on ' + traffic.generalDataToDisplay[t].peakSB.date + '</h4><h4>Peak Overall Traffic: ' + traffic.generalDataToDisplay[t].peak.peak + ' bikers on ' + traffic.generalDataToDisplay[t].peak.date + '</h4><br><hr>');
  };

  traffic.datePick();

  traffic.loadImmediately = function(){
    var obj = {};
    var upToDate = new Date();
    var upToDateYear = upToDate.getFullYear();
    var upToDateMonth = upToDate.getMonth();
    var addToQueryString = '?$where=date>=%27' + upToDateYear + '-' + upToDateMonth + '-01T00:00.000%27';
    $.ajax({
      url: 'https://data.seattle.gov/resource/4xy5-26gy.json' + addToQueryString,
      type: 'GET',
      success: function(data, message, xhr){
        if (!localStorage.lastUpdated || localStorage.lastUpdated !== xhr.getResponseHeader('Last-Modified')){
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
       }//end if
        else{
         var displayFirstLoadVals = JSON.parse(localStorage.recentStats);
          $('.initial-monthly-vals').append('Total bike crossings from the previous month ( ' + upToDateMonth + '/' + upToDateYear + ' ) : ' + displayFirstLoadVals.total + '</br> Total northbound bikers: ' + displayFirstLoadVals.totalNorth + '</br> Total southbound bikers: ' + displayFirstLoadVals.totalSouth);
          console.log('all good! we are up to date');
      }//end else

    }//end success
  });//end ajax request

//this works fine but isn't what the original function was made for
  $('.initial-allTime-vals').append('Total Bike Crossings Since 1 January 2013 (the first full year data started to be collected): ' + traffic.initialObj.total + '</br> Total Northbound: ' + traffic.initialObj.totalNorth + '</br> Total Southbound: ' + traffic.initialObj.totalSouth);

};
// traffic.loadImmediately();


  module.trafficView = trafficView;
})(window);
