/**
 * Created by Michaelhua on 2016/4/19.
 */



$("#tutorial").click(function(){
    $("#tutorials-mask-div").css("width","100%");
});

//$("#tutorial").trigger("click");

$(".tutorial-btn").click(function(){
    var stepId=this.id.replace("btn-step-","");
    var currentDivId="#tutorial-step-"+stepId;
    var nextDivId="#tutorial-step-"+(parseInt(stepId)+1).toString();
    $(currentDivId).css("display","none");
    $(nextDivId).css("display","block");
    switch (stepId){
        case "3":
            $("#team-shooting-chart").css("position","relative");
            $("#team-shooting-chart").addClass("expose");
            break;
        case "4":
            $("#team-shooting-chart").removeClass("expose");
            $("#team-trad-bar-chart").css("position","relative");
            $("#team-trad-bar-chart").addClass("expose");
            break;
        case "5":
            $("#team-trad-bar-chart").removeClass("expose");
            $("#team-timeline-chart").css("position","relative");
            $("#team-timeline-chart").addClass("expose");
            break;
        case "6":
            $('#timeline').data('slider').setValue(3,true,true);
            break;

        case "7":
            $(".match-button").css("position","relative");
            $(".match-button").addClass("expose");
            break;

        case "8":
            $('.match-button').removeClass("expose");
            $("#team-timeline-chart").removeClass("expose");
            $('#match3').addClass("expose");
            break;
        case "9":
            $("#match3").removeClass("expose");
            $("#team1-div ,#team2-div").css("position","relative");
            $("#team1-div ,#team2-div").addClass("expose");
            break;
        case "10":
            $("#team1-div ,#team2-div").removeClass("expose");
            $("#tutorials-mask-div").css("width","0%");
            break;
    }
});

$(".closebtn").click(function(){
    $("#tutorials-mask-div").css("width","0%");
    $(".expose").removeClass("expose");
    $(".tutorial-step-div").css("display","none");
    $("#tutorial-step-1").css("display","block");
});

