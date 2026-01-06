import mongoose  from "mongoose";
import Writer from "../models/writer.model.js";
import  cloudinary  from "../services/cloudinary.service.js";
import User from "../models/user.model.js";
import type { RequestHandler } from "express";

import {
    req_putCreator,
    res_putCreator,res_delCreator,res_listCreators,res_profileCreator
} from '../types.js';

const getWriters:RequestHandler=async(req, res:res_listCreators)=>{
    try{
        const writer = await Writer.find({}).lean();
    res.status(200).json(writer);
    }catch(error){
        console.error("Cannot get Writers!!",error);
        res.status(500).json({message: error.message});
    }
};

const getWriter:RequestHandler=async(req, res:res_profileCreator)=>{
    try{
        const {id}=req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message: "Invalid Writer ID format"});
        }
        const [aggregatedWriter]=await User.aggregate([
            {
                $match:{
                    _id: new mongoose.Types.ObjectId(id), 
                    accountType:"writer", 
                },
            },
            {
                $lookup:{
                    from: "writer",
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
        if(!aggregatedWriter){
            return res.status(404).json({message: "Writer profile not found"});
        }
        res.status(200).json(aggregatedWriter);
    }catch(error){
        console.error("Cannot get Writer",error);
        res.status(500).json({message: error.message});
    }
};

const createWriter:RequestHandler=async(req, res)=>{
    try{
        const WriterData=req.body;
        if(req.file){
            WriterData.imageUrl=req.file.path;
            WriterData.cloudinaryId=req.file.filename;
        }
        const writer=await writer.create(WriterData);
        res.status(201).json(writer);
    }catch(error){
        console.error("Cannot create Writer",error);
        res.status(500).json({message: error.message});
    }
};

const updateWriterProfile:RequestHandler=async(req:req_putCreator, res:res_putCreator)=>{
    try{
        const userId=req.user.id;
        const user =   await User.findById(userId);
        
        if(!user) return res.status(404).json({message: "Writer not found!!"});
        if(user.accountType !== "writer" && user.accountType !== "admin"){
            return res.status(403).json({message: "You don't have permissions to edit this"});
        }
        
        const profileData={...req.body, userId};
        let oldWriter=null;

        if(req.file){
            profileData.imageUrl=req.file.path;
            profileData.cloudinaryId=req.file.filename;

            oldWriter=await Writer.findOne({userId});
            if(oldWriter?.cloudinaryId){
                await cloudinary.uploader.destroy(oldWriter.cloudinaryId);
            }
        }

        const updated=await Writer.findOneAndUpdate(
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
        console.error("Writer Profile Updation Error!!",error);
        res.status(500).json({message: error.message});
    }
};

const updateWriter:RequestHandler=async(req, res)=>{
    try{
        const {id}=req.params;
        const updateData={...req.body};

        const targetWriter=await Writer.findById(id);
        if(!targetWriter)  return req.status(404).json({message: "Writer not found!"});
        
        const currentWriter=await Writer.findById(req.writer.id);
        const isWriter=targetWriter.writerId.toString()===req.writer.id;
        const isAdmin=currentWriter?.accountType==="admin";
        
        if(!isWriter && !isAdmin){
            return res.status(403).json({message:"Unathorized to update this Writer!"});
        }
        
        if(req.file){
            updateData.imageUrl=req.file.path;
            updateData.cloudinaryId=req.file.filename;

            if(targetWriter.cloudinaryId){
                await cloudinary.uploader.destroy(targetWriter.cloudinaryId);
            }
        }

        const updated=await Writer.findByIdAndUpdate(id, updateData,{
            new: true,
            runValidators: true,
        });

        res.status(200).json(updated);
    }catch(error){
        console.error("UpdateSeller error: ",error);
        res.status(500).json({message: error.message});
    }
};

const deleteWriter:RequestHandler=async(req, res:res_delCreator)=>{
    try{
        const {id}=req.params;
        const deleteWriter=await Writer.findByIdAndDelete(id);
        if(!deleteWriter){
            return res.status(404).json({message: "Writer not found"});
        }
        if(deleteWriter.cloudinaryId){
            await cloudinary.uploader.destroy(deleteWriter.cloudinaryId);
        }
        res.status(200).json({
            message: "Writer deleted successfully",
            deletedWriterId: deleteWriter._id
        });
    }catch(error){
        console.error("Seller deletion error: ", error);
        res.status(500).json({message: error.message});
    }
};

export  {
  getWriters,
  getWriter,
  createWriter,
  updateWriterProfile,
  updateWriter,
  deleteWriter,
};