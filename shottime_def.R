# http://stats.nba.com/stats/teamdashboardbyshootingsplits/?TeamID=1610612739&ShotClockRange=24-22&Season=2014-15&MeasureType=Advanced&PerMode=Totals&DateFrom=&DateTo=&PlusMinus=Y&PaceAdjust=Y&Rank=N&LeagueID=00&Location=&Month=0&OpponentTeamID=0&Outcome=&Period=0&Position=&SeasonSegment=&SeasonType=Regular%20Season&VsConference=&GameSegment=&VsDivision=&LastNGames=0
library(jsonlite)
library(dplyr)
library(httr)
library(hexbin)
fetch_shottime_def = function(season ,shotclockrange, closedefdistrange) {
  request = GET(
    "http://stats.nba.com/stats/leaguedashplayerptshot",
    query = list(
      LeagueID = "00",
      PerMode="Totals",
      Season= season,
      SeasonType="Regular Season",
      ShotClockRange = shotclockrange[1],
      CloseDefDistRange = closedefdistrange[1]
    )
  )
  
  stop_for_status(request)
  data = content(request)
  # data$fg3_pct = ifelse(is.null(data$fg3_pct), NA, data$fg3_pct)
  
  
  raw_shottime_def = data$resultSets[[1]]$rowSet
  col_names = tolower(as.character(data$resultSets[[1]]$headers))
  # lapply(raw_shottime_def, function(i) {lapply(i, function(j){class(j)=="NULL"})})
  raw_shottime_def[unlist(lapply(raw_shottime_def, function(i) {lapply(i, function(j){is.null(class(j))})}))] <- NA
  
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


season = "2014-15"
shotclockrange = c("24-22", "22-18 Very Early", "18-15 Early", "15-7 Average", "7-4 Late", "4-0 Very Late")
closedefdistrange =c("0-2 Feet - Very Tight", "2-4 Feet - Tight", "4-6 Feet - Open", "6+ Feet - Wide Open")
# fetch_shottime_def(player_id, season, shotclockrange, closedefdistrange)

shottime_2014_15 = 
  do.call(rbind,lapply(1:length(closedefdistrange), 
                                        function(k) {do.call(rbind, lapply(1:length(shotclockrange), 
                                                                           function(j){fetch_shottime_def(season ,shotclockrange[j], closedefdistrange[k])
                                                                                              }))}))
                           
                       
write.csv(shottime_2014_15, file = "shottime_2014_15.csv")
