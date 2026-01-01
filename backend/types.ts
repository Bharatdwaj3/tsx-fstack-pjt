//Request Type

export interface req_Registeration {
    userName:string;
    fullName:string;
    email:string;
    password:string;
    googleId:null|string;
    discordId:null|string;
    avatar:string;
    accountType:string;
    isEmailVerified:boolean;
    isActive:boolean;
}

export interface req_Login {
    email:string;
    password:string;
}

//Response Types

export interface res_Registration {
    success:boolean;
    message:string;
    requiresVerfication: boolean;
    user:{
        id:string;
        email: string;
    };
}

export interface res_Login {
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
}

