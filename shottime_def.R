# http://stats.nba.com/stats/teamdashboardbyshootingsplits/?TeamID=1610612739&ShotClockRange=24-22&Season=2014-15&MeasureType=Advanced&PerMode=Totals&DateFrom=&DateTo=&PlusMinus=Y&PaceAdjust=Y&Rank=N&LeagueID=00&Location=&Month=0&OpponentTeamID=0&Outcome=&Period=0&Position=&SeasonSegment=&SeasonType=Regular%20Season&VsConference=&GameSegment=&VsDivision=&LastNGames=0
library(jsonlite)
library(dplyr)
library(httr)
library(hexbin)
fetch_shottime_def = function(player_id, season ,shotclockrange) {
  request = GET(
    "http://stats.nba.com/stats/leaguedashplayerptshot",
    query = list(
      LeagueID = "00",
      PerMode="Totals",
      Season= season,
      SeasonType="Regular Season",
      ShotClockRange = shotclockrange,
      ClockDefDistRange = ""
    )
  )
  
  stop_for_status(request)
  data = content(request)
  
  raw_shottime_def = data$resultSets[[1]]$rowSet
  col_names = tolower(as.character(data$resultSets[[1]]$headers))
  
  if (length(raw_shottime_def) == 0) {
    shottime_def = data.frame(
      matrix(nrow = 0, ncol = length(col_names))
    )
  } else {
    shottime_def = data.frame(
      matrix(unlist(raw_shottime_def),
             ncol = length(col_names),
             byrow = TRUE
      )
    )
  }
  
  shottime_def = tbl_df(shottime_def)
  names(shottime_def) = col_names
  return(shottime_def)
}


player_id = unique(players$person_id)
season = "2014-15"
shotclockrange = c("24-22", "22-18%20Very%20Early", "18-15%20Early", "15-7%20Average", "7-4%20Late", "4-0%20Very%20Late")
# closedefdistrange =c("0-2 FT Very Tight", "2-4", "4-6", "6+")
# fetch_shottime_def(player_id, season, shotclockrange, closedefdistrange)

# shottime_2014_15 = 
#   do.call(rbind,lapply(1:length(closedefdistrange), 
#                                         function(k) {do.call(rbind, lapply(1:length(shotclockrange), 
#                                                                            function(j){lapply(1:length(player_id), 
#                                                                                               function(i){
#                                                                                                 fetch_shottime_def(player_id[i], season ,shotclockrange[j], closedefdistrange[k])
#                                                                                               })}))}))
#                            
fetch_shottime_def(201566, season, shotclockrange[2])                       
