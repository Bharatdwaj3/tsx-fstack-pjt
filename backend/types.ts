import { Request, Response } from "express";

//Request Types

/*Auth requests*/

export interface req_Registeration extends Request {
  body: {
    userName: string;
    fullName: string;
    email: string;
    password: string;
    googleId?: null | string;
    discordId?: null | string;
    avatar?: string;
    accountType?: string;
    isEmailVerified?: boolean;
    isActive?: boolean;
  };
}

export interface req_Login extends Request {
  body: {
    email: string;
    password: string;
  };
}

/*Creator requests*/

export interface req_putCreator extends Request {
  body: {
    bio: string;
    intrests: string[];
    authored: string[];
    followers: string[];
    following: string[];
    mediaUrl: string;
    cloudinaryId: string;
  };
}

export interface req_getCreator extends Request {
  email: string;
  password: string;
}

/*Reader requests*/

export interface req_putReader extends Request {
  body: {
     userId:       string;
    bio:          string;
    interests:    string[];
    saved:        string[];
    liked:        string[];
    following:    string[];
    comment:      string[];
    mediaUrl:     string;
    cloudinaryId: string;
  };
}

export interface req_getReader extends Request {
  email: string;
  password: string;
}

/*Content requests*/

export interface req_putContent extends Request {
  body: {
   
  };
}

export interface req_postContent extends Request {
  body: {
   
  };
}



//Response Types

export interface res_Registration extends Response {
  json(body: {
    success: boolean;
    message: string;
    requiresVerfication: boolean;
    user: {
      id: string;
      email: string;
    };
  }): this;
}

export interface res_Login extends Response {
  json(body: {
    success: boolean;
    message: string;
    user: {
      id: string;
      userName: string;
      fullName: string;
      email: string;
      accountType: string;
      lastLogin: Date;
    };
  }): this;
}

//Creator Responses

export interface res_listCreators extends Response {
  json(body: {
    _id: string;
    userId: string;
    __v: number;
    authored: string[];
    bio: string;
    cloudinaryId: string;
    createdAt: Date;
    followers: string[];
    following: string[];
    intrests: string[];
    mediaUrl: string;
    updatedAt: Date;
  }): this;
}

export interface res_putCreator extends Response {
  json(body: {
    _id:          string;
    userId:       string;
    __v:          number;
    bio:          string;
    cloudinaryId: string;
    comment:      string[];
    createdAt:    Date;
    following:    string[];
    interests:    string[];
    liked:        string[];
    mediaUrl:     string;
    saved:        string[];
    updatedAt:    Date;
  }): this;
}

export interface res_profileCreator extends Response{
  json(body:{
      _id:          string;
    fullName:     string;
    email:        string;
    userId:       string;
    __v:          number;
    authored:     any[];
    bio:          string;
    cloudinaryId: string;
    createdAt:    Date;
    followers:    any[];
    following:    any[];
    intrests:     any[];
    mediaUrl:     string;
    updatedAt:    Date;
}):this;

}

export interface res_delCreator extends Response{
    json(body:{
      message:string;
      deletedWriterId:string;
    }):this;
}

/*Reader responses*/

export interface res_listReaders extends Response {
  json(body: {
    _id:          string;
    userId:       string;
    __v:          number;
    bio:          string;
    cloudinaryId: string;
    comment:      string[];
    createdAt:    Date;
    following:    string[];
    interests:    string[];
    liked:        string[];
    mediaUrl:     string;
    saved:        string[];
    updatedAt:    Date;
  }): this;
}

export interface res_putReader extends Response {
  json(body: {
    _id:          string;
    userId:       string;
    __v:          number;
    bio:          string;
    cloudinaryId: string;
    comment:      string[];
    createdAt:    Date;
    following:    string[];
    interests:    string[];
    liked:        string[];
    mediaUrl:     string;
    saved:        string[];
    updatedAt:    Date;
  }): this;
}

export interface res_profileReader extends Response{
  json(body:{
       _id:          string;
    fullName:     string;
    email:        string;
    userId:       string;
    __v:          number;
    bio:          string;
    cloudinaryId: string;
    comment:      string[];
    createdAt:    Date;
    following:    string[];
    interests:    string[];
    liked:        string[];
    mediaUrl:     string;
    saved:        string[];
    updatedAt:    Date;
}):this;

}



export interface res_delReader extends Response{
    json(body:{
      message:string;
      deletedWriterId:string;
    }):this;
}

/*Content responses*/

export interface res_postContent extends Response{
    json(body:{
      message:string;
      deletedWriterId:string;
    }):this;
}

export interface res_getContent extends Response{
  json(body:{

  }):this;
}

export interface res_putContent extends Response{
  json(body:{

  }):this;
}

export interface res_listContent extends Response{
  json(body:{

  }):this;
}

export interface res_delContent extends Response{
    json(body:{
      message:string;
      deletedWriterId:string;
    }):this;
}

//Error type

export interface res_error extends Response{
  json(body:{
    success: boolean,
    message: string,
    code: string,
}):this;
}