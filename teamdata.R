setwd("/Users/achchg/Desktop/nba/VISBnB")

library(jsonlite)
fetch_shots_by_team_id_and_season = function(team_id, season) {
  request = GET(
  "http://stats.nba.com/stats/teamdashboardbyshootingsplits",
  query = list(
    TeamID = team_id,
    Season = season,
    MeasureType = "Advanced",
    PerMode = "Totals",
    DateFrom = "",
    DateTo = "",
    PlusMinus = "Y",
    PaceAdjust = "Y",
    Rank = "N",
    LeagueID = "00",
    Location = "",
    Month = 0,
    OpponentTeamID = 0,
    Outcome = "",
    Period = 0,
    Position = "",
    SeasonSegment = "",
    SeasonType = "Regular Season",
    VsConference = "",
    GameSegment = "",
    VsDivision = "",
    LastNGames=0
  )
)
  stop_for_status(request)
  data = content(request)
#   a = data[3]
#   save(a, file = paste("team_resource",as.character(i),".RData"))
  
raw_overallteamdashboard_data = data$resultSets[[1]]$rowSet
col_names = tolower(as.character(data$resultSets[[1]]$headers))

if (length(raw_overallteamdashboard_data) == 0) {
  overallteamdashboard = data.frame(
    matrix(nrow = 0, ncol = length(col_names))
  )
} else {
  overallteamdashboard = data.frame(
    matrix(
      unlist(raw_overallteamdashboard_data),
      ncol = length(col_names),
      byrow = TRUE
    )
  )
}

overallteamdashboard = tbl_df(overallteamdashboard)
names(overallteamdashboard) = col_names

raw_Shot5ftteamdashboard_data = data$resultSets[[2]]$rowSet
Shot5ftteamdashboard_names = tolower(as.character(data$resultSets[[2]]$headers))
Shot5ftteamdashboard = tbl_df(data.frame(
  matrix(unlist(raw_Shot5ftteamdashboard_data), ncol = length(Shot5ftteamdashboard_names), byrow = TRUE)
))
names(Shot5ftteamdashboard) = Shot5ftteamdashboard_names

return(list(overallteamdashboard = overallteamdashboard, Shot5ftteamdashboard = Shot5ftteamdashboard))
}


TeamID = seq(1610612737, 1610612764,1)
season = "2014-15"
team_overallteamdashboard_2014_15 = do.call(rbind,
                        lapply(1:length(TeamID), 
                               function(i) fetch_shots_by_team_id_and_season(TeamID[i],season)$overallteamdashboard))


team_Shot5ftteamdashboard_2014_15 = do.call(rbind,
                                 lapply(1:length(TeamID), 
                                        function(i) fetch_shots_by_team_id_and_season(TeamID[i],season)$Shot5ftteamdashboard))

write.csv(shots_2014_15, file = "overallteamdashboard_2014_15.csv")
write.csv(team_Shot5ftteamdashboard_2014_15, file = "Shot5ftteamdashboard_2014_15.csv")
