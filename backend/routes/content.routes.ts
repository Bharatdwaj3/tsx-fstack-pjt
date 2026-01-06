import upload from "../services/multer.service.js";
import { Router } from 'express';

const router = Router();

import {
  getContents,
  getContent,
  createContent,
  updateContent,
  deleteContent
} from "../controller/content.controller.js";

import {checkPermission} from "../middleware/permission.middleware.js";
import {roleMiddleware} from "../middleware/role.middleware.js";
import {authUser} from "../middleware/auth.middleware.js";

router.get(
    '/',
    authUser,
    roleMiddleware(['admin','reader','writer']),
    checkPermission('list_contents'),
    getContents
);

router.get(
    '/:id',
    authUser,
    roleMiddleware(['admin','reader','writer']),
    checkPermission('show_Content'),
    getContent
);

router.post(
    '/',
    authUser,
    roleMiddleware(['writer']),
    checkPermission('create_content'),
    upload.single('image'),
    createContent
);

router.put(
    '/:id',
    authUser,
    upload.single('image'),
    roleMiddleware(['writer']),
    checkPermission('update_content'),
    updateContent
);

router.delete(
    '/:id',
    authUser,
    roleMiddleware(['admin','writer']),
    checkPermission('delete_account'),
    deleteContent
);

export default router;