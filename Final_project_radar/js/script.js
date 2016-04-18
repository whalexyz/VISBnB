
selectValue1="Stephen Curry"
selectValue2="LeBron James"

//player 1
var d1=[]
d3.csv("data/newradardata.csv", function(error, csv) {
	csv.forEach(function(d){
		// Convert numeric values to 'numbers'
		d.ast=+d.ast;
		d.blk=+d.blk;
		d.pf=+d.pf;
		d.gp=+d.gp;
		d.reb=+d.reb;
		d.stl=+d.stl;
		d.tov=+d.tov
	});
	data = csv.filter( function(d) {
		return (d.player_name == selectValue1);
	});

	d1=data.map(function(d){
		a=[{axis:"Assists",value: d.ast},
			{axis:"Blocks",value: d.blk},
			{axis:"Personal Fouls",value: d.pf},
			{axis:"Rebounds",value: d.reb},
			{axis:"Turnovers",value: d.tov},
			{axis:"Steals",value: d.stl}]
		return a
	});
	updateVisualization1();

});

//player 2
var d2=[]
d3.csv("data/newradardata.csv", function(error, csv) {
	csv.forEach(function(d){
		// Convert numeric values to 'numbers'
		d.ast=+d.ast;
		d.blk=+d.blk;
		d.pf=+d.pf;
		d.gp=+d.gp;
		d.reb=+d.reb;
		d.stl=+d.stl;
		d.tov=+d.tov
	});
	data = csv.filter( function(d) {
		return (d.player_name == selectValue2);
	});

	d2=data.map(function(d){
		a=[{axis:"Assists",value: d.ast},
			{axis:"Blocks",value: d.blk},
			{axis:"Personal Fouls",value: d.pf},
			{axis:"Rebounds",value: d.reb},
			{axis:"Turnovers",value: d.tov},
			{axis:"Steals",value: d.stl}]
		return a
	});
	updateVisualization2();

});





function updateVisualization1(){
	var w = 200,
		h = 200;

	//var colorscale = d3.scale.category10();
	//var console.log(colorscale)
	var colorscale1=['#feb24c','#f03b20'];


//Legend titles
	var LegendOptions1 = ['Regular','Playoff'];


//Options for the Radar chart, other than default
	var mycfg1 = {
		w: w,
		h: h,
		maxValue: 0.6,
		levels: 6,
		ExtraWidthX: 300
	}



//Call function to draw the Radar chart
//Will expect that data is in %'s
	RadarChart.draw("#chart1",d1, mycfg1,colorscale1);

////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

	var svg1 = d3.select('#chart1')
		.selectAll('svg')
		.append('svg')
		.attr("width", w+300)
		.attr("height", h)

//Create the title for the legend
	var text1 = svg1.append("text")
		.attr("class", "title")
		.attr('transform', 'translate(90,0)')
		.attr("x", w - 70)
		.attr("y", 10)
		.attr("font-size", "12px")
		.attr("fill", "#404040")
		.text("Season Type");

//Initiate Legend
	var legend1 = svg1.append("g")
		.attr("class", "legend")
		.attr("height", 100)
		.attr("width", 200)
		.attr('transform', 'translate(90,20)')
		;
	//Create colour squares
	legend1.selectAll('rect')
		.data(LegendOptions1)
		.enter()
		.append("rect")
		.attr("x", w - 65)
		.attr("y", function(d, i){ return i * 20;})
		.attr("width", 10)
		.attr("height", 10)
		.style("fill", function(d, i){
			console.log(colorscale1[i])
			return colorscale1[i];})
	;
	//Create text next to squares
	legend1.selectAll('text')
		.data(LegendOptions1)
		.enter()
		.append("text")
		.attr("x", w - 52)
		.attr("y", function(d, i){ return i * 20 + 9;})
		.attr("font-size", "11px")
		.attr("fill", "#737373")
		.text(function(d) { return d; })

}

function updateVisualization2(){
	var w = 200,
		h = 200;

	//var colorscale = d3.scale.category10();
	var colorscale2=['#a1d99b','#31a354']

//Legend titles
	var LegendOptions2 = ['Regular','Playoff'];


//Options for the Radar chart, other than default
	var mycfg2 = {
		w: w,
		h: h,
		maxValue: 0.6,
		levels: 6,
		ExtraWidthX: 300
	}



//Call function to draw the Radar chart
//Will expect that data is in %'s
	RadarChart.draw("#chart2",d2, mycfg2,colorscale2);

////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

	var svg2 = d3.select('#chart2')
		.selectAll('svg')
		.append('svg')
		.attr("width", w+300)
		.attr("height", h)

//Create the title for the legend
	var text2 = svg2.append("text")
		.attr("class", "title")
		.attr('transform', 'translate(90,0)')
		.attr("x", w - 70)
		.attr("y", 10)
		.attr("font-size", "12px")
		.attr("fill", "#404040")
		.text("Season Type");

//Initiate Legend
	var legend2 = svg2.append("g")
		.attr("class", "legend")
		.attr("height", 100)
		.attr("width", 200)
		.attr('transform', 'translate(90,20)')
		;
	//Create colour squares
	legend2.selectAll('rect')
		.data(LegendOptions2)
		.enter()
		.append("rect")
		.attr("x", w - 65)
		.attr("y", function(d, i){ return i * 20;})
		.attr("width", 10)
		.attr("height", 10)
		.style("fill", function(d, i){
			console.log(colorscale2[i])
			return colorscale2[i];})
	;
	//Create text next to squares
	legend2.selectAll('text')
		.data(LegendOptions2)
		.enter()
		.append("text")
		.attr("x", w - 52)
		.attr("y", function(d, i){ return i * 20 + 9;})
		.attr("font-size", "11px")
		.attr("fill", "#737373")
		.text(function(d) { return d; })

}

