import { Request, Response } from 'express';

//Request Types

export interface req_Registeration extends Request {
    body:{
        userName:string;
        fullName:string;
        email:string;
        password:string;
        googleId?:null|string;
        discordId?:null|string;
        avatar?:string;
        accountType?:string;
        isEmailVerified?:boolean;
        isActive?:boolean;
    }
}

export interface req_Login extends Request {
    body:{
        email:string;
        password:string;
    }
}

//Response Types

export interface res_Registration extends Response{
    json(body:{
        success:boolean;
        message:string;
        requiresVerfication: boolean;
        user:{
            id:string;
            email: string;
        };
    }):this;
}

export interface res_Login extends Response {
    json(body:{
        success: boolean;
        message: string;
        user:    {
            id:string;
            userName:string;
            fullName:string;
            email:string;
            accountType:string;
            lastLogin:Date;
        };
    }):this;
}

