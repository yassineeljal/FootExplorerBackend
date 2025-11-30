import express, { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import config from 'config';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/users.routes';
import { logRequest, logError } from './middlewares/logging'; 

const baseApi = config.get<string>('app.basePath');
const corsOrigins = config.get<string[]>('security.cors.origins');
const rateLimitConfig = config.get<{ windowMs: number, max: number }>('security.rateLimit');
const dbUri = config.get<string>('db.uri');
const port = config.get<number>('server.http.port');


const app = express();


app.use(cors({ origin: corsOrigins }));

const limiter = rateLimit({
    windowMs: rateLimitConfig.windowMs, 
    max: rateLimitConfig.max, 
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
});
app.use(baseApi, limiter); 


app.use(logRequest); 
app.use(express.json({ limit: '10kb' })); 

app.get('/', (req, res) => {
    res.json({ message: "API opérationnelle" });
});


app.use(`${baseApi}/auth`, authRoutes);
app.use(`${baseApi}/users`, userRoutes);


app.use((req, res, next) => {
    const error: any = new Error(`Impossible de trouver ${req.originalUrl} sur ce serveur`);
    error.status = 404;
    next(error);
});


app.use(logError);


const connectionOptions = {
    serverSelectionTimeoutMS: 30000, 
    socketTimeoutMS: 30000, 
    family: 4, 
};

console.log(`Connexion à MongoDB à : ${dbUri}`);

mongoose.connect(dbUri, connectionOptions)
    .then(() => {
        console.log('Connexion MongoDB réussie.');
        
        app.listen(port, () => {
            console.log(`Serveur démarré sur le port ${port}`);
            console.log(`Chemin de base API : http://localhost:${port}${config.get<string>('app.basePath')}`);
        });
    })
    .catch((err) => {
        console.error('ERREUR FATALE DE CONNEXION BD. Le serveur NE démarre PAS.');
        console.error(`Détails de l'erreur : ${err.message}`);
        process.exit(1); 
    });

process.on('unhandledRejection', (err: Error) => {
    console.log('REJET NON GÉRÉ ! Extinction...');
    console.error(err.name, err.message);
    process.exit(1);
});