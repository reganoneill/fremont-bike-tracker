'use strict';
(function(module) {
  var charts = {};

  charts.drawCharts = function() {
    var dataTraffic = traffic.allTraffic;
    var dataHourly = traffic.hourlyDataToDisplay;
    var dataDaily = traffic.dailyDataToDisplay;
    var dataMonthly = traffic.monthlyDataToDisplay;
    var dataTrafficByDay = traffic.dailyArray;
    dataTrafficByDay.reverse();
    dataTraffic.reverse();

    var margin = {top: 120, right: 30, bottom: 120, left: 40},
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var x = d3.scaleBand()
      .range([0, width])
      .padding(0.25);

    var y = d3.scaleLinear()
      .range([height, 0]);

    var div = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    var svg;

    charts.updateSvg = function(chart, className) {
      $(chart).empty();
      svg = d3.select(chart).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('class', className)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
    };

///////////////////////HOURLY BIKE TRAFFIC TOTALS///////////////////////////////
    charts.displayDataTrafficChart = function(dataType, chartToUpdate, direction) {
      charts.updateSvg(chartToUpdate, direction);
      x.domain(dataTraffic.map(function(d) {
        return d.date;
      }));
      y.domain([0, d3.max(dataTraffic, function(d) {
        return parseInt(d[dataType]);
      })]);

      svg.append('text')
        .attr('x', (width / 2))
        .attr('y', 0 - (margin.top / 2))
        .attr('text-anchor', 'middle')
        .style('font-size', '22px')
        .style('fill', 'white')
        .text('Hourly Bike Traffic Totals ' + direction);

      svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .attr('class', 'axisWhite')
        .attr('id', 'xAxis')
        .call(d3.axisBottom(x))
        .selectAll('text')
          .style('text-anchor', 'end')
          .attr('dx', '-.8em')
          .attr('dy', '.15em')
          .attr('transform', 'rotate(-75)');


      svg.append('g')
        .attr('class', 'axisWhite')
        .call(d3.axisLeft(y));

      svg.selectAll('.bar')
        .data(dataTraffic)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) {
          return x(d.date);
        })
        .attr('width', x.bandwidth())
        .attr('y', function(d) {
          return y(d[dataType]);
        })
        .attr('height', function(d) {
          return height - y(d[dataType]);
        })
        .on('mouseover', function(d) {
          var rect = $(d3.event.target);
          rect.addClass('mouseover-color');
          div.transition()
            .duration(200)
            .style('opacity', .9);
          div.html(d[dataType] + ' bikers<br> ' + moment(d.date).format('MM-DD-YYYY  ha'))
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
          var rect = $(d3.event.target);
          rect.removeClass('mouseover-color');
          div.transition()
            .duration(500)
            .style('opacity', 0);
        });
      var ticks = svg.selectAll('#xAxis .tick text');
      console.log(dataTrafficByDay);
      if (dataTraffic.length > 24 && dataTraffic.length <= 48){
        ticks.attr('class', function(d,i){
          if(i % 3 != 0) d3.select(this).remove();
        });
      }
      if (dataTraffic.length > 48 && dataTraffic.length <= 96){
        ticks.attr('class', function(d,i){
          if(i % 6 != 0) d3.select(this).remove();
        });
      }
      if (dataTraffic.length > 96 && dataTraffic.length <= 120){
        ticks.attr('class', function(d,i){
          if(i % 12 != 0) d3.select(this).remove();
        });
      }
      if (dataTraffic.length > 120){
        ticks.attr('class', function(d,i){
          if(i % 24 != 0) d3.select(this).remove();
        });
      }
    };
///////////////////////AVG BIKE TRAFFIC PER HOUR///////////////////////////////
    charts.displayHourlyChart = function(dataType, chartToUpdate, direction) {
      charts.updateSvg(chartToUpdate, direction);
      x.domain(dataHourly.map(function(d) {
        return d.hour;
      }));
      y.domain([0, d3.max(dataHourly, function(d) {
        return parseInt(d[dataType]);
      })]);

      svg.append('text')
        .attr('x', (width / 2))
        .attr('y', 0 - (margin.top / 2))
        .attr('text-anchor', 'middle')
        .style('font-size', '22px')
        .style('fill', 'white')
        .text('Average Bike Traffic Per Hour of the Day ' + direction);

      svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .attr('class', 'axisWhite')
        .call(d3.axisBottom(x));

      svg.append('g')
        .attr('class', 'axisWhite')
        .call(d3.axisLeft(y));

      svg.selectAll('.bar')
        .data(dataHourly)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) {
          return x(d.hour);
        })
        .attr('width', x.bandwidth())
        .attr('y', function(d) {
          return y(d[dataType]);
        })
        .attr('height', function(d) {
          return height - y(d[dataType]);
        })
        .on('mouseover', function(d) {
          var rect = $(d3.event.target);
          rect.addClass('mouseover-color');
          div.transition()
            .duration(200)
            .style('opacity', .9);
          div.html(d[dataType] + ' bikers<br>' + d.hour)
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
          var rect = $(d3.event.target);
          rect.removeClass('mouseover-color');
          div.transition()
            .duration(500)
            .style('opacity', 0);
        });
    };
///////////////////////AVG BIKE TRAFFIC PER DAY///////////////////////////////
    charts.displayDailyChart = function(dataType, chartToUpdate, direction) {
      charts.updateSvg(chartToUpdate, direction);
      x.domain(dataDaily.map(function(d) {
        return d.day;
      }));
      y.domain([0, d3.max(dataDaily, function(d) {
        return d[dataType];
      })]);

      svg.append('text')
        .attr('x', (width / 2))
        .attr('y', 0 - (margin.top / 2))
        .attr('text-anchor', 'middle')
        .style('font-size', '22px')
        .style('fill', 'white')
        .text('Average Bike Traffic Per Day of the Week ' + direction);

      svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .attr('class', 'axisWhite')
        .call(d3.axisBottom(x));

      svg.append('g')
        .attr('class', 'axisWhite')
        .call(d3.axisLeft(y));

      svg.selectAll('.bar')
        .data(dataDaily)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) {
          return x(d.day);
        })
        .attr('width', x.bandwidth())
        .attr('y', function(d) {
          return y(d[dataType]);
        })
        .attr('height', function(d) {
          return height - y(d[dataType]);
        })
        .on('mouseover', function(d) {
          var rect = $(d3.event.target);
          rect.addClass('mouseover-color');
          div.transition()
            .duration(200)
            .style('opacity', .9);
          div.html(d[dataType] + ' bikers<br>' + d.day)
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
          var rect = $(d3.event.target);
          rect.removeClass('mouseover-color');
          div.transition()
            .duration(500)
            .style('opacity', 0);
        });
    };
///////////////////////AVG BIKE TRAFFIC PER MONTH//////////////////////////////
    charts.displayMonthlyChart = function(dataType, chartToUpdate, direction) {
      charts.updateSvg(chartToUpdate, direction);
      x.domain(dataMonthly.map(function(d) {
        return d.month;
      }));
      y.domain([0, d3.max(dataMonthly, function(d) {
        return d[dataType];
      })]);
      svg.append('text')
        .attr('x', (width / 2))
        .attr('y', 0 - (margin.top / 2))
        .attr('text-anchor', 'middle')
        .style('font-size', '22px')
        .style('fill', 'white')
        .text('Average Bike Traffic Per Month of the Year ' + direction);

      svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .attr('class', 'axisWhite')
        .call(d3.axisBottom(x));

      svg.append('g')
        .attr('class', 'axisWhite')
        .call(d3.axisLeft(y));

      svg.selectAll('.bar')
        .data(dataMonthly)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) {
          return x(d.month);
        })
        .attr('width', x.bandwidth())
        .attr('y', function(d) {
          return y(d[dataType]);
        })
        .attr('height', function(d) {
          return height - y(d[dataType]);
        })
        .on('mouseover', function(d) {
          var rect = $(d3.event.target);
          rect.addClass('mouseover-color');
          div.transition()
            .duration(200)
            .style('opacity', .9);
          div.html(d[dataType] + ' bikers<br>' + d.month)
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
          var rect = $(d3.event.target);
          rect.removeClass('mouseover-color');
          div.transition()
            .duration(500)
            .style('opacity', 0);
        });
    };
///////////////////////DAILY BIKE TRAFFIC TOTALS///////////////////////////////
    charts.displayDataTrafficByDayChart = function(dataType, chartToUpdate, direction) {
      charts.updateSvg(chartToUpdate, direction);
      x.domain(dataTrafficByDay.map(function(d) {
        return d.date;
      }));
      y.domain([0, d3.max(dataTrafficByDay, function(d) {
        return d[dataType];
      })]);


      svg.append('text')
        .attr('x', (width / 2))
        .attr('y', 0 - (margin.top / 2))
        .attr('text-anchor', 'middle')
        .style('font-size', '22px')
        .style('fill', 'white')
        .text('Bike Traffic Totals Per Day ' + direction);

      svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .attr('class', 'axisWhite')
        .attr('id', 'xAxis')
        .call(d3.axisBottom(x))
        .selectAll('text')
          .style('text-anchor', 'end')
          .attr('dx', '-.8em')
          .attr('dy', '.15em')
          .attr('transform', 'rotate(-75)');

      svg.append('g')
        .attr('class', 'axisWhite')
        .call(d3.axisLeft(y));

      svg.selectAll('.bar')
        .data(dataTrafficByDay)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) {
          return x(d.date);
        })
        .attr('width', x.bandwidth())
        .attr('y', function(d) {
          return y(d[dataType]);
        })
        .attr('height', function(d) {
          return height - y(d[dataType]);
        })
        .on('mouseover', function(d) {
          var rect = $(d3.event.target);
          rect.addClass('mouseover-color');
          div.transition()
            .duration(200)
            .style('opacity', .9);
          div.html(d[dataType] + ' bikers<br>' + d.date)
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
          var rect = $(d3.event.target);
          rect.removeClass('mouseover-color');
          div.transition()
            .duration(500)
            .style('opacity', 0);
        });
      var ticks = svg.selectAll('#xAxis .tick text');
      if (dataTraffic.length > 2000 && dataTraffic.length < 8760){
        ticks.attr('class', function(d,i){
          if(i % 7 != 0) d3.select(this).remove();
        });
      }
      if (dataTraffic.length > 8760 && dataTraffic.length < 15000){
        ticks.attr('class', function(d,i){
          if(i % 14 != 0) d3.select(this).remove();
        });
      }
      if (dataTraffic.length > 15000){
        ticks.attr('class', function(d,i){
          if(i % 28 != 0) d3.select(this).remove();
        });
      }

    };

    if(traffic.allTraffic.length > 8760){
      charts.displayMonthlyChart('avgNb', '.dataGraphMonthlyNB','Northbound');
      charts.displayMonthlyChart('avgSb', '.dataGraphMonthlySB','Southbound');
      charts.displayMonthlyChart('avg', '.dataGraphMonthly','Total');
    }
    if(traffic.allTraffic.length < 193){
      charts.displayDataTrafficChart('total', '.dataGraphTraffic', 'Total');
      charts.displayDataTrafficChart('fremont_bridge_nb', '.dataGraphTrafficNB', 'Northbound');
      charts.displayDataTrafficChart('fremont_bridge_nb', '.dataGraphTrafficSB', 'Southbound');
    } else {
      charts.displayDailyChart('avg', '.dataGraphDaily','Total');
      charts.displayDailyChart('avgNb', '.dataGraphDailyNB','Northbound');
      charts.displayDailyChart('avgSb', '.dataGraphDailySB','Southbound');
    }
    if(traffic.allTraffic.length > 24){
      charts.displayDataTrafficByDayChart('total', '.dataGraphTrafficHourly', 'Total');
      charts.displayDataTrafficByDayChart('fremont_bridge_nb', '.dataGraphTrafficHourlyNB', 'Northbound');
      charts.displayDataTrafficByDayChart('fremont_bridge_sb', '.dataGraphTrafficHourlySB', 'Southbound');
    }
    charts.displayHourlyChart('avg', '.dataGraphHourly','Total');
    charts.displayHourlyChart('avgNb', '.dataGraphHourlyNB','Northbound');
    charts.displayHourlyChart('avgSb', '.dataGraphHourlySB','Southbound');
  };

  module.charts = charts;
})(window);
