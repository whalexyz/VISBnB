fetch_playoff_reg = function(season,measuretype){
regularseason = GET(
  "http://stats.nba.com/stats/leaguedashteamstats",
  query = list(
    Season = season,
    MeasureType = measuretype,
    PerMode = "Totals",
    DateFrom = "",
    DateTo = "",
    PlusMinus = "Y",
    PaceAdjust = "Y",
    Rank = "N",
    Location = "",
    Month = 0,
    OpponentTeamID = 0,
    Outcome = "",
    Period = 0,
    SeasonSegment = "",
    SeasonType = "Regular Season",
    VsConference = "",
    GameSegment = "",
    VsDivision = "",
    LastNGames=0
  )
)


content(regularseason)
stop_for_status(regularseason)
data = content(regularseason)

raw_playoff = data$resultSets[[1]]$rowSet
col_names = tolower(as.character(data$resultSets[[1]]$headers))

if (length(raw_playoff) == 0) {
  playoff_reg = data.frame(
    matrix(nrow = 0, ncol = length(col_names))
  )
} else {
  playoff_reg = data.frame(
    matrix(
      unlist(raw_playoff),
      ncol = length(col_names),
      byrow = TRUE
    )
  )
}


playoff_reg = tbl_df(playoff_reg)
names(playoff_reg) = col_names
playoff_reg = playoff_reg %>%
  mutate(measuretype = measuretype)

return(playoff_reg)
}

measuretype = c("Base","Advanced")
playoff_reg_2014_15_base = fetch_playoff_reg(season, measuretype[1])
playoff_reg_2014_15_advanced = fetch_playoff_reg(season, measuretype[2])

write.csv(playoff_reg_2014_15_base, file = "playoff_2014_15_reg_base.csv")
write.csv(playoff_reg_2014_15_advanced, file = "playoff_2014_15_reg_advanced.csv")

fetch_playoff = function(season, poround, measuretype){
  request = GET(
    "http://stats.nba.com/stats/leaguedashteamstats",
    query = list(
      Season = season,
      MeasureType = measuretype,
      PerMode = "Totals",
      DateFrom = "",
      DateTo = "",
      PlusMinus = "Y",
      PaceAdjust = "Y",
      Rank = "N",
      Location = "",
      Month = 0,
      OpponentTeamID = 0,
      Outcome = "",
      Period = 0,
      SeasonSegment = "",
      SeasonType = "Playoffs",
      VsConference = "",
      GameSegment = "",
      VsDivision = "",
      LastNGames=0,
      PORound = poround
    )
  )
  stop_for_status(request)
  data = content(request)
  
  raw_playoff = data$resultSets[[1]]$rowSet
  col_names = tolower(as.character(data$resultSets[[1]]$headers))
  
  if (length(raw_playoff) == 0) {
    playoff = data.frame(
      matrix(nrow = 0, ncol = length(col_names))
    )
  } else {
    playoff = data.frame(
      matrix(
        unlist(raw_playoff),
        ncol = length(col_names),
        byrow = TRUE
      )
    )
  }
  
  
  playoff = tbl_df(playoff)
  names(playoff) = col_names
  playoff = playoff %>%
    mutate(round = poround)
  return(playoff)
  
}

poround = seq(1,4,1)
measuretype = c("Base", "Advanced")
playoff_2014_15_base = do.call(rbind, lapply(1:length(poround),
                                             function(i) {fetch_playoff(season, poround[i], measuretype[1])
                                                                            }))

playoff_2014_15_advanced = do.call(rbind, lapply(1:length(poround),
                                             function(i) {fetch_playoff(season, poround[i], measuretype[2])
                                             }))
write.csv(playoff_2014_15_base, file = "playoff_2014_15_round_base.csv")
write.csv(playoff_2014_15_advanced, file = "playoff_2014_15_round_advanced.csv")
