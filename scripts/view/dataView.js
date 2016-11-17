'use strict';
(function(module) {
  var trafficView = {};
  traffic.date1, traffic.date2;

  var trafficCompiler = Handlebars.compile($('#traffic-template').html());

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



  module.trafficView = trafficView;
})(window);
