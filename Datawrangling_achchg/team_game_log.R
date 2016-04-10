setwd("/Users/achchg/Desktop/nba/VISBnB")

library(jsonlite)
library(httr)
library(dplyr)

fetch_team_game_log = function(teamid, seasontype) {
  request = GET(
  "http://stats.nba.com/stats/teamgamelog",
  query = list(
    TeamID = teamid,
    Season = "2014-15",
    SeasonType = seasontype
  )
)
  stop_for_status(request)
  data = content(request)
#   a = data[3]
#   save(a, file = paste("team_resource",as.character(i),".RData"))
  
raw_teamgamelog_data = data$resultSets[[1]]$rowSet
col_names = tolower(as.character(data$resultSets[[1]]$headers))

if (length(raw_teamgamelog_data) == 0) {
  teamgamelog = data.frame(
    matrix(nrow = 0, ncol = length(col_names))
  )
} else {
  teamgamelog = data.frame(
    matrix(
      unlist(raw_teamgamelog_data),
      ncol = length(col_names),
      byrow = TRUE
    )
  )
}

teamgamelog = tbl_df(teamgamelog)
names(teamgamelog) = col_names
teamgamelog = teamgamelog %>%
  mutate(seasontype = seasontype)

return(list(teamgamelog = teamgamelog))
}
teamid = c(1610612744, 1610612739, 1610612763, 1610612740, 1610612745)
seasontype = c("Regular Season", "Playoffs")

teamgamelog = team_teamgamelog_2014_15 %>%
  mutate(gametype = 1) %>%
  mutate(gametype = ifelse(as.numeric(as.character(game_id)) >= 0041400141 & as.numeric(as.character(game_id)) < 0041400200, 2, gametype)) %>%
  mutate(gametype = ifelse(as.numeric(as.character(game_id)) >= 0041400200 & as.numeric(as.character(game_id)) < 0041400300, 3, gametype)) %>%
  mutate(gametype = ifelse(as.numeric(as.character(game_id)) >= 0041400300 & as.numeric(as.character(game_id)) < 0041400400, 4, gametype)) %>%
  mutate(gametype = ifelse(as.numeric(as.character(game_id)) >= 0041400400 & as.numeric(as.character(game_id)) < 0041400500, 5, gametype)) 

team_encounter_postseason = lapply(1:length(teamid), function(j) do.call(rbind,lapply(1:length(seasontype),
                                                              function(i) fetch_team_game_log(teamid[j], seasontype[i])$teamgamelog)))

filter = do.call(rbind, lapply(2: length(teamid), function(i){
  filter(team_encounter_postseason[[i]], game_id %in% teamgamelog$game_id & as.numeric(as.character(game_id)) > 0041400000)
}))


data = teamgamelog %>%
  select(-min, -fga, -fg_pct, -ft_pct, -fg3m, -fg3a, -fg3_pct, -ftm, -fta, -oreb, -dreb, -pf) %>%
  left_join(filter, by = "game_id") %>%
  select(-min, -fga, -fg_pct, -ft_pct, -fg3m, -fg3a, -fg3_pct, -ftm, -fta, -oreb, -dreb, -pf, -wl.y, -seasontype.y)

playoffs_teamgamelog = data %>%
  filter(gametype > 1)%>%
  mutate(gametype = gametype -1)

write.csv(team_teamgamelog_2014_15, file = "teamgamelog_2014_15.csv")
save(playoffs_teamgamelog, file = "playoffs_teamgamelog.RData")
write.csv(playoffs_teamgamelog, file = "playoffs_teamgamelog.csv")

