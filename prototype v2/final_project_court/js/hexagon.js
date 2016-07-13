
// Load CSV file
var data_origin;
var data;
var data_update;
var data_update2;
var x = [];
var y = [];
var selectValue;
var selectValue2;
var selectValue3;
var selectValue4;

function player_filter(variable) {
    return variable.player_name == selectValue;
}

function player_filter2(variable) {
    return variable.player_name == selectValue2;
}

function shottype(variable) {
    return variable.shot_type == selectValue3;
}


function shotzonerange(variable) {
    return variable.shot_zone_range == selectValue4;
}


loadData();

function loadData(){
    d3.csv("data/final_shot_data.csv", function(error, csv) {
        csv.forEach(function(d) {

            // Convert numeric values to 'numbers'
            d.loc_x = +d.loc_x*10;
            d.loc_y = (+d.loc_y-5.25)*10;
            d.period = +d.period;
            d.shot_made_numeric = +d.shot_made_numeric;
            d.time = +d.time;
            d.shot_zone = +d.shot_zone;

        });
        // Store csv data in global variable
        data_origin = csv;
        data = data_origin;

        var select = d3.select('#selection1')
            .append('select')
            .attr('id','select1')
            .on('change',onchange);

        select
            .selectAll('option')
            .data(d3.map(data, function(d){return d.player_name;}).keys())
            .enter()
            .append('option')
            .text(function(d){return d;})
            .attr("value", function(d){return d;});

        select.property("value", "Stephen Curry");

        var select2 = d3.select('#selection2')
            .append('select')
            .attr('id','select2')
            .on('change',onchange2);

        select2
            .selectAll('option')
            .data(d3.map(data, function(d){return d.player_name;}).keys())
            .enter()
            .append('option')
            .text(function(d){return d;})
            .attr("value", function(d){return d;});
        select2.property("value", "LeBron James");


        var select3 = d3.select('#selection3')
            .append('select')
            .attr('id','select3')
            .on('change',onchange3);

        select3
            .selectAll('option')
            .data(d3.map(data, function(d){return d.shot_type;}).keys())
            .enter()
            .append('option')
            .text(function(d){return d;})
            .attr("value", function(d){return d;});

        var select4 = d3.select('#selection3')
            .append('select')
            .attr('id','select4')
            .on('change',onchange4);

        select4
            .selectAll('option')
            .data(d3.map(data, function(d){return d.shot_zone_range;}).keys())
            .enter()
            .append('option')
            .text(function(d){return d;})
            .attr("value", function(d){return d;});

        updateVisualization();
})}



function onchange(){
    court_func();
    selectValue = d3.select('#select1').property('value');
    data_update = data.filter(player_filter);

    updateVisualization()
}

function onchange2(){
    court_func();
    selectValue2 = d3.select('#select2').property('value');
    data_update2 = data.filter(player_filter2);

    updateVisualization()
}

function onchange3(){
    court_func();
    selectValue3 = d3.select('#select3').property('value');

    if (selectValue4){
        data = data_origin.filter(shotzonerange).filter(shottype);
    }

    else{data = data_origin.filter(shottype);}

    updateVisualization()
}

function onchange4(){
    court_func();
    selectValue4 = d3.select('#select4').property('value');

    if (selectValue3){
        data = data_origin.filter(shottype).filter(shotzonerange);
    }

    else{data = data_origin.filter(shotzonerange);}
    updateVisualization()
}




function updateVisualization(){
    court_func();
    selectValue = d3.select('#select1').property('value');
    data_update = data.filter(player_filter);

    var tenderData = [];
    for (var i = 0; i < data_update.length; i++) {
        tenderData.push({
            "x": Math.ceil((data_update[i].loc_x + 243) / 10),
            "y": Math.ceil((data_update[i].loc_y + 17) / 9),
            "made": data_update[i].shot_made_numeric,
            "attempts": 1
        });
    }

    selectValue2 = d3.select('#select2').property('value');
    data_update2 = data.filter(player_filter2);

    var tenderData2 = [];
    for (var k = 0; k < data_update2.length; k++) {
        tenderData2.push({
            "x": Math.ceil((data_update2[k].loc_x + 243) / 10),
            "y": Math.ceil((data_update2[k].loc_y + 17) / 9),
            "made": data_update2[k].shot_made_numeric,
            "attempts": 1
        });
    }

    var coll = d3.nest()
        .key(function (d) {
            return [d.x, d.y];
        })
        .rollup(function (v) {
            return {
                made: d3.sum(v, function (d) {
                    return d.made
                }),
                attempts: d3.sum(v, function (d) {
                    return d.attempts
                }),
                shootingPercentage: d3.sum(v, function (d) {
                    return d.made
                }) / d3.sum(v, function (d) {
                    return d.attempts
                })
            }
        })
        .entries(tenderData);


    var coll2 = d3.nest()
        .key(function (d) {
            return [d.x, d.y];
        })
        .rollup(function (v) {
            return {
                made: d3.sum(v, function (d) {
                    return d.made
                }),
                attempts: d3.sum(v, function (d) {
                    return d.attempts
                }),
                shootingPercentage: d3.sum(v, function (d) {
                    return d.made
                }) / d3.sum(v, function (d) {
                    return d.attempts
                })
            }
        })
        .entries(tenderData2);

    var z = [];
    coll.forEach(function (a) {
        a.key = JSON.parse("[" + a.key + "]");
        z.push(a.values.shootingPercentage);
    });

    var meanShot = (z.reduce(function(a, b){return a+b;}))/ z.length;
    var z_square = [];
    for (var j = 0; j < z.length; j++) {z_square[j] = z[j]*z[j]}
    var shotSTDV = Math.sqrt((z_square.reduce(function(a,b){return a+b})- z.length*meanShot*meanShot)/ z.length);

    var finalData = [];
    coll.forEach(function (a) {
        var k = (a.values.shootingPercentage - meanShot) / shotSTDV;
        finalData.push({"x": a.key[0], "y": a.key[1], "z": k, "made": a.values.made, "attempts": a.values.attempts})
    });

    var z2 = [];
    coll2.forEach(function (a) {
        a.key = JSON.parse("[" + a.key + "]");
        z2.push(a.values.shootingPercentage);
    });

    var meanShot2 = (z2.reduce(function(a, b){return a+b;}))/ z2.length;
    var z_square2 = [];
    for (var l = 0; l < z2.length; l++) {z_square2[l] = z2[l]*z2[l]}
    var shotSTDV2 = Math.sqrt((z_square2.reduce(function(a,b){return a+b})- z2.length*meanShot2*meanShot2)/ z2.length);

    var finalData2 = [];
    coll2.forEach(function (a) {
        var k2 = (a.values.shootingPercentage - meanShot2) / shotSTDV2;
        finalData2.push({"x": a.key[0], "y": a.key[1], "z2": k2, "made": a.values.made, "attempts": a.values.attempts})
    });


    tenderData = finalData;
    var heatRange = ['#ffffcc','#a1dab4','#41b6c4','#2c7fb8','#253494'];
    var court = d3.select("#chart-area-div")
        .select("svg")
        .attr("width",1000)
        .attr("height", 600)
        .attr("viewBox", "0 0 60 60");

    tenderData2 = finalData2;
    var heatRange2 = ['#ffffb2','#fecc5c','#fd8d3c','#f03b20','#bd0026'];

    var court_right = court.append("g")
        .attr("class", "court")
        .attr("transform", "rotate(90, 10,10)")
        .chart("BasketballShotChart", {
            width: 800,
            title: "",
            // instead of makes/attempts, use z
            hexagonFillValue: function (d) {
                return d.z;
            },
            // switch heat scale domain to [-2.5, 2.5] to reflect range of z values
            heatScale: d3.scale.quantile()
                .domain([-2.5, 2.5])
                .range(heatRange),

            // update our binning algorithm to properly join z values
            // here, we update the z value to be proportional to the events of each point

            hexagonBin: function (point, bin) {
                var currentZ = bin.z || 0;
                var totalAttempts = bin.attempts || 0;
                var totalZ = currentZ * totalAttempts;

                var attempts = point.attempts || 1;
                bin.attempts = totalAttempts + attempts;
                bin.z = (totalZ + (point.z * attempts)) / bin.attempts;
            }
        });

    if(selectValue){
        setTimeout(function(){
            court_right
                .draw(tenderData);
        }, 250);
    }
    if(selectValue2){
        court_right
                .draw(tenderData);
    }


    var court_left = court.append("g")
        .attr("class", "court")
        .attr("transform", "rotate(-90, 40, 10)")
        .chart("BasketballShotChart", {
            width: 800,
            title: "",
            // instead of makes/attempts, use z
            hexagonFillValue: function (d) {
                return d.z2;
            },
            // switch heat scale domain to [-2.5, 2.5] to reflect range of z values
            heatScale: d3.scale.quantile()
                .domain([-2.5, 2.5])
                .range(heatRange2),

            // update our binning algorithm to properly join z values
            // here, we update the z value to be proportional to the events of each point

            hexagonBin: function (point, bin) {
                var currentZ = bin.z2 || 0;
                var totalAttempts = bin.attempts || 0;
                var totalZ = currentZ * totalAttempts;

                var attempts = point.attempts || 1;
                bin.attempts = totalAttempts + attempts;
                bin.z2 = (totalZ + (point.z2 * attempts)) / bin.attempts;
            }
        });

    if(selectValue2){
        setTimeout(function(){
            court_left
                .draw(tenderData2);
        }, 250);
    }
    if(selectValue){
            court_left
                .draw(tenderData2);
    }

}

function court_func(){
    d3.select(".shot-chart").remove();
}

// var team = d3.select("#img");

//team.append("svg:img")
//    .attr("href", "http://stats.nba.com/media/img/teams/logos/GSW_logo.svg")
//    .attr("width", 400)
//    .attr("height", 400)
//    .attr("x",150)
//    .attr("y",150);