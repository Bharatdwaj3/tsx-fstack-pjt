import mongoose from "mongoose";
import Reader from "../models/reader.model.js";
import User from "../models/user.model.js";
import cloudinary from "../services/cloudinary.service.js";
import type { RequestHandler } from "express";

interface res_Registration{
  success: boolean,
  message: String,
  code: String
};

interface res_Profile{
  success: boolean,
  message: String,
  code: String
};

interface res_OAuth_Discord{
  success: boolean,
  message: String,
  code: String
};

interface res_OAuth_Google{
  success: boolean,
  message: String,
  code: String
};

interface res_Login{
  success: boolean,
  message: String,
  code: String
};


const getReaders:RequestHandler=async(req, res)=>{
    try{

    }catch(error){
        console.error("Cannot get Readers!!",error);
        res.status(500).json({message: error.message});
    }
};

const getReader:RequestHandler=async(req, res)=>{
    try{
        const {id}=req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message: "Invalid Reader ID format"});
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
                                accountType: "$accountType",
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
        res.status(201).json(Reader);
    }catch(error){
        onsole.error("Cannot get Reader",error);
        res.status(500).json({message: error.message});
    }
};

const updateReaderProfile:RequestHandler=async(req, res)=>{
    try{
        const userId=req.user.id;
        const user =   await User.findById(userId);
        
        if(!user) return res.status(404).json({message: "User not found!!"});
        if(user.accountType !== "Reader" && user.accountType !== "admin"){
            return res.status(403).json({message: "You don't have permissions to edit this"});
        }
        
        const profileData={...req.body, userId};
        let oldReader=null;

        if(req.file){
            profileData.imageUrl=req.file.path;
            profileData.cloudinaryId=req.file.filename;

            oldReader=await Reader.findOne({userId});
            if(oldReader?.cloudinaryId){
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
        if(!targetReader)  return req.status(404).json({message: "Reader not found!"});
        
        const currentUser=await User.findById(req.user.id);
        const isReader=targetReader.userId.toString()===req.user.id;
        const isAdmin=currentUser?.accountType==="admin";
        
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

        const updated=await Reader.findByIdAndUpdate(id, updateData,{
            new: true,
            runValidators: true,
        });

        res.status(200).json(updated);
    }catch(error){
        console.error("UpdateReader error: ",error);
        res.status(500).json({message: error.message});
    }
};

const deleteReader:RequestHandler=async(req, res)=>{
    try{
        const {id}=req.params;
        const deleteReader=await Reader.findByIdAndDelete(id);
        if(!deleteReader){
            return res.status(404).json({message: "Reader not found"});
        }
        if(deleteReader.cloudinaryId){
            await cloudinary.uploader.destroy(deleteReader.cloudinary.cloudinaryId);
        }
        res.status(200).json({
            message: "Reader deleted successfully",
            deletedReaderId: deleteReader._id
        });
    }catch(error){
        console.error("deleteReader error: ", error);
        res.status(500).json({message: error.message});
    }
};

export {
  getReaders,
  getReader,
  createReader,
  updateReaderProfile,
  updateReader,
  deleteReader,
};