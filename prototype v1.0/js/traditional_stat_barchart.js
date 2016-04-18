var boxscore_data;
var opponentId=1610612740;

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


d3.csv("data/gamelog.csv",function(error,csv){
    csv.forEach(function(d){
        if (error) throw error;
        // Convert numeric values to 'numbers'
        d.ast=+d.ast;
        d.blk=+d.blk;
        d.fgm=+d.fgm;
        d.reb=+d.reb;
        d.stl=+d.stl;
        d.tov=+d.tov;
        d.opTeamId=+d.opTeamId
    });
    boxscore_data=csv.filter(function(d){return d.opTeamId==opponentId});
    console.log(boxscore_data);
    //updateStatBarchart()
});

function updateStatBarchart(){
    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.ordinal()
        .range(["#41B6C4", "#FD8D3C"]);

    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
        //.tickFormat(d3.format(".2s"));

    var svg = d3.select("#team-trad-bar-chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    x0.domain(data.map(function(d) { return d.State; }));
}