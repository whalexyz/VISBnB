setwd("/Users/achchg/Desktop/nba/VISBnB")

library(jsonlite)
library(httr)
library(dplyr)

fetch_team_game_log = function(seasontype) {
  request = GET(
  "http://stats.nba.com/stats/teamgamelog",
  query = list(
    TeamID = 1610612744,
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

seasontype = c("Regular Season", "Playoffs")
team_teamgamelog_2014_15 = do.call(rbind,lapply(1:length(seasontype),
                               function(i) fetch_team_game_log(seasontype[i])$teamgamelog))


write.csv(team_teamgamelog_2014_15, file = "teamgamelog_2014_15.csv")
write.csv(team_teamgamelog_2014_15, file = "teamgamelog_2014_15.csv")
