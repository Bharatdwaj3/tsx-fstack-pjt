import mongoose from "mongoose";
import createHttpError from "http-errors";
import {userModel as User} from "../models/user.model.js";
import {contentModel as Content} from "../models/content.models.js";
import cloudinary from "../service/cloudinary.service.js";
import type { RequestHandler } from "express";

const getContents:RequestHandler =async(req, res)=>{
    try{

    }catch(error){
        console.error("Cannot get Contents!!",error);
        res.status(500).json({message: error.message});
    }
};

const getContent:  RequestHandler=async(req, res)=>{
    try{
        const {id}=req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message: "Invalid seller ID format"});
        }
        const [aggregatedSeller]=await User.aggregate([
            {
                $match:{
                    _id: new mongoose.Types.ObjectId(id), 
                    accountType:"Content", 
                },
            },
            {
                $lookup:{
                    from: "Content",
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
        if(!aggregatedSeller){
            return res.status(404).json({message: "Content profile not found"});
        }
        res.status(200).json(aggregatedSeller);
    }catch(error){
        console.error("Cannot get Content",error);
        res.status(500).json({message: error.message});
    }
};

const createContent: RequestHandler=async(req, res)=>{
    try{
        const ContentData=req.body;
        if(req.file){
            ContentData.imageUrl=req.file.path;
            ContentData.cloudinaryId=req.file.filename;
        }
        const Content=await Content.create(ContentData);
        res.status(201).json(Content);
    }catch(error){
        onsole.error("Cannot get Content",error);
        res.status(500).json({message: error.message});
    }
};


const updateContent: RequestHandler=async(req, res)=>{
    try{
        const {id}=req.params;
        const updateData={...req.body};

        const targetContent=await Content.findById(id);
        if(!targetContent)  return req.status(404).json({message: "Content not found!"});
        
        const currentUser=await User.findById(req.user.id);
        const isContent=targetContent.userId.toString()===req.user.id;
        const isAdmin=currentUser?.accountType==="admin";
        
        if(!isContent && !isAdmin){
            return res.status(403).json({message:"Unathorized to update this Content!"});
        }
        
        if(req.file){
            updateData.imageUrl=req.file.path;
            updateData.cloudinaryId=req.file.filename;

            if(targetContent.cloudinaryId){
                await cloudinary.uploader.destroy(targetContent.cloudinaryId);
            }
        }

        const updated=await Content.findByIdAndUpdate(id, updateData,{
            new: true,
            runValidators: true,
        });

        res.status(200).json(updated);
    }catch(error){
        console.error("UpdateSeller error: ",error);
        res.status(500).json({message: error.message});
    }
};

const deleteContent: RequestHandler=async(req, res)=>{
    try{
        const {id}=req.params;
        const deleteContent=await Content.findByIdAndDelete(id);
        if(!deleteContent){
            return res.status(404).json({message: "Seller not found"});
        }
        if(deleteContent.cloudinaryId){
            await cloudinary.uploader.destroy(deleteSeller.cloudinary.cloudinaryId);
        }
        res.status(200).json({
            message: "Seller deleted successfully",
            deletedContentId: deleteContent._id
        });
    }catch(error){
        console.error("deleteSeller error: ", error);
        res.status(500).json({message: error.message});
    }
};

export {
  getContents,
  getContent,
  createContent,
  updateContent,
  deleteContent,
};