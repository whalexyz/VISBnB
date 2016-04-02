setwd("/Users/achchg/Desktop/nba")
TeamID = seq(1610612737, 1610612764,1)

library(jsonlite)
for(i in 1:length(TeamID)){
  request = GET(
  "http://stats.nba.com/stats/teamdashboardbyshootingsplits",
  query = list(
    TeamID = TeamID[i],
    Season = "2015-16",
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
  a = data[3]
  save(a, file = paste("team_resource",as.character(i),".RData"))
}


