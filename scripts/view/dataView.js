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
          console.log(traffic.date1);
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
        if(localStorage.lastUpdated !== xhr.getResponseHeader('Last-Modified')){
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
        console.log('all good! we are up to date');
      }//end else
    }//end success
  });//end ajax request
    //now write functionality to make last month's date (gathered above) display in
    //the DOM.
    var displayFirstLoadVals = JSON.parse(localStorage.recentStats);
    // console.log(displayFirstLoadVals.total);
    $('.initial-locStorage-vals').append('Total bike crossings from the previous month: ' + displayFirstLoadVals.total + '</br> Total northbound bikers: ' + displayFirstLoadVals.totalNorth + '</br> Total southbound bikers: ' + displayFirstLoadVals.totalSouth);
  };

  traffic.loadImmediately();

  module.trafficView = trafficView;

})(window);
