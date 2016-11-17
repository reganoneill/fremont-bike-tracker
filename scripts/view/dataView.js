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


  traffic.datePick();



  module.trafficView = trafficView;
})(window);
