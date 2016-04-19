
function team_filter(variable) {
    return variable.game_id == matchId;
}
function gsw(variable){
    return variable.team_name == "Golden State Warriors"
}
function opponent(variable){
    return variable.team_name != "Golden State Warriors"
}
/*
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

    /*
        var team_select = d3.select('#team-selection1')
            .append('select')
            .attr('id','team-select1')
            .on('change',teamOnchange);

        team_select
            .selectAll('option')
            .data(d3.map(team_data, function(d){return d.game_id;}).keys())
            .enter()
            .append('option')
            .text(function(d){return d;})
            .attr("value", function(d){return d;});

        team_select.property("value", "0041400221");



        updateTeamVisualiteam_zation();
    })}

function teamOnchange(){
    team_court_func();
    team_selectValue = d3.select('#team-select1').property('value');
    team_data_update = team_data.filter(team_filter);

    updateTeamVisualiteam_zation()
}
 */
function updateTeamVisualiteam_zation(gameid){
    team_court_func();
    //team_selectValue = d3.select('#team-select1').property('value');
    //team_data_update = team_data.filter(team_filter);
    team_data_update = team_data.filter(function(d){return d.game_id==gameid});
    team_selectValue1 = team_data_update.filter(function(d){return d.team_id=="1610612744"});
    team_selectValue2 = team_data_update.filter(function(d){return d.team_id!="1610612744"});


    var team_tenderData = [];
    for (var i = 0; i < team_selectValue1.length; i++) {
        team_tenderData.push({
            "x": Math.ceil((team_selectValue1[i].loc_x + 243) / 10),
            "y": Math.ceil((team_selectValue1[i].loc_y + 17) / 9),
            "made": team_selectValue1[i].shot_made_numeric,
            "attempts": 1
        });
    }

    //console.log(team_tenderData);

    var team_tenderData2 = [];
    for (var k = 0; k < team_selectValue2.length; k++) {
        team_tenderData2.push({
            "x": Math.ceil((team_selectValue2[k].loc_x + 243) / 10),
            "y": Math.ceil((team_selectValue2[k].loc_y + 17) / 9),
            "made": team_selectValue2[k].shot_made_numeric,
            "attempts": 1
        });
    }

    var team_coll = d3.nest()
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
        .entries(team_tenderData);


    var team_coll2 = d3.nest()
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
        .entries(team_tenderData2);

    var team_z = [];
    team_coll.forEach(function (a) {
        a.key = JSON.parse("[" + a.key + "]");
        team_z.push(a.values.shootingPercentage);
    });

    var meanShot = (team_z.reduce(function(a, b){return a+b;}))/ team_z.length;
    var team_z_square = [];
    for (var j = 0; j < team_z.length; j++) {team_z_square[j] = team_z[j]*team_z[j]}
    var shotSTDV = Math.sqrt((team_z_square.reduce(function(a,b){return a+b})- team_z.length*meanShot*meanShot)/ team_z.length);

    var team_finalData = [];
    team_coll.forEach(function (a) {
        var k = (a.values.shootingPercentage - meanShot) / shotSTDV;
        team_finalData.push({"x": a.key[0], "y": a.key[1], "team_z": k, "made": a.values.made, "attempts": a.values.attempts})
    });

    var team_z2 = [];
    team_coll2.forEach(function (a) {
        a.key = JSON.parse("[" + a.key + "]");
        team_z2.push(a.values.shootingPercentage);
    });

    var meanShot2 = (team_z2.reduce(function(a, b){return a+b;}))/ team_z2.length;
    var team_z_square2 = [];
    for (var l = 0; l < team_z2.length; l++) {team_z_square2[l] = team_z2[l]*team_z2[l]}
    var shotSTDV2 = Math.sqrt((team_z_square2.reduce(function(a,b){return a+b})- team_z2.length*meanShot2*meanShot2)/ team_z2.length);

    var team_finalData2 = [];
    team_coll2.forEach(function (a) {
        var k2 = (a.values.shootingPercentage - meanShot2) / shotSTDV2;
        team_finalData2.push({"x": a.key[0], "y": a.key[1], "team_z2": k2, "made": a.values.made, "attempts": a.values.attempts})
    });


    team_tenderData = team_finalData;
    var team_heatRange = ['#a1dab4','#253494'];
    var team_court = d3.select("#team-shooting-chart")
        .select("svg")
        .attr("width",800)
        .attr("height", 400)
        .attr("viewBox", "0 0 60 60");

    team_tenderData2 = team_finalData2;
    var team_heatRange2 = ['#fecc5c','#bd0026'];

    var team_court_right = team_court.append("g")
        .attr("class", "team-court")
        .attr("transform", "rotate(90, 10,10)")
        .chart("team_BasketballShotChart", {
            width: 800,
            title: "",
            // instead of makes/attempts, use team_z
            hexagonFillValue: function (d) {
                return d.team_z;
            },
            // switch heat scale domain to [-2.5, 2.5] to reflect range of team_z values
            heatScale: d3.scale.quantile()
                .domain([-2.5, 2.5])
                .range(team_heatRange),

            // update our binning algorithm to properly join team_z values
            // here, we update the team_z value to be proportional to the events of each point

            hexagonBin: function (point, bin) {
                var currentteam_z = bin.team_z || 0;
                var team_totalAttempts = bin.attempts || 0;
                var totalteam_z = currentteam_z * team_totalAttempts;

                var attempts = point.attempts || 1;
                bin.attempts = team_totalAttempts + attempts;
                bin.team_z = (totalteam_z + (point.team_z * attempts)) / bin.attempts;
            }
        });


        setTimeout(function(){
            team_court_right
                .draw(team_tenderData);
        }, 250);


    var team_court_left = team_court.append("g")
        .attr("class", "team-court")
        .attr("transform", "rotate(-90, 40, 10)")
        .chart("team_BasketballShotChart", {
            width: 800,
            title: "",
            // instead of makes/attempts, use team_z
            hexagonFillValue: function (d) {
                return d.team_z2;
            },
            // switch heat scale domain to [-2.5, 2.5] to reflect range of team_z values
            heatScale: d3.scale.quantile()
                .domain([-2.5, 2.5])
                .range(team_heatRange2),

            // update our binning algorithm to properly join team_z values
            // here, we update the team_z value to be proportional to the events of each point

            hexagonBin: function (point, bin) {
                var currentteam_z = bin.team_z2 || 0;
                var team_totalAttempts = bin.attempts || 0;
                var totalteam_z = currentteam_z * team_totalAttempts;

                var attempts = point.attempts || 1;
                bin.attempts = team_totalAttempts + attempts;
                bin.team_z2 = (totalteam_z + (point.team_z2 * attempts)) / bin.attempts;
            }
        });


        setTimeout(function(){
            team_court_left
                .draw(team_tenderData2);
        }, 250);




}

function team_court_func(){
    //d3.select(".team-shot-chart").select("svg").html();
    d3.selectAll(".team-shot-chart").remove();
}