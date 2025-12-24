import express from "express";
const router = express.Router();  
import upload from "../service/multer.service.js";
import {
  getReaders,
  getReader,
  createReader,
  updateReaderProfile,
  deleteReader
} from "../controllers/reader.controller.js";
import {checkPermission} from "../middleware/permission.middleware.js";
import {roleMiddleware} from "../middleware/role.middleware.js";
import {authUser} from "../middleware/auth.middleware.js";


router.get(
    '/',
    roleMiddleware(['admin','reader','writer']),
    checkPermission('list_leaders'),
    getReaders
);

router.get(
    '/profile/:id',
    roleMiddleware(['admin','reader']),
    checkPermission('view_reader'),
    getReader
);

router.get(
    '/profile/:id',
    roleMiddleware(['admin','reader']),
    checkPermission('create_reader'),
    createReader
);

router.get(
    '/profile/:id',
    authUser,
    roleMiddleware(['admin','reader']),
    checkPermission('update_profile'),
    updateReaderProfile
);

router.get(
    '/profile/:id',
    authUser,
    roleMiddleware(['admin','reader']),
    checkPermission('deactivate_account'),
    deleteReader
);

export default router;