import mongoose  from "mongoose";
import Writer from "../models/writer.model.js";
import  cloudinary  from "../services/cloudinary.service.js";
import User from "../models/user.model.js";
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


const getWriters:RequestHandler=async(req, res)=>{
    try{

    }catch(error){
        console.error("Cannot get Writers!!",error);
        res.status(500).json({message: error.message});
    }
};

const getWriter:RequestHandler=async(req, res)=>{
    try{
        const {id}=req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message: "Invalid seller ID format"});
        }
        const [aggregatedSeller]=await Writer.aggregate([
            {
                $match:{
                    _id: new mongoose.Types.ObjectId(id), 
                    accountType:"Writer", 
                },
            },
            {
                $lookup:{
                    from: "Writer",
                    localField:"_id",
                    foreignField: "WriterId",
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
            return res.status(404).json({message: "Writer profile not found"});
        }
        res.status(200).json(aggregatedSeller);
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
        const Writer=await Writer.create(WriterData);
        res.status(201).json(Writer);
    }catch(error){
        onsole.error("Cannot get Writer",error);
        res.status(500).json({message: error.message});
    }
};

const updateWriterProfile:RequestHandler=async(req, res)=>{
    try{
        const WriterId=req.Writer.id;
        const Writer =   await Writer.findById(WriterId);
        
        if(!Writer) return res.status(404).json({message: "Writer not found!!"});
        if(Writer.accountType !== "Writer" && Writer.accountType !== "admin"){
            return res.status(403).json({message: "You don't have permissions to edit this"});
        }
        
        const profileData={...req.body, WriterId};
        let oldWriter=null;

        if(req.file){
            profileData.imageUrl=req.file.path;
            profileData.cloudinaryId=req.file.filename;

            oldWriter=await Writer.findOne({WriterId});
            if(oldWriter?.cloudinaryId){
                await cloudinary.uploader.destroy(oldWriter.cloudinaryId);
            }
        }

        const updated=await Writer.findOneAndUpdate(
            {WriterId},
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
        
        const currentWriter=await Writer.findById(req.Writer.id);
        const isWriter=targetWriter.WriterId.toString()===req.Writer.id;
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

const deleteWriter:RequestHandler=async(req, res)=>{
    try{
        const {id}=req.params;
        const deleteWriter=await Writer.findByIdAndDelete(id);
        if(!deleteWriter){
            return res.status(404).json({message: "Seller not found"});
        }
        if(deleteWriter.cloudinaryId){
            await cloudinary.uploader.destroy(deleteSeller.cloudinary.cloudinaryId);
        }
        res.status(200).json({
            message: "Seller deleted successfully",
            deletedWriterId: deleteWriter._id
        });
    }catch(error){
        console.error("deleteSeller error: ", error);
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