import request from 'supertest';
import app from '../../app';

describe('Auth Routes - Integration', () => {

    describe('POST /api/v1/auth/register', () => {

        test('inscription reussie retourne 201 et token', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: 'integration@test.com',
                    username: 'integrationuser',
                    password: 'password123',
                    name: 'Integration User'
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user.email).toBe('integration@test.com');
        });

        test('inscription avec email existant retourne 409', async () => {
            await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: 'duplicate@test.com',
                    username: 'user1',
                    password: 'password123',
                    name: 'User 1'
                });

            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: 'duplicate@test.com',
                    username: 'user2',
                    password: 'password123',
                    name: 'User 2'
                });

            expect(response.status).toBe(409);
        });

    });

    describe('POST /api/v1/auth/login', () => {

        test('login reussi retourne 200 et token', async () => {
            await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: 'login@test.com',
                    username: 'loginuser',
                    password: 'password123',
                    name: 'Login User'
                });

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'login@test.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        });

        test('login avec mauvais password retourne 401', async () => {
            await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: 'badpass@test.com',
                    username: 'badpassuser',
                    password: 'password123',
                    name: 'Bad Pass User'
                });

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'badpass@test.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
        });

        test('login avec user inexistant retourne 401', async () => {
            const response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'nexistepas@test.com',
                    password: 'password123'
                });

            expect(response.status).toBe(401);
        });

    });

    describe('GET /api/v1/auth/me', () => {

        test('retourne user avec token valide', async () => {
            const registerResponse = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: 'me@test.com',
                    username: 'meuser',
                    password: 'password123',
                    name: 'Me User'
                });

            const token = registerResponse.body.token;

            const response = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.user.email).toBe('me@test.com');
        });

        test('retourne 401 sans token', async () => {
            const response = await request(app)
                .get('/api/v1/auth/me');

            expect(response.status).toBe(401);
        });

    });

});
