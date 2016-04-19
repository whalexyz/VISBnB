/**
 * Created by achchg on 4/18/16.
 */
/**
 * Created by victoria_G on 4/17/16.
 */

var padding=40;

var svg = d3.select("#stack-chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);


var y = d3.scale.linear()
    .rangeRound([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var xAxisGroup = svg.append("g")
    .attr("class", "x-axis axis");

var yAxisGroup = svg.append("g")
    .attr("class", "y-axis axis");

var shot_zone_range;
var color = d3.scale.ordinal()
    .range([ "#ff8c00","#a05d56","#d0743c","#6b486b"]);

function updateBarchart() {
    selectValue = d3.select('#select1').property('value');
    data_update = data.filter(player_filter);
    selectValue2 = d3.select('#select2').property('value');
    data_update2 = data.filter(player_filter2);

    selectValue4 = d3.select('#select4').property('value');

    //var tenderData = [];
    var player1_count = [];
    var Jump1 = 0; var Layup1= 0; var Others1= 0;
    var Jump12 = 0; var Layup12 = 0; var Others12 = 0;
    var Jump13 = 0; var Layup13 = 0; var Others13 = 0;
    var Jump14 = 0; var Layup14 = 0; var Others14 = 0;
    var Jump15 = 0; var Layup15 = 0; var Others15 = 0;
    for (var i = 0; i < data_update.length; i++) {
    /*    tenderData.push({
            "x": Math.ceil((data_update[i].loc_x + 243) / 10),
            "y": Math.ceil((data_update[i].loc_y + 17) / 9),
            "made": data_update[i].shot_made_numeric,
            "attempts": 1
        });
        */
        if(data[i].shot_zone_range == "Less Than 8 ft."){
            if(data[i].shot_type == "Jump"){Jump1 += 1;}
            else if(data[i].shot_type == "Layup"){Layup1 += 1;}
            else if(data[i].shot_type == "Others"){Others1 += 1;}
        }
        else if(data[i].shot_zone_range == "8-16 ft."){
            if(data[i].shot_type == "Jump"){Jump12 += 1;}
            else if(data[i].shot_type == "Layup"){Layup12 += 1;}
            else if(data[i].shot_type == "Others"){Others12 += 1;}
        }
        else if(data[i].shot_zone_range == "16-24 ft."){
            if(data[i].shot_type == "Jump"){Jump13 += 1;}
            else if(data[i].shot_type == "Layup"){Layup13 += 1;}
            else if(data[i].shot_type == "Others"){Others13 += 1;}
        }
        else if(data[i].shot_zone_range == "24+ ft."){
            if(data[i].shot_type == "Jump"){Jump14 += 1;}
            else if(data[i].shot_type == "Layup"){Layup14 += 1;}
            else if(data[i].shot_type == "Others"){Others14 += 1;}
        }
        else if(data[i].shot_zone_range == "Back Court Shot"){
            if(data[i].shot_type == "Jump"){Jump15 += 1;}
            else if(data[i].shot_type == "Layup"){Layup15 += 1;}
            else if(data[i].shot_type == "Others"){Others15 += 1;}
        }
    }
    player1_count.push({
            "shot_zone_range":"Less Than 8 ft.",
            "Jump":Jump1,
            "Layup": Layup1,
            "Others": Others1
        },
        {"shot_zone_range":"8-16 ft.",
            "Jump":Jump12,
            "Layup": Layup12,
            "Others": Others12
        },
        {"shot_zone_range":"16-24 ft.",
            "Jump":Jump13,
            "Layup": Layup13,
            "Others": Others13
        },
        {"shot_zone_range":"24+ ft.",
            "Jump":Jump14,
            "Layup": Layup14,
            "Others": Others14
        },
        {"shot_zone_range":"Back Court Shot",
            "Jump":Jump15,
            "Layup": Layup15,
            "Others": Others15
        });

    color.domain(d3.keys(player1_count[0]).filter(function(key) { return key !== "shot_zone_range"; }));
    player1_count.forEach(function (d) {

        var y0 = 0;
        d.counts = color.domain().map(function (name) {
            return {name: name, y0: y0, y1: y0 += +d[name]};
        });

        d.total = d.counts[d.counts.length - 1].y1;
    });

    //var tenderData2 = [];
    var player2_count = [];
    var Jump2 = 0; var Layup2= 0; var Others2= 0;
    var Jump22 = 0; var Layup22 = 0; var Others22 = 0;
    var Jump23 = 0; var Layup23 = 0; var Others23 = 0;
    var Jump24 = 0; var Layup24 = 0; var Others24 = 0;
    var Jump25 = 0; var Layup25 = 0; var Others25 = 0;
    for (var k = 0; k < data_update2.length; k++) {
    /*    tenderData2.push({
            "x": Math.ceil((data_update2[k].loc_x + 243) / 10),
            "y": Math.ceil((data_update2[k].loc_y + 17) / 9),
            "made": data_update2[k].shot_made_numeric,
            "attempts": 1
        });
        */
        if(data[k].shot_zone_range == "Less Than 8 ft."){
            if(data[k].shot_type == "Jump"){Jump2 += 1;}
            else if(data[k].shot_type == "Layup"){Layup2 += 1;}
            else if(data[k].shot_type == "Others"){Others2 += 1;}
        }
        else if(data[k].shot_zone_range == "8-16 ft."){
            if(data[k].shot_type == "Jump"){Jump22 += 1;}
            else if(data[k].shot_type == "Layup"){Layup22 += 1;}
            else if(data[k].shot_type == "Others"){Others22 += 1;}
        }
        else if(data[k].shot_zone_range == "16-24 ft."){
            if(data[k].shot_type == "Jump"){Jump23 += 1;}
            else if(data[k].shot_type == "Layup"){Layup23 += 1;}
            else if(data[k].shot_type == "Others"){Others23 += 1;}
        }
        else if(data[k].shot_zone_range == "24+ ft."){
            if(data[k].shot_type == "Jump"){Jump24 += 1;}
            else if(data[k].shot_type == "Layup"){Layup24 += 1;}
            else if(data[k].shot_type == "Others"){Others24 += 1;}
        }
        else if(data[k].shot_zone_range == "Back Court Shot"){
            if(data[k].shot_type == "Jump"){Jump25 += 1;}
            else if(data[k].shot_type == "Layup"){Layup25 += 1;}
            else if(data[k].shot_type == "Others"){Others25 += 1;}
        }
    }
    player2_count.push({
            "shot_zone_range":"Less Than 8 ft.",
            "Jump":Jump2,
            "Layup": Layup2,
            "Others": Others2
        },
        {"shot_zone_range":"8-16 ft.",
            "Jump":Jump22,
            "Layup": Layup22,
            "Others": Others22
        },
        {"shot_zone_range":"16-24 ft.",
            "Jump":Jump23,
            "Layup": Layup23,
            "Others": Others23
        },
        {"shot_zone_range":"24+ ft.",
            "Jump":Jump24,
            "Layup": Layup24,
            "Others": Others24
        },
        {"shot_zone_range":"Back Court Shot",
            "Jump":Jump25,
            "Layup": Layup25,
            "Others": Others25
        });

    //color.domain(d3.keys(player2_count[0]).filter(function(key) { return key !== "shot_zone_range"; }));
    player2_count.forEach(function (d) {
        var y0 = 0;
        d.counts = color.domain().map(function (name) {
            return {name: name, y0: y0, y1: y0 += +d[name]};});

        player2_count.sort(function (a, b) {
            return b.total - a.total;
        });});

    var player = [];
    var player2 = [];

    if (selectValue4 != "All") {
        svg.selectAll("rect").remove()
        svg.selectAll(".legend").remove();
        var player1_count1 = player1_count.filter(shotzonerange);
        var player2_count1 = player2_count.filter(shotzonerange);

        player1_count1.forEach(function (d) {
            player.push({Type: "Jump", Y: d.Jump, Color: "#ff8c00"},
                {Type: "Layup", Y: d.Layup, Color: "#d0743c"},
                {Type: "Others", Y: d.Others, Color: "#6b486b"})

        });

        player2_count1.forEach(function (d) {
            player2.push({Type: "Jump", Y: d.Jump, Color: "#ff8c00"},
                {Type: "Layup", Y: d.Layup, Color: "#d0743c"},
                {Type: "Others", Y: d.Others, Color: "#6b486b"})
        });


        var YScale = d3.scale.linear()
            .domain([0, d3.max(player, function (d) {
                return d.Y;
            })])
            .range([height, 0]);

        var XScale = d3.scale.ordinal()
            .domain(player.map(function (d) {
                return d.Type;
            }))
            .rangeRoundBands([0, width], .1);

        var x_axis = d3.svg.axis()
            .scale(XScale)
            .orient("bottom");

        var y_axis = d3.svg.axis()
            .scale(YScale)
            .orient("left")
            .tickFormat(d3.format(".2s"));

        var xAxisGroup1 = svg.append("g")
            .attr("class", "x-axis");

        var yAxisGroup1 = svg.append("g")
            .attr("class", "y-axis");

        var rec = svg.selectAll(".rect1")
            .data(player);

        rec.enter()
            .append("rect")
            .attr("class", "rect1")
            .style("fill", function (d) {
                return color(d.Color);
            });

        rec.transition()
            .duration(500)
            .attr("x", function (d) {
                return XScale(d.Type);
            })
            .attr("width", XScale.rangeBand() / 2)
            .attr("y", function (d) {
                return YScale(d.Y);
            })
            .attr("height", function (d) {
                return height - YScale(d.Y);
            });
        rec.exit().remove();

        var rec2 = svg.selectAll(".rect2")
            .data(player2);

        rec2.enter()
            .append("rect")
            .style("fill", function (d) {
                return color(d.Color);
            });
        rec2.transition()
            .duration(500)
            .attr("class", "rect2")
            .attr("x", function (d) {
                return XScale(d.Type) * 4.5;
            })
            .attr("width", XScale.rangeBand() / 2)
            .attr("y", function (d) {
                return YScale(d.Y);
            })
            .attr("height", function (d) {
                return height - YScale(d.Y);
            });

        rec2.exit().remove();

        xAxisGroup1 = svg.select(".x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(x_axis);

        yAxisGroup1 = svg.select(".y-axis")
            .attr("transform", "translate(0,0)")
            .call(y_axis);

        svg.select("text.y_label").remove();

        svg
            .append("text")
            .attr("class", "y_label")
            .attr("text-anchor", "end")
            .attr("dy", "1.1em")
            .attr("transform", "rotate(-90)");


        var legend = svg.selectAll(".legend")
            .data(color.domain().slice().reverse());
        legend
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        legend.append("rect")
            .attr("class", "rect4")
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
        legend.exit().remove();

    }
    if (selectValue4 == "All") {
        svg.selectAll("rect.rect1").remove();
        svg.selectAll("rect.rect2").remove();
        svg.selectAll("rect.rect3").remove();
        svg.selectAll("rect.rect4").remove();


        // Update scale domains
        var combine = [player1_count[0], player1_count[1], player1_count[2], player1_count[3], player1_count[4],
            player2_count[0], player2_count[1], player2_count[2], player2_count[3], player2_count[4]];

        x.domain(combine.map(function (d) {
            return d.shot_zone_range;
        }));
        y.domain([0, d3.max(combine, function (d) {
            return d.total;
        })]);

        xAxisGroup = svg.select(".x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        yAxisGroup = svg.select(".y-axis")
            .call(yAxis);

        svg.select("text.y_label1").remove();
        svg
            .append("text")
            .attr("class", "y_label1")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end");

        shot_zone_range = svg.selectAll(".shot_zone_range")
            .data(player1_count);

        shot_zone_range
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function (d) {
                return "translate(" + x(d.shot_zone_range) + ",0)";
            });
        shot_zone_range.exit().remove();

        var rec1 = shot_zone_range.selectAll(".rect3")
            .data(function (d) {
                return d.counts;
            });
        rec1.enter().append("rect")
            .attr("class", "rect3")
            .attr("width", x.rangeBand()/2)
            .attr("y", function (d) {
                return y(d.y1);
            })
            .attr("height", function (d) {
                return y(d.y0) - y(d.y1);
            })
            .style("fill", function (d) {
                return color(d.name);
            });
        rec1.exit().remove();

        shot_zone_range2 = svg.selectAll(".shot_zone_range2")
            .data(player2_count);

        shot_zone_range2
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function (d) {
                return "translate(" + x(d.shot_zone_range) + ",0)";
            });
        shot_zone_range2.exit().remove();

        var rec12 = shot_zone_range2.selectAll(".rect4")
            .data(function (d) {
                return d.counts;
            });
        rec12.enter().append("rect")
            .attr("class", "rect4")
            .attr("width", x.rangeBand()/2)
            .attr("x", 45)
            .attr("y", function (d) {
                return y(d.y1);
            })
            .attr("height", function (d) {
                return y(d.y0) - y(d.y1);
            })
            .style("fill", function (d) {
                return color(d.name);
            });
        rec12.exit().remove();


        var legend1 = svg.selectAll(".legend")
            .data(color.domain().slice().reverse());
        legend1
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        legend1.append("rect")
            .attr("class", "rect3")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend1.append("text")
            .attr("x", width - 18)
            .attr("y", 6)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) {
                return d;
            });

        legend1.exit().remove();
    }

};