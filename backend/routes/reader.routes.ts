import { Router } from 'express';
const router = Router();
import upload from "../services/multer.service.js";
import {
  getReaders,
  getReader,
  updateReaderProfile,
  deleteReader
} from "../controller/reader.controller.js";
import {checkPermission} from "../middleware/permission.middleware.js";
import {roleMiddleware} from "../middleware/role.middleware.js";
import {authUser} from "../middleware/auth.middleware.js";


router.get('/',
    authUser,
    roleMiddleware(['admin','reader','writer']),
    checkPermission('list_readers'),
    getReaders
);

router.get('/:id',
    authUser,
    roleMiddleware(['admin','reader']),
    checkPermission('view_reader'),
    getReader
);

router.put('/profile/:id',
    authUser,
    roleMiddleware(['admin','reader']),
    checkPermission('update_reader'),
    upload.single('image'),
    updateReaderProfile
);

router.delete('/profile/:id',
    authUser,
    roleMiddleware(['admin','reader']),
    checkPermission('delete_reader'),
    deleteReader
);

export default router;