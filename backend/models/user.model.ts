import mongoose, {Schema, model} from "mongoose";
import express from 'express';
import type { InferSchemaType} from "mongoose";

const user_Schema=new Schema({
    userName: {
        type:String,
        required:[true, 'User Name is required'],
        trim:true,
        minLength:2,
        maxLength:50,
    },
    fullName: {
        type:String,
        required:[true, 'Full Name is required'],
        trim:true,
        minLength:2,
        maxLength:50,
    },
    email:{
        type:String,
        required:[true, 'User email is required'],
        unique:true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email address'],
    },
    password:{
        type:String,
        required:[true, 'User Password is required'],
        minLength:6,
    },
    googleId: { type: String, sparse: true, select: false },
    discordId: { type: String, sparse: true, select: false },
    avatar: { type: String },
    accountType: {
        type: String,
        required: [true, 'Account type required'],
            enum: {
                values: ['reader', 'writer', 'admin'],
                message: 'Invalid account type'
        }
    },
    refreshToken:{type: String, default:null, select:false},
    lastLogin:{type:Date, default:Date.now},
    isEmailVerified:{type:Boolean, default:false},
    isActive:{type:Boolean, default: true},
 
    emailVerificationToken: {type:String, select:false},
    emailVerificationExpires: {type: Date, select: false}
},{
    timestamps:true,
    
});


type User=InferSchemaType<typeof user_Schema>

export default model<User>('userModel', user_Schema,'user');
