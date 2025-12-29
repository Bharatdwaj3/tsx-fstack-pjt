import jwt from "jsonwebtoken";
import User  from '../models/user.model.js';
import { JWT_ACC_SECRECT } from "../config/env.config.js";
import type { Express, Request, Response, NextFunction } from "express";

import express from "express";


export const authUser = async (req: Request, res: Response, next: NextFunction) => {


  let payload = null;
  let authMethod = null;
  const token = req.cookies.accessToken;
  if (token) {
    try {
      payload = jwt.verify(token, JWT_ACC_SECRECT);
      req.user = payload.user;
      authMethod = "jwt";

      const user = await User.findById(payload.user.id).select("isActive");
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "User interaction or deleted" });
      }
      return next();
    } catch (errr) {
      console.warn(`JWT verification failed: ${errr.message}`);
      return res.status(401).json({ message: "Invalid token", code: "JWT_VERIFY_FAIL" });
    }
  }
    if (req.session && req.session.passport && req.session.passport.user) {
    try {
      const sessionUser = await User.findById(req.session.passport.user).select("isActive");
      if (sessionUser && sessionUser.isActive) { 
        req.user = { id: sessionUser._id, accountType: sessionUser.accountType };
        req.authMethod = "session";
        return next();
      }
    } catch (err) {
      console.error("Session user validation failed: ", err);
    }
  }

return res.status(401).json({
  success: false,
  message: "Access denied: no valid token or session",
  code: "Auth_required",
});
};