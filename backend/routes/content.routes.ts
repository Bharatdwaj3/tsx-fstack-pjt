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
    roleMiddleware(['admin','reader','creator']),
    checkPermission('list_contents'),
    getContents
);

router.get(
    '/profile/:id',
    roleMiddleware(['admin','reader','creator']),
    checkPermission('list_Content'),
    getContent
);

router.get(
    '/profile/:id',
    roleMiddleware(['creator']),
    checkPermission('create_content'),
    createContent
);

router.get(
    '/profile/:id',
    authUser,upload.single('image'),
    roleMiddleware(['creator']),
    checkPermission('update_content'),
    updateContent
);

router.get(
    '/profile/:id',
    authUser,
    roleMiddleware(['admin','creator']),
    checkPermission('update_profile'),
    updateContentProfile
);

router.get(
    '/profile/:id',
    authUser,
    roleMiddleware(['admin','creator']),
    checkPermission('deactivate_account'),
    deleteContent
);

export default router;