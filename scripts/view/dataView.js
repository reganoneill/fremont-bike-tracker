'use strict';
(function(module) {
  var trafficView = {};
  traffic.date1, traffic.date2;
  var trafficCompiler = Handlebars.compile($('#traffic-template').html());

  trafficView.renderTraffic = function() {
    $('#stats').empty().append(
      traffic.allTraffic

      .map(trafficCompiler)
    );
  };
  // taken from : https://jqueryui.com/datepicker/#date-range
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
        console.log(date);
        console.log(element.value);
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

  traffic.datePick();
  traffic.requestTraffic(trafficView.renderTraffic);



  module.trafficView = trafficView;
})(window);
