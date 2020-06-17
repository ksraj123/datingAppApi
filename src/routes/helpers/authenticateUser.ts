import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

export default (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET || "secret");
        (req as any).user = verified;
        next();
    } catch(err) {
        res.status(400).send('Invalid Token!');
    }
}