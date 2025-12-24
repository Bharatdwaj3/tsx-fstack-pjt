import express from "express";
const router = express.Router();  
import upload from "../service/multer.service.js";


import {
  getWriter,
  updateWriterProfile,
  deleteWriter
} from "../controllers/Writer.controller.js";

import {checkPermission} from "../middleware/permission.middleware.js";
import {roleMiddleware} from "../middleware/role.middleware.js";
import {authUser} from "../middleware/auth.middleware.js";



router.get(
    '/profile/:id',
    roleMiddleware(['admin','Writer']),
    checkPermission('view_profile'),
    getWriter
);

router.get(
    '/profile/:id',
    upload.single('image'),
    authUser,
    roleMiddleware(['admin','reader']),
    checkPermission('edit_profile'),
    updateWriterProfile
);

router.get(
    '/profile/:id',
    authUser,
    roleMiddleware(['admin','reader']),
    checkPermission('deactivate_account'),
    deleteWriter
);

export default router;