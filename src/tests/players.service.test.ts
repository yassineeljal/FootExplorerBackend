import { getTopPlayers, searchPlayers, getPlayerStats } from '../services/players.service';
import PlayerModel from '../models/Player';
import PlayerStatsModel from '../models/PlayerStats';
import LeagueModel from '../models/League';
import TeamModel from '../models/Team';

describe('players.service', () => {

    describe('getTopPlayers', () => {

        test('retourne les top joueurs tries par buts', async () => {
            const league = await LeagueModel.create({
                apiId: 61,
                name: 'Ligue 1',
                country: 'France',
                season: 2025
            });

            const team = await TeamModel.create({
                apiId: 100,
                name: 'Paris Saint-Germain',
                code: 'PSG',
                country: 'France'
            });

            const player1 = await PlayerModel.create({
                apiId: 1001,
                name: 'Kylian Mbappé',
                firstname: 'Kylian',
                lastname: 'Mbappé',
                age: 26,
                nationality: 'France',
                photo: 'https://example.com/mbappe.png'
            });

            const player2 = await PlayerModel.create({
                apiId: 1002,
                name: 'Bradley Barcola',
                firstname: 'Bradley',
                lastname: 'Barcola',
                age: 22,
                nationality: 'France',
                photo: 'https://example.com/barcola.png'
            });

            await PlayerStatsModel.create({
                player: player1._id,
                team: team._id,
                league: league._id,
                season: 2025,
                goals: 25,
                minutes: 2500,
                rating: '8.5'
            });

            await PlayerStatsModel.create({
                player: player2._id,
                team: team._id,
                league: league._id,
                season: 2025,
                goals: 15,
                minutes: 2000,
                rating: '7.8'
            });

            const result = await getTopPlayers({ leagueId: 61, season: 2025 });

            expect(result).toHaveLength(2);
            expect(result[0].player.name).toBe('Kylian Mbappé');
            expect(result[0].statistics[0].goals.total).toBe(25);
            expect(result[1].player.name).toBe('Bradley Barcola');
        });

        test('retourne tableau vide si league inexistante', async () => {
            const result = await getTopPlayers({ leagueId: 999, season: 2025 });

            expect(result).toEqual([]);
        });

        test('retourne tableau vide si pas de stats', async () => {
            await LeagueModel.create({
                apiId: 62,
                name: 'Premier League',
                country: 'England',
                season: 2025
            });

            const result = await getTopPlayers({ leagueId: 62, season: 2025 });

            expect(result).toEqual([]);
        });

    });

    describe('searchPlayers', () => {

        test('trouve les joueurs par nom', async () => {
            await PlayerModel.create({
                apiId: 2001,
                name: 'Lionel Messi',
                firstname: 'Lionel',
                lastname: 'Messi',
                nationality: 'Argentina'
            });

            await PlayerModel.create({
                apiId: 2002,
                name: 'Cristiano Ronaldo',
                firstname: 'Cristiano',
                lastname: 'Ronaldo',
                nationality: 'Portugal'
            });

            const result = await searchPlayers('messi');

            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Lionel Messi');
        });

        test('recherche insensible a la casse', async () => {
            await PlayerModel.create({
                apiId: 2003,
                name: 'Neymar Junior',
                firstname: 'Neymar',
                lastname: 'Junior',
                nationality: 'Brazil'
            });

            const result = await searchPlayers('NEYMAR');

            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('Neymar Junior');
        });

        test('retourne tableau vide si aucun match', async () => {
            await PlayerModel.create({
                apiId: 2004,
                name: 'Karim Benzema',
                firstname: 'Karim',
                lastname: 'Benzema',
                nationality: 'France'
            });

            const result = await searchPlayers('zidane');

            expect(result).toEqual([]);
        });

    });

    describe('getPlayerStats', () => {

        test('retourne les stats du joueur', async () => {
            const league = await LeagueModel.create({
                apiId: 140,
                name: 'La Liga',
                country: 'Spain',
                season: 2025
            });

            const team = await TeamModel.create({
                apiId: 200,
                name: 'Real Madrid',
                code: 'RMA',
                country: 'Spain'
            });

            const player = await PlayerModel.create({
                apiId: 3001,
                name: 'Vinicius Junior',
                firstname: 'Vinicius',
                lastname: 'Junior',
                age: 24,
                nationality: 'Brazil'
            });

            await PlayerStatsModel.create({
                player: player._id,
                team: team._id,
                league: league._id,
                season: 2025,
                goals: 20,
                minutes: 2800,
                rating: '8.2'
            });

            const result = await getPlayerStats({ playerId: 3001, season: 2025 });

            expect(result).not.toBeNull();
            expect(result?.player.name).toBe('Vinicius Junior');
            expect(result?.stats).toHaveLength(1);
        });

        test('retourne null si joueur inexistant', async () => {
            const result = await getPlayerStats({ playerId: 9999, season: 2025 });

            expect(result).toBeNull();
        });

    });

});
