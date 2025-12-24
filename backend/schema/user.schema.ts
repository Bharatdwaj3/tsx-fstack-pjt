import express from 'express';
import mongoose from "mongoose";
export const user_Schema=new mongoose.Schema({
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
                values: ['consumer', 'author', 'admin', 'guest'],
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
    toJSON: { virtuals: true, transform: (doc, ret) => { delete ret.password; } },
    toObject: { virtuals: true, transform: (doc, ret) => { delete ret.password; } }
});


export const contentModel = mongoose.model('contentModel', content_Schema,'content');
