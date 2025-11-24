# FootExplorer


League:
    id:Integer
    name:String
    country:String
    logo:String
    season:Integer

Team:
    id:Integer
    name:String
    logo:String
    founded:Integer
    Stade_name:String

TeamStats:
    team_id:FK
    league_id:FK
    season:Integer
    form: String
    fixtures:JSON
    goals:JSON
    formations:JSON

Player:
    id:Integer
    name:String
    firstname:String
    lastname:String
    age:Integer
    birth_date:Date
    nationality:String
    photo:String

PlayerStatistics:
    player_id:FK
    team_id:FK
    league_id:FK
    season:Integer
    minutes_played:Integer
    position:String
    rating:Float
    goals_total:Integer
    assists:Integer
    cards_yellow:Integer
    cards_red:Integer

Standing:
    rank:Integer
    team_id:FK
    league_id:FK
    points:Integer
    goals_diff:Integer
    group:String
    description:String



