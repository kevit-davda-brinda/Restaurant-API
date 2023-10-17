import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { UserModel } from "../model/user";

const SECRATE_KEY = "secrate_key";

export const auth =  async (req: Request, res: Response, next: NextFunction) => {
    //Extract token from the req

    try{
        const token = req.headers.authorization?.split('Bearer ')[1];


    if (!token) {
        return res.status(401).json({ error: 'Unauthorised' });
    }

    //verified token
    const decoded : any = await jwt.verify(token, SECRATE_KEY);

    // console.log('line 20 from auth');
    // console.log(decoded);

    const user = await UserModel.findOne({_id : decoded._id });

    // req.user = user;
    }
    catch(e){
        res.status(401).send({error : e});
    }
    
    next();
}