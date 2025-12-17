import { registerUser, loginUser, getMe } from '../services/auth.service';
import { UserModel } from '../models/User';

describe('auth.service', () => {

    describe('registerUser', () => {

        test('inscription reussie', async () => {
            const data = {
                email: 'test@test.com',
                username: 'testuser',
                password: 'password123',
                name: 'Test User'
            };

            const result = await registerUser(data);

            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('token');
        });

        test('email deja utilise', async () => {
            await UserModel.create({
                email: 'existe@test.com',
                username: 'existant',
                password: 'password123',
                name: 'User Existant'
            });

            const data = {
                email: 'existe@test.com',
                username: 'nouveau',
                password: 'password123',
                name: 'Nouveau User'
            };

            const result = await registerUser(data);

            expect(result).toHaveProperty('conflict', true);
        });

        test('username deja utilise', async () => {
            await UserModel.create({
                email: 'premier@test.com',
                username: 'memeusername',
                password: 'password123',
                name: 'Premier User'
            });

            const data = {
                email: 'autre@test.com',
                username: 'memeusername',
                password: 'password123',
                name: 'Autre User'
            };

            const result = await registerUser(data);

            expect(result).toHaveProperty('conflict', true);
        });

    });

    describe('loginUser', () => {

        test('login reussi avec email', async () => {
            await registerUser({
                email: 'login@test.com',
                username: 'loginuser',
                password: 'password123',
                name: 'Login User'
            });

            const result = await loginUser({
                email: 'login@test.com',
                password: 'password123'
            });

            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('token');
        });

        test('login reussi avec username', async () => {
            await registerUser({
                email: 'login2@test.com',
                username: 'loginuser2',
                password: 'password123',
                name: 'Login User 2'
            });

            const result = await loginUser({
                username: 'loginuser2',
                password: 'password123'
            });

            expect(result).toHaveProperty('user');
            expect(result).toHaveProperty('token');
        });

        test('mauvais mot de passe', async () => {
            await registerUser({
                email: 'mdp@test.com',
                username: 'mdpuser',
                password: 'password123',
                name: 'Mdp User'
            });

            const result = await loginUser({
                email: 'mdp@test.com',
                password: 'mauvaispassword'
            });

            expect(result).toHaveProperty('invalid', true);
        });

        test('utilisateur inexistant', async () => {
            const result = await loginUser({
                email: 'nexistepas@test.com',
                password: 'password123'
            });

            expect(result).toHaveProperty('invalid', true);
        });

    });

    describe('getMe', () => {

        test('retourne le user si id valide', async () => {
            const registerResult = await registerUser({
                email: 'getme@test.com',
                username: 'getmeuser',
                password: 'password123',
                name: 'GetMe User'
            });

            const user = (registerResult as any).user;
            const result = await getMe(user._id.toString());

            expect(result).not.toBeNull();
            expect(result?.email).toBe('getme@test.com');
        });

        test('retourne null si id invalide', async () => {
            const result = await getMe('507f1f77bcf86cd799439011');

            expect(result).toBeNull();
        });

    });

});
