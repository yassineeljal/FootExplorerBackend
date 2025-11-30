export async function getPlayerStats(params: {
  playerId: number;
  leagueId?: number;
  season: number;
}) {
  return {
    message: "Player stats service n'est pas encore implémenté",
    params
  };
}

export async function getTopPlayers(params: {
  leagueId: number;
  season: number;
  type: "scorers" | "assists" | "young";
}) {
  return {
    message: "Top players service n'est pas encore implémenté",
    params
  };
}
