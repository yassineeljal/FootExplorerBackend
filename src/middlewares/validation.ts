import { Request, Response, NextFunction } from 'express';

const USER_REGEX = {
    username: /^[A-Za-z0-9._-]{3,30}$/, 
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /.{8,}/, 
};

const userSchema = {
    username: { regex: USER_REGEX.username, message: "Le nom d'utilisateur est invalide (3-30 caractères, pas de caractères spéciaux sauf ._-)" },
    email: { regex: USER_REGEX.email, message: "Le format de l'email est invalide." },
    password: { regex: USER_REGEX.password, message: "Le mot de passe doit contenir au moins 8 caractères." },
    name: { regex: /.+/, message: "Le nom complet est requis." }
};


export const validate = (schema: any, location: 'body' | 'params' = 'body') => {
    return (req: Request, res: Response, next: NextFunction) => {
        
        const data = req[location];
        const errors: { field: string, message: string }[] = [];

        for (const field in schema) {
            const rule = schema[field];
            const value = data[field];

            if (!value) {
                errors.push({ field, message: `${field} est requis.` });
                continue; 
            }

            if (!rule.regex.test(value)) {
                errors.push({ field, message: rule.message });
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'Erreur de validation des données.',
                errors: errors
            });
        }

        next();
    };
};

export const validateSignup = validate(userSchema, 'body');

