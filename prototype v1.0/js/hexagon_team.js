
// Load CSV file
var team_data;
var team_data_update;
//var x = [];
//var y = [];
var team_selectValue;
var team_selectValue1;
var team_selectValue2;

function team_filter(variable) {
    return variable.game_id == team_selectValue;
}
function gsw(variable){
    return variable.team_name == "Golden State Warriors"
}
function opponent(variable){
    return variable.team_name != "Golden State Warriors"
}

loadTeamData();

function loadTeamData(){
    d3.csv("data/team_shots.csv", function(error, csv) {
        csv.forEach(function(d) {

            // Convert numeric values to 'numbers'
            d.loc_x = +d.loc_x * 10;
            d.loc_y = (+d.loc_y-5.25)*10;
            d.period = +d.period;
            d.shot_made_numeric = +d.shot_made_numeric;

        });
        // Store csv data in global variable
        team_data = csv;


        var select = d3.select('#team-selection1')
            .append('select')
            .attr('id','team-select1')
            .on('change',teamOnchange);

        select
            .selectAll('option')
            .data(d3.map(team_data, function(d){return d.game_id;}).keys())
            .enter()
            .append('option')
            .text(function(d){return d;})
            .attr("value", function(d){return d;});

        select.property("value", "0041400221");

        updateTeamVisualization();
    })}

function teamOnchange(){
    court_func();
    team_selectValue = d3.select('#team-select1').property('value');
    team_data_update = team_data.filter(team_filter);

    updateTeamVisualization()
}

function updateTeamVisualization(){
    court_func();
    team_selectValue = d3.select('#team-select1').property('value');
    team_data_update = team_data.filter(team_filter);
    team_selectValue1 = team_data_update.filter(gsw);
    team_selectValue2 = team_data_update.filter(opponent);


    var tenderData = [];
    for (var i = 0; i < team_selectValue1.length; i++) {
        tenderData.push({
            "x": Math.ceil((team_selectValue1[i].loc_x + 243) / 10),
            "y": Math.ceil((team_selectValue1[i].loc_y + 17) / 9),
            "made": team_selectValue1[i].shot_made_numeric,
            "attempts": 1
        });
    }

    //console.log(tenderData);

    var tenderData2 = [];
    for (var k = 0; k < team_selectValue2.length; k++) {
        tenderData2.push({
            "x": Math.ceil((team_selectValue2[k].loc_x + 243) / 10),
            "y": Math.ceil((team_selectValue2[k].loc_y + 17) / 9),
            "made": team_selectValue2[k].shot_made_numeric,
            "attempts": 1
        });
    }

    //console.log(tenderData2)

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
    var heatRange = ['#a1dab4','#253494'];
    var court = d3.select("#team-shooting-chart")
        .select("svg")
        .attr("width",1000)
        .attr("height", 600)
        .attr("viewBox", "0 0 60 60");

    tenderData2 = finalData2;
    var heatRange2 = ['#fecc5c','#bd0026'];

    var court_right = court.append("g")
        .attr("class", "team-court")
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


        setTimeout(function(){
            court_right
                .draw(tenderData);
        }, 250);


    var court_left = court.append("g")
        .attr("class", "team-court")
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


        setTimeout(function(){
            court_left
                .draw(tenderData2);
        }, 250);




}

function court_func(){
    d3.select(".shot-chart").remove();
}