import { getTeamOverview, getTeamStats } from '../services/teams.service';
import TeamModel from '../models/Team';
import TeamStatsModel from '../models/TeamStats';
import LeagueModel from '../models/League';

describe('teams.service', () => {

    describe('getTeamOverview', () => {

        test('retourne equipe si elle existe', async () => {
            await TeamModel.create({
                apiId: 123,
                name: 'Paris Saint-Germain',
                code: 'PSG',
                country: 'France',
                founded: 1970,
                logo: 'https://example.com/psg.png'
            });

            const result = await getTeamOverview({ teamId: 123, leagueId: 61, season: 2025 });

            expect(result).not.toBeNull();
            expect(result?.name).toBe('Paris Saint-Germain');
        });

        test('retourne null si equipe inexistante', async () => {
            const result = await getTeamOverview({ teamId: 999, leagueId: 61, season: 2025 });

            expect(result).toBeNull();
        });

    });

    describe('getTeamStats', () => {

        test('retourne stats si elles existent', async () => {
            const league = await LeagueModel.create({
                apiId: 61,
                name: 'Ligue 1',
                country: 'France',
                season: 2025
            });

            const team = await TeamModel.create({
                apiId: 456,
                name: 'Olympique Marseille',
                code: 'OM',
                country: 'France'
            });

            await TeamStatsModel.create({
                team: team._id,
                league: league._id,
                season: 2025,
                wins: 15,
                goalsFor: 45,
                formation: '4-3-3'
            });

            const result = await getTeamStats({ teamName: 'Olympique Marseille', season: 2025 });

            expect(result).toHaveProperty('wins', 15);
            expect(result).toHaveProperty('goalsFor', 45);
        });

        test('erreur si equipe inexistante', async () => {
            await expect(
                getTeamStats({ teamName: 'Equipe Inexistante', season: 2025 })
            ).rejects.toThrow();
        });

    });

});
