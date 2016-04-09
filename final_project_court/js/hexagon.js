
// Load CSV file
var data;
var tenderData = [];
var x = [];
var y = [];

loadData();
function loadData(){
    d3.csv("data/vo.csv", function(error, csv) {
        csv.forEach(function(d) {

            // Convert numeric values to 'numbers'
            d.loc_x = +d.loc_x*10;
            d.loc_y = (+d.loc_y-5.25)*10;
            d.minutes_remaining = +d.minutes_remaining;
            d.period = +d.period;
            d.player_id = +d.player_id;
            d.seconds_remaining = +d.seconds_remaining;
            d.shot_distance = +d.shot_distance;
            d.shot_made_numeric = +d.shot_made_numeric;
            d.shot_value = +d.shot_value;
            d.team_id = +d.team_id;
            d.time = +d.time;
            d.shot_zone = +d.shot_zone;

        });
        // Store csv data in global variable
        data = csv;
    updateVisualization();
})}



function playerFilter() {
    var data1 = data;
    var player1_id = document.getElementById("player-id").value;
    var selectValue = d3.select("#player-id").property("value");

    console.log(selectValue);
    function player1(variable) {
        return variable.player_name == player1_id;
    }
    data_update = data1.filter(player1);

    updateVisualization();
    return false;
}


function updateVisualization(){
    for (var i = 0; i < data.length; i++) {
        tenderData.push({
            "x": Math.ceil((data[i].loc_x + 243) / 10),
            "y": Math.ceil((data[i].loc_y + 17) / 9),
            "made": data[i].shot_made_numeric,
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

    tenderData = finalData;
    var heatRange = ['#5458A2', '#6689BB', '#FADC97', '#F08460', '#B02B48'];
    var court = d3.select("#chart-area")
        .append("svg")
        .chart("BasketballShotChart", {
            width: 600,
            title: data[1].player_name+' 2014-15',
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

    court.draw(tenderData)
}







