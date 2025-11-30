import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import { existsSync, mkdirSync } from 'node:fs';

if (!existsSync('logs')) mkdirSync('logs', { recursive: true });

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()), 
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
      level: 'debug'
    }), 
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.File({ filename: 'logs/warn.log',  level: 'warn'  }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});



export function logRequest(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const entry = `${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`;
    
    const level = res.statusCode >= 500 ? 'error'
                  : res.statusCode >= 400 ? 'warn'
                  : 'info';

    logger.log({ level, message: entry, duration: `${duration}ms`, statusCode: res.statusCode });
  });

  next();
}



export function logError(err: any, _req: Request, res: Response, _next: NextFunction) {
  logger.error(err?.message || 'Internal error', { stack: err?.stack, status: err?.status || 500 });
  
  res.status(err?.status || 500).json({ 
    error: err?.message || 'Erreur interne',
    code: err?.status || 500
  });
}