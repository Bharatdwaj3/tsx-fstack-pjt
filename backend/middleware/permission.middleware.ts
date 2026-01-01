import type { NextFunction, Request, Response } from "express";
import  PERMISSIONS from "../config/permissions.config.js";

export const checkPermission=(permission: string)=>{
    return (req: Request, res: Response, next: NextFunctiont)=>{
        const userRole = req.role || req.user?.accountType || 'guest';
        const allowed = PERMISSIONS[userRole] || [];
        if(!allowed.includes(permission)){
            return res.status(403).json({message: 'Access denied insuffient permissions'});
        }
        next();
    };
};
