setwd("/Users/achchg/Desktop/nba")
TeamID = seq(1610612737, 1610612764,1)

library(jsonlite)
fetch_shots_by_team_id_and_season = function(team_id, season) {
  request = GET(
  "http://stats.nba.com/stats/teamdashboardbyshootingsplits",
  query = list(
    TeamID = TeamID[i],
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
  
raw_shots_data = data$resultSets[[1]]$rowSet
col_names = tolower(as.character(data$resultSets[[1]]$headers))

if (length(raw_shots_data) == 0) {
  shots = data.frame(
    matrix(nrow = 0, ncol = length(col_names))
  )
} else {
  shots = data.frame(
    matrix(
      unlist(raw_shots_data),
      ncol = length(col_names),
      byrow = TRUE
    )
  )
}

shots = tbl_df(shots)
names(shots) = col_names

shots = mutate(shots,
               loc_x = as.numeric(as.character(loc_x)) / 10,
               loc_y = as.numeric(as.character(loc_y)) / 10 + hoop_center_y,
               shot_distance = as.numeric(as.character(shot_distance)),
               shot_made_numeric = as.numeric(as.character(shot_made_flag)),
               shot_made_flag = factor(shot_made_flag, levels = c("1", "0"), labels = c("made", "missed")),
               shot_attempted_flag = as.numeric(as.character(shot_attempted_flag)),
               shot_value = ifelse(tolower(shot_type) == "3pt field goal", 3, 2)
)

raw_league_avg_data = data$resultSets[[2]]$rowSet
league_avg_names = tolower(as.character(data$resultSets[[2]]$headers))
league_averages = tbl_df(data.frame(
  matrix(unlist(raw_league_avg_data), ncol = length(league_avg_names), byrow = TRUE)
))
names(league_averages) = league_avg_names
league_averages = mutate(league_averages,
                         fga = as.numeric(as.character(fga)),
                         fgm = as.numeric(as.character(fgm)),
                         fg_pct = as.numeric(as.character(fg_pct)),
                         shot_value = ifelse(shot_zone_basic %in% c("Above the Break 3", "Backcourt", "Left Corner 3", "Right Corner 3"), 3, 2)
)

return(list(player = shots, league_averages = league_averages))
}

player_id = unique(players$person_id)
season = "2014-15"
shots_2014_15 = do.call(rbind,
                        lapply(1:length(player_id), 
                               function(i) fetch_shots_by_player_id_and_season(player_id[i],season)$player))


league_average_2014_15 = do.call(rbind,
                                 lapply(1:length(player_id), 
                                        function(i) fetch_shots_by_player_id_and_season(player_id[i],season)$league_average))

write.csv(shots_2014_15, file = "shots_2014_15.csv")
write.csv(league_average_2014_15, file = "league_average_2014_15.csv")
