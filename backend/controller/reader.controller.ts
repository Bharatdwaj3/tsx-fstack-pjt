import mongoose  from "mongoose";
import Reader from "../models/reader.model.js";
import  cloudinary  from "../services/cloudinary.service.js";
import User from "../models/user.model.js";
import type { RequestHandler } from "express";

import {
    req_putReader,
    res_putReader,res_delReader,res_listReaders,res_profileReader
} from '../types.js';

const getReaders:RequestHandler=async(req, res:res_listReaders)=>{
    try{
        const reader = await Reader.find({}).lean();
    res.status(200).json(reader);
    }catch(error){
        console.error("Cannot get Readers!!",error);
        res.status(500).json({message: error.message});
    }
};

const getReader:RequestHandler=async(req, res:res_profileReader)=>{
    try{
        const {id}=req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message: "Invalid Writer ID format"});
        }
        const [aggregatedReader]=await User.aggregate([
            {
                $match:{
                    _id: new mongoose.Types.ObjectId(id), 
                    accountType:"reader", 
                },
            },
            {
                $lookup:{
                    from: "reader",
                    localField:"_id",
                    foreignField: "userId",
                    as: "profile",
                },
            },
            {$unwind: {path: "$profile", preserveNullAndEmptyArrays: false}},
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            {
                                _id: "$_id",
                                fullName: "$fullName",
                                email: "$email",
                                accountType: "$accountTYpe",
                            },
                            {$ifNull: ["$profile",{}]},
                        ],
                    },
                },
            },
        ]);
        if(!aggregatedReader){
            return res.status(404).json({message: "Reader profile not found"});
        }
        res.status(200).json(aggregatedReader);
    }catch(error){
 console.error("Cannot get Reader",error);
        res.status(500).json({message: error.message});
    }
};

const createReader:RequestHandler=async(req, res)=>{
    try{
        const ReaderData=req.body;
        if(req.file){
            ReaderData.imageUrl=req.file.path;
            ReaderData.cloudinaryId=req.file.filename;
        }
        const Reader=await Reader.create(ReaderData);
        res.status(201).json(reader);
    }catch(error){
        console.error("Cannot create Reader",error);
        res.status(500).json({message: error.message});
    }
};

const updateReaderProfile:RequestHandler=async(req:req_putReader, res:res_putReader)=>{
    try{
        const userId=req.user.id;
        const user =   await User.findById(userId);
        
        if(!user) return res.status(404).json({message: "Reader not found!!"});
        if(user.accountType !== "reader" && user.accountType !== "admin"){
            return res.status(403).json({message: "You don't have permissions to edit this"});
        }
        
        const profileData={...req.body, userId};
        let oldWriter=null;

        if(req.file){
            profileData.imageUrl=req.file.path;
            profileData.cloudinaryId=req.file.filename;

            oldWriter=await Reader.findOne({userId});
            if(oldWriter?.cloudinaryId){
                await cloudinary.uploader.destroy(oldReader.cloudinaryId);
            }
        }

        const updated=await Reader.findOneAndUpdate(
            {userId},
            {$set: profileData},
            {
                new: true,
                upsert: true,
                setDefaultOnInsert: true,
                runValidators: true,
            }
        );
        res.status(200).json(updated);
    }catch(error){
        console.error("Reader Profile Updation Error!!",error);
        res.status(500).json({message: error.message});
    }
};

const updateReader:RequestHandler=async(req, res)=>{
    try{
        const {id}=req.params;
        const updateData={...req.body};

        const targetReader=await Reader.findById(id);
        if(!targetReader)  return req.status(404).json({message: "Writer not found!"});
        
        const currentReader=await Reader.findById(req.reader.id);
        const isWriter=targetReader.readerId.toString()===req.reader.id;
        const isAdmin=currentReader?.accountType==="admin";
        
        if(!isReader && !isAdmin){
            return res.status(403).json({message:"Unathorized to update this Reader!"});
        }
        
        if(req.file){
            updateData.imageUrl=req.file.path;
            updateData.cloudinaryId=req.file.filename;

            if(targetReader.cloudinaryId){
                await cloudinary.uploader.destroy(targetReader.cloudinaryId);
            }
        }

        const updated=await Writer.findByIdAndUpdate(id, updateData,{
            new: true,
            runValidators: true,
        });

        res.status(200).json(updated);
    }catch(error){
        console.error("Update Reader error: ",error);
        res.status(500).json({message: error.message});
    }
};

const deleteReader:RequestHandler=async(req, res:res_delReader)=>{
    try{
        const {id}=req.params;
        const deleteReader=await Reader.findByIdAndDelete(id);
        if(!deleteReader){
            return res.status(404).json({message: "Reader not found"});
        }
        if(deleteReader.cloudinaryId){
            await cloudinary.uploader.destroy(deleteReader.cloudinaryId);
        }
        res.status(200).json({
            message: "Reader deleted successfully",
            deletedReaderId: deleteReader._id
        });
    }catch(error){
        console.error("Reader deletion error: ", error);
        res.status(500).json({message: error.message});
    }
};

export  {
  getReaders,
  getReader,
  createReader,
  updateReaderProfile,
  updateReader,
  deleteReader,
};