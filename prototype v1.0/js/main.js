/*
stage 1: 41400141-44
stage 2: 41400221-26
stage 3: 41400311-15
stage 4: 41400401-06
    */

matchSelect();

//var scoreSVG = d3.select(".score-div").append("svg").attr("width", 160).attr("height", 160);

$('#timeline').slider().on('change',function(value){
    sliderValue = $('#timeline').data('slider').getValue();
    opId=opList[sliderValue-1];
    d3.select("#team2-img").attr("src","img/"+opId+".png");
    d3.select("#team2-title").text(refIdToName[opId]).style("color",teamColors[sliderValue-1]);
    matchSelect();
    setButton();
});

function matchSelect(){
    var loopNum;
    switch (sliderValue){
        case 1:
            loopNum=4;
            gameIdBase=41400140;
            break;
        case 2:
            loopNum=6;
            gameIdBase=41400220;
            break;
        case 3:
            loopNum=5;
            gameIdBase=41400310;
            break;
        case 4:
            loopNum=6;
            gameIdBase=41400400;
            break;
    }

    $(".match-button").map(function(){
        //console.log(($(this).attr("class")));
        if($(this).is(".disabled")){
            $(this).removeClass("disabled")
        }
        if (this.id.replace("match","")>loopNum){
            $(this).addClass("disabled");
        }
    });
    $("#match1").trigger("click");
    console.log("start");
}

$(".match-button").click(function(){
    matchSeriesId=parseInt(this.id.replace("match",""));
    setMatchId();
});


function setMatchId(){
    matchId="00"+(matchSeriesId+gameIdBase).toString();
    opId=opList[sliderValue-1];
    statNames[1]=refIdToName[opId];

    updateTeamVisualiteam_zation(matchId);
    selectStatData();
    displayScore();
}

//load stat bar chart data
d3.csv("data/gamelog.csv",function(error,csv){
    csv.forEach(function(d){
        if (error) throw error;
        // Convert numeric values to 'numbers'
        d.fgm_x=+d.fgm_x;
        d.reb_x=+d.reb_x;
        d.ast_x=+d.ast_x;
        d.stl_x=+d.stl_x;
        d.blk_x=+d.blk_x;
        d.tov_x=+d.tov_x;
        d.pts_x=+d.pts_x;
        d.fgm_y=+d.fgm_y;
        d.reb_y=+d.reb_y;
        d.ast_y=+d.ast_y;
        d.stl_y=+d.stl_y;
        d.blk_y=+d.blk_y;
        d.tov_y=+d.tov_y;
        d.pts_y=+d.pts_y;
    });
    allStat=csv;
    displayScore();
    setButton();
    selectStatData();
});

//team-shooting-chart
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

    updateTeamVisualiteam_zation(matchId);
});

function setButton(){
    d3.selectAll(".disabled").style("background-color","#333").text("");
    var results=allStat.filter(function(d){return d.team_id_y==opId});
    results.forEach(function(value,index){
        //console.log(index);
        var buttonColor,buttonText;
        if(value.wl_x=="W"){
            buttonColor=gswColor;
            buttonText="W";
        }else{
            buttonColor=teamColors[sliderValue-1];
            buttonText="L";
        }
        d3.select("#match"+(index+1).toString()).style("background-color",buttonColor).text(buttonText);
    });
    //d3.select(".match-button").text(refIdToName[opId]).style("color",teamColors[sliderValue-1]);
}

function displayScore(){
    //allStat.filter(function(d){return d.game_id=matchId});
    var scores=allStat.filter(function(d){return d.game_id==matchId});
    //console.log(allStat);
    var score1=scores[0].pts_x;
    var score2=scores[0].pts_y;
    scoreSVG1.selectAll("text")
        .data([score1])
        .enter()
        .append("text")
        .attr("class","score-text").attr("x",40).attr("y",92).attr("fill",gswColor)
        .text(function(d){return d});

    //console.log(scoreSVG.selectAll("text").enter());
    scoreSVG1.selectAll("text")
        .transition()
        .duration(300)
        .tween( 'text',function(d){
            var currentValue=+this.textContent;
            var i=d3.interpolateRound( currentValue, score1 );
            return function(t) {
                this.textContent = i(t);
            };
        } );

    scoreSVG2.selectAll("text")
        .data([score2])
        .enter()
        .append("text")
        .attr("class","score-text").attr("x",40).attr("y",92).attr("y",92)
        .text(function(d){return d});

    //console.log(scoreSVG.selectAll("text").enter());
    scoreSVG2.selectAll("text")
        .transition()
        .duration(300)
        .attr("fill",teamColors[sliderValue-1])
        .tween( 'text',function(d){
            var currentValue=+this.textContent;
            var i=d3.interpolateRound( currentValue, score2 );
            return function(t) {
                this.textContent = i(t);
            };
        } );

    //console.log(scoreSVG.selectAll("text").exit());



    //d3.select("#team1-score").text(score1).style("color",gswColor);
    //d3.select("#team2-score").text(score2).style("color",teamColors[sliderValue-1]);
}

