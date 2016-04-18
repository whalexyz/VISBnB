/**
 * Created by victoria_G on 4/17/16.
 */

var margin = {top: 20, right: 20, bottom: 30, left: 40},
 width = 960 - margin.left - margin.right,
 height = 500 - margin.top - margin.bottom;
 var padding=40;
 var x = d3.scale.ordinal()
 .rangeRoundBands([0, width], .1);


 var y = d3.scale.linear()
 .rangeRound([height, 0]);

 var color = d3.scale.ordinal()
 .range([ "#ff8c00","#a05d56","#d0743c","#6b486b"]);

 var xAxis = d3.svg.axis()
 .scale(x)
 .orient("bottom");

 var yAxis = d3.svg.axis()
 .scale(y)
 .orient("left")
 .tickFormat(d3.format(".2s"));

 var svg = d3.select("#chart-area").append("svg")
 .attr("width", width + margin.left + margin.right)
 .attr("height", height + margin.top + margin.bottom)
 .append("g")
 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var legend_list=["Jump","Bank","Layup","Others"];


loadData();
var data;
var shot_zone_range;
function loadData() {
    d3.csv("data/curry_count.csv", function (error, csv) {

        //console.log(csv);
        color.domain(d3.keys(csv[0]).filter(function(key) { return key !== "shot_zone_range"; }));
        csv.forEach(function (d) {
            var y0 = 0;
            d.counts = color.domain().map(function (name) {
                return {name: name, y0: y0, y1: y0 += +d[name]};
            });

            d.total = d.counts[d.counts.length - 1].y1;
        });

        csv.sort(function (a, b) {
            return b.total - a.total;
        });
        data = csv;

        //console.log(data);
        updateBarchart();
    });
};

function updateBarchart() {
    var selectedData = d3.select("#currydata").property("value");
    //var selectedData2=d3.select("#player1data").property("value");
    //var selectedData3=d3.select("#player2data").property("value");
    //console.log(curry);
    console.log(selectedData);
        //rec.exit().remove();
    if (selectedData != ""){
        var curry = data.filter(function (value, index) {
            return value.shot_zone_range == selectedData;
        });
        console.log(curry);

        svg.selectAll(".rect").remove();
        svg.selectAll(".y.axis").remove();
        svg.selectAll(".x.axis").remove();
        svg.selectAll(".legend").remove();
        //console.log(curry[Jump]);
        var player=[];
        curry.forEach(function(d){
            d.Jump=+d.Jump;
            d.Layup=+d.Layup;
            d.Bank=+d.Bank;
            d.Others=+d.Others;
        });
        curry.forEach(function(d){
            player=[{Type:"Jump",Y: d.Jump,Color:"#ff8c00"},{Type:"Bank",Y: d.Bank,Color:"#a05d56"},{Type:"Layup",Y: d.Layup,Color:"#d0743c"},{Type:"Others",Y: d.Others,Color:"#6b486b"}]
        });
        console.log(player);


        var YScale=d3.scale.linear()
            .domain([0,d3.max(player, function(d) { return d.Y; })])
            .range([height, 0]);
        var XScale = d3.scale.ordinal()
            .domain(player.map(function(d){
                return d.Type;
            }))
            .rangeRoundBands([0, width], .1);

        var x_axis=d3.svg.axis()
            .scale(XScale)
            .orient("bottom");

        var y_axis = d3.svg.axis()
            .scale(YScale)
            .orient("left")
            .tickFormat(d3.format(".2s"));

        var rec=svg.selectAll("rect.rect1")
            .data(player);

        rec.enter()
            .append("rect")
            .attr("class","rect1")
            .style("fill", function (d) {
            return color(d.Color);
        });

        rec.transition()
            .duration(500)
            .attr("x", function(d) { return XScale(d.Type); })
            .attr("width", XScale.rangeBand())
            .attr("y", function(d) { return YScale(d.Y); })
            .attr("height", function(d) { return height - YScale(d.Y); });
        rec.exit().remove();

        svg.append("g")
            .attr("class","x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(x_axis);
        svg.append("g")
            .attr("class","y axis")
            .attr("transform", "translate(0,0)")
            .call(y_axis)
            .append("text")
            .attr("class","y label")
            .attr("text-anchor","end")
            .attr("dy", "1.1em")
            .attr("transform","rotate(-90)")
            .text("Count");


    }else{
        svg.selectAll("rect.rect1").remove();
        svg.selectAll(".y.axis").remove();
        svg.selectAll(".x.axis").remove();
        //svg.selectAll(".legend1").remove();
        var curry = data;
        x.domain(curry.map(function (d) {
            return d.shot_zone_range;
        }));
        y.domain([0, d3.max(curry, function (d) {
            return d.total;
        })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Shot type counts");

        shot_zone_range = svg.selectAll(".shot_zone_range")
            .data(curry)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function (d) {
                return "translate(" + x(d.shot_zone_range) + ",0)";
            });

        var rec = shot_zone_range.selectAll("rect")
            .data(function (d) {
                return d.counts;
            })
            .enter().append("rect")
            .attr("class","rect")
            .attr("width", x.rangeBand())
            .attr("y", function (d) {
                return y(d.y1);
            })
            .attr("height", function (d) {
                return y(d.y0) - y(d.y1);
            })
            .style("fill", function (d) {
                return color(d.name);
            });
        //rec.exit().remove();

        var legend = svg.selectAll("g.legend2")
            .data(color.domain().slice().reverse())
            .enter().append("g")
            .attr("class", "legend2")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) {
                return d;
            });
    }


};