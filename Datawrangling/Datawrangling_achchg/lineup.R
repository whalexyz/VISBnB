fetch_lineup = function(group_quantity, season) {
request = GET(
  "http://stats.nba.com/stats/leaguedashlineups",
  query = list(
    GroupQuantity = group_quantity,
    SeasonType = "Regular Season",
    MeasureType = "Advanced",
    PerMode = "Totals",
    PlusMinus = "Y",
    PaceAdjust = "Y",
    Rank = "N",
    Season = season,
    Outcome = "",
    Location = "",
    Month = "0",
    SeasonSegment = "",
    DateFrom = "",
    DateTo = "",
    OpponentTeamID = "0",
    VsConference = "",
    VsDivision = "",
    GameSegment = "",
    Period = "0",
    LastNGames = "0"
  )
)

stop_for_status(request)
data = content(request)
#   a = data[3]
#   save(a, file = paste("team_resource",as.character(i),".RData"))

raw_lineup = data$resultSets[[1]]$rowSet
col_names = tolower(as.character(data$resultSets[[1]]$headers))

if (length(raw_lineup) == 0) {
  lineup = data.frame(
    matrix(nrow = 0, ncol = length(col_names))
  )
} else {
  lineup = data.frame(
    matrix(
      unlist(raw_lineup),
      ncol = length(col_names),
      byrow = TRUE
    )
  )
}


lineup = tbl_df(lineup)
names(lineup) = col_names

lineup = lineup %>% 
  filter(as.numeric(levels(gp))[gp] > 10) %>%
  mutate(group_quantity = group_quantity)

}

season = "2014-15"
group_quantity = c(2,3,5)

lineup_2014_15 = do.call(rbind,
                        lapply(1:length(group_quantity), function(i) fetch_lineup(group_quantity[i], season)))


lineup_2014_15 = lineup_2014_15 %>%
  separate(group_id, c("player1", "player2", "player3", "player4", "player5"), sep = "-") 

write.csv(lineup_2014_15, file = "lineup_2014_15.csv")
