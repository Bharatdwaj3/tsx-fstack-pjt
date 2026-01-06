import mongoose, {Schema, model} from "mongoose";
import express from 'express';
import type { InferSchemaType} from "mongoose";


const reader_Schema=new Schema({
     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    
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

type Reader=InferSchemaType<typeof reader_Schema>

export default model<Reader>('readerModel', reader_Schema,'reader');
