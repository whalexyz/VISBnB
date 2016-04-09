// SVG drawing area
var margin = {
	top: 40,
	right: 40,
	bottom: 60,
	left: 60
};
var width = 600 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;


var svg = d3.select("#chart-area").append("svg").attr("width", width + margin.left +
	margin.right).attr("height", height + margin.top + margin.bottom).append(
	"g").attr("transform", "translate(" + margin.left + "," + margin.top +
	")");

// Scales
var x = d3.time.scale.utc().range([0, width]);
var y = d3.scale.linear().range([height, 0]);
var xAxis = d3.svg.axis().scale(x).orient("bottom");
var yAxis = d3.svg.axis().scale(y).orient("left");
var xAxisGroup = svg.append("g").attr("class", "x-axis axis");
var yAxisGroup = svg.append("g").attr("class", "y-axis axis");

// Date parser (https://github.com/mbostock/d3/wiki/Time-Formatting)
var formatDate = d3.time.format("%Y");

// Initialize data
loadData();

// FIFA world cup
var data;
var data_update;

// Load CSV file
function loadData() {
	d3.csv("data/fifa-world-cup.csv", function(error, csv) {
		csv.forEach(function(d) {

			// Convert string to 'date object'
			d.YEAR = formatDate.parse(d.YEAR);

			// Convert numeric values to 'numbers'
			d.TEAMS = +d.TEAMS;
			d.MATCHES = +d.MATCHES;
			d.GOALS = +d.GOALS;
			d.AVERAGE_GOALS = +d.AVERAGE_GOALS;
			d.AVERAGE_ATTENDANCE = +d.AVERAGE_ATTENDANCE;
		});

		// Store csv data in global variable
		data = csv;
		data_update = csv;

		// Draw the visualization for the first time
		updateVisualization();
	});
}

// Render visualization

function updateVisualization() {
	var selectValue = d3.select("#ranking-type").property("value");

	// Set x and y domain:
	x.domain([d3.min(data_update, function(d) {
		return d.YEAR;
	}), d3.max(data_update, function(d) {
		return d.YEAR;
	})]);
	y.domain([0, d3.max(data_update, function(d) {
		return d[selectValue];
	})]);

	// ---- TOOLTIP ---- //
	var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(
		function(d) {
			return "<b>" + d.EDITION + "</b>" + "<br/>" + selectValue +
				": " + d[selectValue];
		});

	// ---- DRAW LINES ----
	var lines = d3.svg.line().x(function(d) {
		return x(d.YEAR);
	}).y(function(d) {
		return y(d[selectValue]);
	}).interpolate("linear");

	var lineSvg = svg.selectAll('path').data(data_update);
	lineSvg.enter().append('svg:path').attr('d', lines);

	// UPDATE
	lineSvg.transition().duration(800).ease("linear").attr('d', lines(
		data_update)).attr("class", "line");

	// EXIT
	lineSvg.exit().remove();

	// ---- DRAW CIRCLES ----
	var circles = svg.selectAll("circle").data(data_update);
	circles.enter().append("circle").attr("class", "circle");

	// UPDATE
	circles.transition().duration(800).ease("circle").attr("cx", function(d) {
		return x(d.YEAR)
	}).attr("cy", function(d) {
		return y(d[selectValue])
	}).attr("r", 4);
	circles.on("click", function(d) {
		return showEdition(d)
	});

	// EXIT
	circles.exit().remove();

	// INVOKE TOOLTIP
	svg.selectAll("circle").on("mouseover", tip.show).on("mouseout", tip.hide);
	circles.call(tip);

	// ---- DRAW AXIS	----
	xAxisGroup = svg.select(".x-axis").transition().duration(0).attr(
		"transform", "translate(0," + height + ")").call(xAxis);
	yAxisGroup = svg.select(".y-axis").transition().duration(800).call(
		yAxis);
	svg.select("text.axis-title").remove();
	svg.append("text").attr("class", "axis-title").transition().duration(
		800).attr("x", 0).attr("y", -15).attr("dy", ".1em").style(
		"text-anchor", "start").text(selectValue);
}


// Show details for a specific FIFA World Cup

function showEdition(d) {
	d3.select("#head").text(d.EDITION);
	d3.select("#winner").text(d.WINNER);
	d3.select("#goals").text(d.GOALS);
	d3.select("#avg_goals").text(d.AVERAGE_GOALS);
	d3.select("#matches").text(d.MATCHES);
	d3.select("#teams").text(d.TEAMS);
	d3.select("#avg_attend").text(d.AVERAGE_ATTENDANCE);
}
d3.select("#ranking-type").on("change", function() {
	updateVisualization();
});

function yearFilter() {
	var data1 = data;
	var year1 = parseFloat(document.getElementById("begin").value);
	var year2 = parseFloat(document.getElementById("end").value);

	function yearRange(variable) {
		return parseFloat(formatDate(variable.YEAR)) >= year1 &
			parseFloat(formatDate(variable.YEAR)) <= year2;
	}
	data_update = data1.filter(yearRange);
	updateVisualization();
	return false;
}