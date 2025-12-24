import  mongoose from "mongoose";
import express from 'express';

export const reader_Schema=new mongoose.Schema({
    
    
    bio:{
        type:String,
        required: true,
        trim: true
    },
    interests:{
        type:[String],
        enum: ['fiction','science','art','daily'],
    },
    saved: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'content' 
    }],
    liked: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'content' 
    }],
    following: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    }],
    comment: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'content'
    }],

    mediaUrl: { type: String, default: '' },
    cloudinaryId: { type: String, default: '' }
},{
    timestamps: true
    }
);

export const readerModel = mongoose.model('readerModel', reader_Schema,'reader');
