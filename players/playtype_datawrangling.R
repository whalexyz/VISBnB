# setwd("/Users/achchg/Desktop/nba/VISBnB/players")
library(dplyr)

t1 = read.csv("ball_handler.csv", header = T, sep = "\t")
t2 = read.csv("cut.csv", header = T, sep = "\t")
t3 = read.csv("hand_off.csv", header = F, sep = "\t")
names(t3) = colnames(t2)
t4 = read.csv("isolation.csv", header = T, sep = "\t")
t5 = read.csv("misc.csv", header = T, sep = "\t")
t6 = read.csv("off_screen.csv", header = T, sep = "\t")
t7 = read.csv("post_up.csv", header = T, sep = "\t")
t8 = read.csv("putbacks.csv", header = T, sep = "\t")
t9 = read.csv("roll_man.csv", header = T, sep = "\t")
t10 = read.csv("spot_up.csv", header = T, sep = "\t")
t11 = read.csv("transition.csv", header = T, sep = "\t")

i = seq(1,11,1)
list = sapply(i,function(j) paste("t",j, sep = ""))
player_playtype = do.call(rbind, lapply(1:length(list), function(i) {get(list[i])%>%mutate(type = i)}))
player_playtype = tbl_df(player_playtype)

percentage_wrangling = grep("Freq", names(player_playtype), value = T)

player_playtype = player_playtype %>%
  mutate(Percentile = Percentile/100)%>% 
  mutate(Freq = as.numeric(sub("%", "", Freq))/100)%>%
  mutate(FT_Freq = as.numeric(sub("%", "", FT_Freq))/100)%>%
  mutate(TO_Freq = as.numeric(sub("%", "", TO_Freq))/100)%>%
  mutate(SF_Freq = as.numeric(sub("%", "", SF_Freq))/100)%>%
  mutate(And_One_Freq = as.numeric(sub("%", "", And_One_Freq))/100)%>%
  mutate(Score_Freq = as.numeric(sub("%", "", Score_Freq))/100)

Player_info = select(players, display_first_last, team_id, team_abbreviation, person_id)%>%
  rename(Player = display_first_last)

player_playtype = Player_info %>%
  full_join(player_playtype, by = "Player")

save(player_playtype, file = "player_playtype.csv")

### Team play type: ###
setwd("/Users/achchg/Desktop/nba/VISBnB/teams")
t1 = read.csv("ball_handler.csv", header = T, sep = "\t")
t2 = read.csv("cut.csv", header = T, sep = "\t")
t3 = read.csv("hand_off.csv", header = T, sep = "\t")
t4 = read.csv("isolation.csv", header = T, sep = "\t")
t5 = read.csv("misc.csv", header = T, sep = "\t")
t6 = read.csv("off_screen.csv", header = T, sep = "\t")
t7 = read.csv("post_up.csv", header = T, sep = "\t")
t8 = read.csv("putbacks.csv", header = T, sep = "\t")
t9 = read.csv("roll_man.csv", header = T, sep = "\t")
t10 = read.csv("spot_up.csv", header = T, sep = "\t")
t11 = read.csv("transition.csv", header = T, sep = "\t")

i = seq(1,11,1)
list = sapply(i,function(j) paste("t",j, sep = ""))
team_playtype = do.call(rbind, lapply(1:length(list), function(i) {get(list[i])%>%mutate(type = i)}))
team_playtype = tbl_df(team_playtype)

team_playtype = team_playtype %>% 
  select(-FT_Freq, -TO_Freq, -SF_Freq, -And_One_Freq, -Score_Freq) %>%
  rename(FT_Freq = FT, TO_Freq = TO, SF_Freq = SF, And_One_Freq = And_One, Score_Freq = Score)

team_playtype = team_playtype %>%
  mutate(Percentile = Percentile/100)%>% 
  mutate(Freq = as.numeric(sub("%", "", Freq))/100)%>%
  mutate(FT_Freq = as.numeric(sub("%", "", FT_Freq))/100)%>%
  mutate(TO_Freq = as.numeric(sub("%", "", TO_Freq))/100)%>%
  mutate(SF_Freq = as.numeric(sub("%", "", SF_Freq))/100)%>%
  mutate(And_One_Freq = as.numeric(sub("%", "", And_One_Freq))/100)%>%
  mutate(Score_Freq = as.numeric(sub("%", "", Score_Freq))/100)

team_info = select(players, team_id, team_abbreviation, team_city, team_name)%>%
  unite(Team, team_city, team_name, sep = " ")%>%
  filter(team_id != 0)%>%
  group_by(team_id)%>%
  summarize(team_abbreviation = unique(team_abbreviation), Team = unique(Team))

team_playtype =  team_playtype%>%
  left_join(team_info, by = "Team")

save(team_playtype, file = "team_playtype.csv")
