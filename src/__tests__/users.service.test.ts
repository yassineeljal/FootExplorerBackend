import { getMeService, patchMeService, manageFavoriteService, getMyFavoritesService } from '../services/users.service';
import { UserModel } from '../models/User';

describe('users.service', () => {

    describe('getMeService', () => {

        test('retourne le user si id valide', async () => {
            const user = await UserModel.create({
                email: 'getme@test.com',
                username: 'getmeuser',
                password: 'password123',
                name: 'GetMe User'
            });

            const result = await getMeService(user._id.toString());

            expect(result).not.toBeNull();
            expect(result?.email).toBe('getme@test.com');
        });

        test('retourne null si id invalide', async () => {
            const result = await getMeService('507f1f77bcf86cd799439011');

            expect(result).toBeNull();
        });

    });

    describe('patchMeService', () => {

        test('modifie le profil avec succes', async () => {
            const user = await UserModel.create({
                email: 'patch@test.com',
                username: 'patchuser',
                password: 'password123',
                name: 'Ancien Nom'
            });

            const result = await patchMeService(user._id.toString(), { name: 'Nouveau Nom' });

            expect(result).toHaveProperty('user');
            expect((result as any).user.name).toBe('Nouveau Nom');
        });

        test('retourne erreur si user inexistant', async () => {
            const result = await patchMeService('507f1f77bcf86cd799439011', { name: 'Test' });

            expect(result).toHaveProperty('error');
            expect((result as any).error.status).toBe(404);
        });

    });

    describe('manageFavoriteService', () => {

        test('ajoute une equipe aux favoris', async () => {
            const user = await UserModel.create({
                email: 'fav@test.com',
                username: 'favuser',
                password: 'password123',
                name: 'Fav User'
            });

            await manageFavoriteService(user._id.toString(), 'team', 123, 'add');

            const updated = await UserModel.findById(user._id);
            expect(updated?.favoriteTeams).toContain(123);
        });

        test('retire une equipe des favoris', async () => {
            const user = await UserModel.create({
                email: 'fav2@test.com',
                username: 'favuser2',
                password: 'password123',
                name: 'Fav User 2',
                favoriteTeams: [123, 456]
            });

            await manageFavoriteService(user._id.toString(), 'team', 123, 'remove');

            const updated = await UserModel.findById(user._id);
            expect(updated?.favoriteTeams).not.toContain(123);
            expect(updated?.favoriteTeams).toContain(456);
        });

        test('ajoute un joueur aux favoris', async () => {
            const user = await UserModel.create({
                email: 'fav3@test.com',
                username: 'favuser3',
                password: 'password123',
                name: 'Fav User 3'
            });

            await manageFavoriteService(user._id.toString(), 'player', 999, 'add');

            const updated = await UserModel.findById(user._id);
            expect(updated?.favoritePlayers).toContain(999);
        });

        test('erreur si type invalide', async () => {
            const user = await UserModel.create({
                email: 'fav4@test.com',
                username: 'favuser4',
                password: 'password123',
                name: 'Fav User 4'
            });

            await expect(
                manageFavoriteService(user._id.toString(), 'invalide' as any, 123, 'add')
            ).rejects.toThrow();
        });

    });

    describe('getMyFavoritesService', () => {

        test('retourne les favoris du user', async () => {
            const user = await UserModel.create({
                email: 'myfav@test.com',
                username: 'myfavuser',
                password: 'password123',
                name: 'MyFav User',
                favoriteTeams: [123],
                favoritePlayers: [456],
                favoriteLeagues: [789]
            });

            const result = await getMyFavoritesService(user._id.toString());

            expect(result).toHaveProperty('players');
            expect(result).toHaveProperty('teams');
            expect(result).toHaveProperty('leagues');
        });

        test('retourne null si user inexistant', async () => {
            const result = await getMyFavoritesService('507f1f77bcf86cd799439011');

            expect(result).toBeNull();
        });

    });

});
