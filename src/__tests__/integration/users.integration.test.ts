import request from 'supertest';
import app from '../../app';

describe('Users Routes - Integration', () => {

    async function createUserAndGetToken(email: string, username: string) {
        const response = await request(app)
            .post('/api/v1/auth/register')
            .send({
                email,
                username,
                password: 'password123',
                name: 'Test User'
            });
        return response.body.token;
    }

    describe('GET /api/v1/users/me', () => {

        test('retourne le profil avec token valide', async () => {
            const token = await createUserAndGetToken('usersme@test.com', 'usersmeuser');

            const response = await request(app)
                .get('/api/v1/users/me')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.user).toHaveProperty('email', 'usersme@test.com');
        });

        test('retourne 401 sans token', async () => {
            const response = await request(app)
                .get('/api/v1/users/me');

            expect(response.status).toBe(401);
        });

    });

    describe('PATCH /api/v1/users/me', () => {

        test('modifie le profil avec succes', async () => {
            const token = await createUserAndGetToken('patch@test.com', 'patchuser');

            const response = await request(app)
                .patch('/api/v1/users/me')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Nouveau Nom' });

            expect(response.status).toBe(200);
            expect(response.body.user.name).toBe('Nouveau Nom');
        });

        test('retourne 401 sans token', async () => {
            const response = await request(app)
                .patch('/api/v1/users/me')
                .send({ name: 'Test' });

            expect(response.status).toBe(401);
        });

    });

    describe('POST /api/v1/users/favorites', () => {

        test('ajoute une equipe aux favoris', async () => {
            const token = await createUserAndGetToken('fav@test.com', 'favuser');

            const response = await request(app)
                .post('/api/v1/users/favorites')
                .set('Authorization', `Bearer ${token}`)
                .send({ type: 'team', apiId: 123, action: 'add' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        test('retire une equipe des favoris', async () => {
            const token = await createUserAndGetToken('fav2@test.com', 'favuser2');

            await request(app)
                .post('/api/v1/users/favorites')
                .set('Authorization', `Bearer ${token}`)
                .send({ type: 'team', apiId: 456, action: 'add' });

            const response = await request(app)
                .post('/api/v1/users/favorites')
                .set('Authorization', `Bearer ${token}`)
                .send({ type: 'team', apiId: 456, action: 'remove' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        test('retourne 400 si champs manquants', async () => {
            const token = await createUserAndGetToken('fav3@test.com', 'favuser3');

            const response = await request(app)
                .post('/api/v1/users/favorites')
                .set('Authorization', `Bearer ${token}`)
                .send({ type: 'team' });

            expect(response.status).toBe(400);
        });

        test('retourne 401 sans token', async () => {
            const response = await request(app)
                .post('/api/v1/users/favorites')
                .send({ type: 'team', apiId: 123, action: 'add' });

            expect(response.status).toBe(401);
        });

    });

    describe('GET /api/v1/users/favorites', () => {

        test('retourne les favoris du user', async () => {
            const token = await createUserAndGetToken('getfav@test.com', 'getfavuser');

            await request(app)
                .post('/api/v1/users/favorites')
                .set('Authorization', `Bearer ${token}`)
                .send({ type: 'team', apiId: 789, action: 'add' });

            const response = await request(app)
                .get('/api/v1/users/favorites')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('players');
            expect(response.body).toHaveProperty('teams');
            expect(response.body).toHaveProperty('leagues');
        });

        test('retourne 401 sans token', async () => {
            const response = await request(app)
                .get('/api/v1/users/favorites');

            expect(response.status).toBe(401);
        });

    });

});
