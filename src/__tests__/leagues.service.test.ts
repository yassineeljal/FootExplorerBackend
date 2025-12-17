import { getLeagueStandingsService, getLeagueOverviewService } from '../services/leagues.service';
import LeagueModel from '../models/League';
import TeamModel from '../models/Team';
import TeamStatsModel from '../models/TeamStats';

describe('leagues.service', () => {

    describe('getLeagueStandingsService', () => {

        test('retourne le classement trie par victoires', async () => {
            const league = await LeagueModel.create({
                apiId: 61,
                name: 'Ligue 1',
                country: 'France',
                season: 2025
            });

            const team1 = await TeamModel.create({
                apiId: 100,
                name: 'Paris Saint-Germain',
                code: 'PSG',
                country: 'France'
            });

            const team2 = await TeamModel.create({
                apiId: 101,
                name: 'Olympique Marseille',
                code: 'OM',
                country: 'France'
            });

            await TeamStatsModel.create({
                team: team1._id,
                league: league._id,
                season: 2025,
                wins: 20,
                goalsFor: 60,
                formation: '4-3-3'
            });

            await TeamStatsModel.create({
                team: team2._id,
                league: league._id,
                season: 2025,
                wins: 15,
                goalsFor: 45,
                formation: '4-4-2'
            });

            const result = await getLeagueStandingsService({ leagueId: 61, season: 2025 });

            expect(result).toHaveLength(2);
            expect(result[0].rank).toBe(1);
            expect(result[0].team.name).toBe('Paris Saint-Germain');
            expect(result[1].rank).toBe(2);
            expect(result[1].team.name).toBe('Olympique Marseille');
        });

        test('retourne tableau vide si league inexistante', async () => {
            const result = await getLeagueStandingsService({ leagueId: 999, season: 2025 });

            expect(result).toEqual([]);
        });

        test('retourne tableau vide si pas de stats pour la saison', async () => {
            await LeagueModel.create({
                apiId: 62,
                name: 'Premier League',
                country: 'England',
                season: 2025
            });

            const result = await getLeagueStandingsService({ leagueId: 62, season: 2025 });

            expect(result).toEqual([]);
        });

    });

    describe('getLeagueOverviewService', () => {

        test('retourne la league si elle existe', async () => {
            await LeagueModel.create({
                apiId: 140,
                name: 'La Liga',
                country: 'Spain',
                season: 2025
            });

            const result = await getLeagueOverviewService({ leagueId: 140, season: 2025 });

            expect(result).not.toBeNull();
            expect(result?.name).toBe('La Liga');
            expect(result?.country).toBe('Spain');
        });

        test('retourne null si league inexistante', async () => {
            const result = await getLeagueOverviewService({ leagueId: 999, season: 2025 });

            expect(result).toBeNull();
        });

    });

});
